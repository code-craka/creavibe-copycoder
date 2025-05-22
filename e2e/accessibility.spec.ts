import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Accessibility", () => {
  test("home page should not have any automatically detectable accessibility issues", async ({ page }) => {
    await page.goto("/")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test("login page should not have any automatically detectable accessibility issues", async ({ page }) => {
    await page.goto("/login")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test("features page should not have any automatically detectable accessibility issues", async ({ page }) => {
    await page.goto("/features")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
