import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // eslint-plugin-react's auto-detection calls `context.getFilename()`, which
    // ESLint 10 removed — declaring the version explicitly skips that path.
    // Keep in step with the `react` version in package.json.
    settings: { react: { version: '19.3.0' } },
  },
  {
    // lib/drupal is the boundary with Drupal's JSON:API, whose attribute and
    // relationship payloads are untyped by definition. `any` is deliberate
    // here; the mappers are what turn it into the typed domain model.
    files: ['lib/drupal/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
];

export default config;
