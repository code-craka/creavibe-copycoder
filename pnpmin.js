/**
 * PNPMin configuration file
 * This file helps minimize dependencies and ensure consistent versioning
 */

module.exports = {
  hooks: {
    readPackage(pkg) {
      // Enforce specific versions for Supabase packages
      if (pkg.dependencies) {
        if (pkg.dependencies['@supabase/supabase-js']) {
          pkg.dependencies['@supabase/supabase-js'] = '^2.39.3';
        }
        if (pkg.dependencies['@supabase/ssr']) {
          pkg.dependencies['@supabase/ssr'] = '^0.1.0';
        }
        if (pkg.dependencies['@supabase/auth-helpers-nextjs']) {
          pkg.dependencies['@supabase/auth-helpers-nextjs'] = '^0.8.7';
        }
      }

      // Ensure consistent React versions
      if (pkg.dependencies) {
        if (pkg.dependencies.react) {
          pkg.dependencies.react = '^19.0.0';
        }
        if (pkg.dependencies['react-dom']) {
          pkg.dependencies['react-dom'] = '^19.0.0';
        }
      }

      // Ensure consistent TypeScript version
      if (pkg.devDependencies && pkg.devDependencies.typescript) {
        pkg.devDependencies.typescript = '^5.3.3';
      }

      // Ensure consistent Next.js version
      if (pkg.dependencies && pkg.dependencies.next) {
        pkg.dependencies.next = '15.2.4';
      }

      return pkg;
    },
  },
};
