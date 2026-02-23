# Agent Guide: arcgis-starter-app

Quick-reference decisions, checklists, and tables for scaffolding ArcGIS applications.

## Minimal vs Production Setup Decision

1. **Is this a prototype, demo, or learning exercise?**
   - Yes --> Minimal setup (Vite + TypeScript, no linting)
   - No --> Production setup

2. **Will this be maintained by a team or deployed publicly?**
   - Yes --> Production setup (ESLint, Prettier, git hooks, CI/CD)
   - No, personal project --> Minimal is fine

3. **Do you need CI/CD pipelines?**
   - Yes --> Production setup includes GitHub Actions workflows
   - No --> Minimal setup

| Feature | Minimal | Production |
|---------|---------|------------|
| Vite + TypeScript | Yes | Yes |
| Map Components + Calcite | Yes | Yes |
| ESLint | No | Yes |
| Prettier | No | Yes |
| Git hooks (lint-staged) | No | Yes |
| GitHub Actions CI/CD | No | Yes |
| `.env` for API key | No | Yes (`VITE_ARCGIS_API_KEY`) |
| EditorConfig | No | Yes |

## New Project Checklist

### Quick start (minimal)
- [ ] `npm create vite@latest my-app -- --template vanilla-ts`
- [ ] `cd my-app`
- [ ] `npm install @arcgis/map-components @esri/calcite-components`
- [ ] Set `"moduleResolution": "bundler"` in `tsconfig.json`
- [ ] Set `build.target: "esnext"` in `vite.config.ts`
- [ ] Replace `index.html` body with `<arcgis-map>` or `<arcgis-scene>`
- [ ] Replace `src/main.ts` with component imports and `esriConfig.apiKey`
- [ ] Set `html, body { height: 100%; margin: 0; }` in CSS
- [ ] `npm run dev`

### Production additions
- [ ] `npm install -D eslint @eslint/js typescript-eslint eslint-config-prettier prettier simple-git-hooks lint-staged`
- [ ] Create `eslint.config.js` (flat config)
- [ ] Create `.prettierrc` and `.prettierignore`
- [ ] Add `simple-git-hooks` and `lint-staged` config to `package.json`
- [ ] Run `npx simple-git-hooks` to install hooks
- [ ] Create `.env.example` with `VITE_ARCGIS_API_KEY=`
- [ ] Add `.env` to `.gitignore`
- [ ] Use `import.meta.env.VITE_ARCGIS_API_KEY` in `main.ts`
- [ ] Create `.github/workflows/test.yml` and `deploy.yml`

## Framework Selection Table

| Framework | Web Component Support | Setup Notes |
|-----------|----------------------|-------------|
| Vanilla TS | Native | Simplest setup. Use Vite `vanilla-ts` template. |
| React 19 | Native (`onarcgis*` events) | Events use `on` prefix: `onarcgisViewReadyChange`. |
| React <19 | Requires `ref` workaround | Use `useEffect` + `addEventListener` on refs. Consider Core API instead. |
| Angular | Via `CUSTOM_ELEMENTS_SCHEMA` | Add schema to component/module. Import CSS explicitly. |
| Vue 3 | Native (`@arcgis*` events) | Configure `compilerOptions.isCustomElement` in `vite.config.ts`. |

## Key Configuration Files

| File | Purpose | Required? |
|------|---------|-----------|
| `tsconfig.json` | TypeScript config; must set `moduleResolution: "bundler"` | Yes |
| `vite.config.ts` | Build config; must set `build.target: "esnext"` | Yes |
| `package.json` | Dependencies and scripts | Yes |
| `.env` | API key (`VITE_ARCGIS_API_KEY`) | Production |
| `eslint.config.js` | Linting rules (flat config format) | Production |
| `.prettierrc` | Code formatting rules | Production |

## Package Dependencies

### Required
```
@arcgis/map-components  -- Map Components (web components)
@esri/calcite-components -- Calcite Design System
```

### Required (Core API only, without Map Components)
```
@arcgis/core -- Core API classes
@esri/calcite-components -- Calcite Design System
```

### Dev (minimal)
```
typescript
vite
```

### Dev (production, additional)
```
eslint, @eslint/js, typescript-eslint, eslint-config-prettier
prettier, simple-git-hooks, lint-staged
```
