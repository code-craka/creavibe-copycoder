#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import chalk from "chalk"

// Configuration
const config = {
  // Directories to scan
  directories: ["app", "components", "lib", "middleware.ts"],

  // Patterns to check for
  patterns: {
    // Security issues
    hardcodedSecrets: /(?:password|secret|key|token|auth).*?['"`]([a-zA-Z0-9_\-.=]{8,})['"`]/gi,
    insecureRandomness: /Math\.random$$$$/g,
    directDomAccess: /document\.|window\./g,
    dangerouslySetInnerHTML: /dangerouslySetInnerHTML/g,
    evalUsage: /eval\(|new Function\(/g,

    // RLS checks
    missingUserIdFilter: /from$$['"`][^'"`]+['"`]$$\.select$$[^)]*$$(?!\.eq\(['"`]user_id['"`],)/g,

    // CORS checks
    corsAnyOrigin: /Access-Control-Allow-Origin.*?\*/g,

    // CSP checks
    unsafeInline: /'unsafe-inline'/g,
    unsafeEval: /'unsafe-eval'/g,
  },
}

// Colors for output
const colors = {
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  success: chalk.green,
}

// Run npm audit
function runNpmAudit() {
  console.log(colors.info("Running npm audit..."))
  try {
    const output = execSync("npm audit --json").toString()
    const auditResults = JSON.parse(output)

    if (auditResults.vulnerabilities) {
      const { critical, high, moderate, low } = auditResults.vulnerabilities

      if (critical || high) {
        console.log(colors.error(`Found ${critical || 0} critical and ${high || 0} high severity vulnerabilities!`))
      } else if (moderate) {
        console.log(colors.warning(`Found ${moderate} moderate severity vulnerabilities.`))
      } else if (low) {
        console.log(colors.info(`Found ${low} low severity vulnerabilities.`))
      } else {
        console.log(colors.success("No vulnerabilities found."))
      }
    }
  } catch (error) {
    console.log(colors.error("Error running npm audit:"), error.message)
  }
}

// Scan files for security issues
function scanFiles() {
  console.log(colors.info("Scanning files for security issues..."))

  const issues = []

  // Walk through directories
  config.directories.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir)

    if (fs.existsSync(fullPath)) {
      if (fs.lstatSync(fullPath).isDirectory()) {
        walkDir(fullPath, issues)
      } else {
        checkFile(fullPath, issues)
      }
    }
  })

  // Report issues
  if (issues.length === 0) {
    console.log(colors.success("No security issues found in code scan."))
  } else {
    console.log(colors.error(`Found ${issues.length} potential security issues:`))
    issues.forEach((issue) => {
      console.log(colors.warning(`[${issue.type}] ${issue.file}:${issue.line} - ${issue.description}`))
    })
  }
}

// Walk directory recursively
function walkDir(dir, issues) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)

    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath, issues)
    } else {
      checkFile(fullPath, issues)
    }
  })
}

// Check a single file for security issues
function checkFile(file, issues) {
  // Skip node_modules and .next
  if (file.includes("node_modules") || file.includes(".next")) {
    return
  }

  // Only check certain file types
  if (!/\.(js|jsx|ts|tsx)$/.test(file)) {
    return
  }

  const content = fs.readFileSync(file, "utf8")
  const lines = content.split("\n")

  // Check each pattern
  Object.entries(config.patterns).forEach(([type, pattern]) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      // Find line number
      const lineIndex = content.substring(0, match.index).split("\n").length - 1

      issues.push({
        file: path.relative(process.cwd(), file),
        line: lineIndex + 1,
        type,
        description: getDescriptionForIssue(type, match[0]),
      })
    }
  })
}

// Get description for an issue type
function getDescriptionForIssue(type, match) {
  const descriptions = {
    hardcodedSecrets: "Possible hardcoded secret or credential",
    insecureRandomness: "Using Math.random() for security-sensitive operations is insecure",
    directDomAccess: "Direct DOM access may cause issues in SSR",
    dangerouslySetInnerHTML: "Using dangerouslySetInnerHTML can lead to XSS vulnerabilities",
    evalUsage: "Using eval() or new Function() is dangerous",
    missingUserIdFilter: "Database query missing user_id filter, potential data leak",
    corsAnyOrigin: "CORS configured to allow any origin (*)",
    unsafeInline: "CSP allows unsafe-inline which reduces XSS protection",
    unsafeEval: "CSP allows unsafe-eval which reduces security",
  }

  return descriptions[type] || "Unknown security issue"
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log(colors.info("Checking environment variables..."))

  const envFile = path.join(process.cwd(), ".env.example")
  if (!fs.existsSync(envFile)) {
    console.log(colors.warning("No .env.example file found. Consider creating one with required variables."))
    return
  }

  const envContent = fs.readFileSync(envFile, "utf8")
  const envLines = envContent.split("\n").filter((line) => line.trim() && !line.startsWith("#"))

  // Check for sensitive variables exposed to the client
  const clientExposedVars = envLines
    .filter(
      (line) =>
        line.startsWith("NEXT_PUBLIC_") && (line.includes("KEY") || line.includes("SECRET") || line.includes("TOKEN")),
    )
    .map((line) => line.split("=")[0])

  if (clientExposedVars.length > 0) {
    console.log(colors.warning("Potentially sensitive variables exposed to the client:"))
    clientExposedVars.forEach((variable) => {
      console.log(colors.warning(`  - ${variable}`))
    })
  } else {
    console.log(colors.success("No sensitive variables exposed to the client."))
  }
}

// Main function
function main() {
  console.log(colors.info("Starting security audit..."))

  runNpmAudit()
  scanFiles()
  checkEnvironmentVariables()

  console.log(colors.info("Security audit complete."))
}

main()
