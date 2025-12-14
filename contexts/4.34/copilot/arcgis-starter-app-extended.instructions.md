---
applyTo: "**/*.{js,ts,jsx,tsx,html,json,yml,yaml}"
---

# ArcGIS Extended Starter App with TypeScript, Vite & CI/CD

Scaffold a production-ready ArcGIS Maps SDK for JavaScript application with comprehensive tooling.

## Project Structure

```
my-arcgis-app/
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
├── src/
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .env.example
└── README.md
```

## package.json

```json
{
  "name": "my-arcgis-app",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "prepare": "simple-git-hooks"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-unicorn": "^55.0.0",
    "globals": "^16.5.0",
    "prettier": "^3.7.4",
    "lint-staged": "^16.2.7",
    "simple-git-hooks": "^2.13.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.49.0",
    "vite": "^7.2.7"
  },
  "dependencies": {
    "@arcgis/core": "4.34.8",
    "@arcgis/map-components": "^4.34.9",
    "@esri/calcite-components": "^3.3.3"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm exec lint-staged",
    "pre-push": "pnpm exec tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,json,css,md,yml,yaml}": ["prettier --write"]
  }
}
```

## eslint.config.js

```javascript
import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Enable type-aware linting for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        allowDefaultProject: ["vite.config.ts"],
      },
    },
  },
  // Scope type-checked recommendations strictly to TS files
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  })),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    ignores: ["vite.config.ts"],
  },
  {
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      // import hygiene
      "import/no-duplicates": "error",
      "import/no-useless-path-segments": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/eslint.config.*",
            "**/vite.config.*",
            "**/*.config.*",
            "**/scripts/**",
            "**/*.test.*",
            "**/*.spec.*",
            ".github/**",
          ],
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
      // import ordering
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // unused vars/imports
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // code quality
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "warn",

      // unicorn essentials
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/throw-new-error": "error",

      // typescript consistency
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-require-imports": "error",
    },
  },
  // Node environment for config and build scripts
  {
    files: ["eslint.config.js", "vite.config.*", "*.config.*", "scripts/**"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // Declarations: relax strictness for ambient types
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  // TS-only: enable balanced type-aware rules
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/await-thenable": "warn",

      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",

      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    },
  },
  // Disable ESLint rules that would conflict with Prettier formatting
  configPrettier
);
```

## .prettierrc

```json
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "printWidth": 120,
  "quoteProps": "consistent",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css"
}
```

## .prettierignore

```
dist/
node_modules/
*.min.js
package-lock.json
pnpm-lock.yaml
```

## .editorconfig

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## .gitattributes

```
* text=auto eol=lf
```

## .gitignore

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
*.tsbuildinfo
```

## .env.example

```
# ArcGIS API Key
# Get your API key from https://developers.arcgis.com/
VITE_ARCGIS_API_KEY=your_arcgis_api_key_here
```

## .github/workflows/test.yml

```yaml
name: Test

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  issues: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Security audit
        run: pnpm audit --audit-level=high

      - name: ESLint
        run: pnpm run lint

      - name: Prettier check
        run: pnpm run format:check

      - name: Annotate formatting issues
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
            const body = [
              'Prettier check failed. Please run `pnpm run format` locally to fix formatting.',
              '',
              `Workflow run: ${runUrl}`,
            ].join('\n');
            if (context.payload.pull_request) {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body,
              });
            } else {
              core.summary.addHeading('Prettier check failed');
              core.summary.addRaw(body);
              await core.summary.write();
            }

      - name: Type check
        run: pnpm exec tsc --noEmit

      - name: Build
        run: pnpm run build
        env:
          NODE_OPTIONS: "--max-old-space-size=4096"
          VITE_ARCGIS_API_KEY: ${{ secrets.VITE_ARCGIS_API_KEY }}
```

## .github/workflows/deploy.yml

```yaml
name: Build & Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build
        env:
          NODE_OPTIONS: "--max-old-space-size=4096"
          VITE_ARCGIS_API_KEY: ${{ secrets.VITE_ARCGIS_API_KEY }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <title>ArcGIS Map App</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <arcgis-scene item-id="YOUR_WEBSCENE_ID">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
      <arcgis-compass slot="top-left"></arcgis-compass>
    </arcgis-scene>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## src/main.ts

```typescript
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import "@arcgis/map-components/dist/components/arcgis-navigation-toggle";
import "@arcgis/map-components/dist/components/arcgis-compass";

import { setAssetPath as setCalciteAssetPath } from "@esri/calcite-components/dist/components";

import esriConfig from "@arcgis/core/config";

// Set Calcite assets path
setCalciteAssetPath("https://js.arcgis.com/calcite-components/3.3.3/assets");

// Configure ArcGIS API key from environment variable
esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY as string;

// Wait for map to be ready
const arcgisScene = document.querySelector("arcgis-scene");
arcgisScene?.addEventListener("arcgisViewReadyChange", (event) => {
  const { view } = (event as CustomEvent).detail;
  console.warn("Scene view ready:", view);
});
```

## src/style.css

```css
@import "@arcgis/core/assets/esri/themes/light/main.css";

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

arcgis-scene,
#viewDiv {
  width: 100%;
  height: 100%;
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

## vite.config.ts

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "esnext" },
});
```

## README.md

```markdown
# My ArcGIS App

A web mapping application built with ArcGIS Maps SDK for JavaScript.

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

## Setup

1. Install dependencies:
   pnpm install

2. Copy environment file and add your API key:
   cp .env.example .env

3. Start development server:
   pnpm dev

4. Build for production:
   pnpm build

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Git Hooks

This project uses simple-git-hooks for automated checks:

- **pre-commit**: Runs lint-staged (ESLint + Prettier)
- **pre-push**: Runs TypeScript type checking

## CI/CD

GitHub Actions workflows:

- **test.yml**: Runs on PRs - security audit, lint, format, type check, build
- **deploy.yml**: Deploys to GitHub Pages on push to main

## Configuration

- **API Key**: Set `VITE_ARCGIS_API_KEY` in `.env`
- **Web Scene ID**: Update `YOUR_WEBSCENE_ID` in `index.html`

## Technologies

- ArcGIS Maps SDK for JavaScript
- Calcite Design System
- TypeScript
- Vite
- ESLint + Prettier
- GitHub Actions
```

## Quick Start

```bash
pnpm create vite my-arcgis-app --template vanilla-ts
cd my-arcgis-app
pnpm add @arcgis/map-components @arcgis/core @esri/calcite-components
pnpm add -D eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-import eslint-plugin-unicorn globals prettier simple-git-hooks lint-staged
pnpm run prepare
pnpm dev
```
