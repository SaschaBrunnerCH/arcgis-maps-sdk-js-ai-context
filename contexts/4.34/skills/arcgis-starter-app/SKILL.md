---
name: arcgis-starter-app
description: Scaffold a minimal ArcGIS Maps SDK application with TypeScript, Vite, and Calcite Design System. Use when creating new projects from scratch.
---

# ArcGIS Starter App with TypeScript & Vite

Use this skill to create a minimal ArcGIS Maps SDK for JavaScript application with TypeScript and Vite.

## Project Structure

```
my-arcgis-app/
├── src/
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## package.json

```json
{
  "name": "my-arcgis-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "vite": "^7.2.7"
  },
  "dependencies": {
    "@arcgis/map-components": "^4.34.9",
    "@esri/calcite-components": "^3.3.3"
  }
}
```

## index.html (2D Map)

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
    <calcite-shell content-behind>
      <arcgis-map item-id="YOUR_WEBMAP_ID">
        <arcgis-zoom position="top-left"></arcgis-zoom>
        <arcgis-legend position="bottom-left"></arcgis-legend>
      </arcgis-map>
    </calcite-shell>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## index.html (3D Scene)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <title>ArcGIS Scene App</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <calcite-shell content-behind>
      <arcgis-scene item-id="YOUR_WEBSCENE_ID">
        <arcgis-zoom position="top-left"></arcgis-zoom>
        <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
        <arcgis-compass position="top-left"></arcgis-compass>
      </arcgis-scene>
    </calcite-shell>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## src/main.ts (Map Components)

```typescript
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import "@arcgis/map-components/dist/components/arcgis-legend";
// For 3D scenes, also import:
// import "@arcgis/map-components/dist/components/arcgis-scene";
// import "@arcgis/map-components/dist/components/arcgis-navigation-toggle";
// import "@arcgis/map-components/dist/components/arcgis-compass";

import "@esri/calcite-components/dist/components/calcite-shell";

import { setAssetPath as setCalciteAssetPath } from "@esri/calcite-components/dist/components";

// Set Calcite assets path
setCalciteAssetPath("https://js.arcgis.com/calcite-components/3.3.3/assets");

// Configure ArcGIS API key
import esriConfig from "@arcgis/core/config";
esriConfig.apiKey = "YOUR_API_KEY";

// Wait for map to be ready
const arcgisMap = document.querySelector("arcgis-map");
arcgisMap?.addEventListener("arcgisViewReadyChange", (event) => {
  const { view } = (event as CustomEvent).detail;
  console.log("Map view ready:", view);
});
```

## src/main.ts (Core API - Programmatic)

```typescript
import "@esri/calcite-components/dist/components/calcite-shell";
import { setAssetPath as setCalciteAssetPath } from "@esri/calcite-components/dist/components";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

// Set Calcite assets path
setCalciteAssetPath("https://js.arcgis.com/calcite-components/3.3.3/assets");

const map = new Map({ basemap: "topo-vector" });

// Create view
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.805, 34.027],
  zoom: 13,
});


```

## src/style.css

```css
@import "@arcgis/core/assets/esri/themes/light/main.css";

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

calcite-shell { width: 100%; height: 100%; }
arcgis-map, arcgis-scene, #viewDiv { width: 100%; height: 100%; }
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
  build: { target: "esnext" }
});
```

## .gitignore

```
node_modules/
dist/
.env
.env.local
```

## README.md

```markdown
# My ArcGIS App

A web mapping application built with ArcGIS Maps SDK for JavaScript.

## Prerequisites

- Node.js 18+
- npm or pnpm

## Setup

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

3. Build for production:
   npm run build

## Configuration

- API Key: Set your ArcGIS API key in src/main.ts
- Web Map/Scene ID: Update the item-id in index.html

## Technologies

- ArcGIS Maps SDK for JavaScript
- Calcite Design System
- TypeScript
- Vite
```

## Quick Start

```bash
npm install @arcgis/map-components @esri/calcite-components
npm install -D typescript vite
npm run dev
```

## Common Widgets

```typescript
// Import additional components as needed
import "@arcgis/map-components/dist/components/arcgis-search";
import "@arcgis/map-components/dist/components/arcgis-basemap-gallery";
import "@arcgis/map-components/dist/components/arcgis-layer-list";
```

```html
<arcgis-map item-id="YOUR_MAP_ID">
  <arcgis-search position="top-right"></arcgis-search>
  <arcgis-basemap-gallery position="top-right"></arcgis-basemap-gallery>
</arcgis-map>
```

