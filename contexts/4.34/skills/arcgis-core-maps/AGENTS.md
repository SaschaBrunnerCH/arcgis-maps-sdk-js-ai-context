# Agent Guide: arcgis-core-maps

Quick-reference decisions, checklists, and tables for creating 2D/3D maps.

## Map Components vs Core API Decision Tree

1. **Are you starting a new project?**
   - Yes --> Use Map Components (`<arcgis-map>` / `<arcgis-scene>`)
   - No, maintaining existing Core API code --> Stay with Core API

2. **Do you need programmatic control over view construction timing?**
   - Yes (e.g., dynamic container, conditional rendering) --> Core API (`new MapView()`)
   - No --> Map Components

3. **Are you using a framework?**
   - React 19 / Angular / Vue --> Map Components work as custom elements
   - Older React (<19) --> Core API (custom element event handling is limited)

4. **Do you need to embed the map inside a Calcite shell layout?**
   - Yes --> Map Components with `reference-element` attribute for external widgets
   - No --> Either approach works

**Default:** Map Components unless you have a specific reason for Core API.

## Setup Checklist

### Map Components (npm)
- [ ] `npm install @arcgis/map-components @esri/calcite-components`
- [ ] Import components: `import "@arcgis/map-components/dist/components/arcgis-map"`
- [ ] Set Calcite asset path: `setAssetPath("https://js.arcgis.com/calcite-components/3.3.3/assets")`
- [ ] Set API key: `esriConfig.apiKey = "YOUR_KEY"`
- [ ] Ensure `html, body { height: 100%; margin: 0; }` in CSS
- [ ] Set `"moduleResolution": "bundler"` in tsconfig.json
- [ ] Use `arcgisViewReadyChange` event before accessing `view`

### Core API (npm)
- [ ] `npm install @arcgis/core`
- [ ] Import CSS: `@import "@arcgis/core/assets/esri/themes/light/main.css"`
- [ ] Create container div with full height: `#viewDiv { height: 100%; }`
- [ ] Import classes: `import Map from "@arcgis/core/Map.js"`
- [ ] Set API key: `esriConfig.apiKey = "YOUR_KEY"`
- [ ] Await `view.when()` before accessing view properties

### Map Components (CDN)
- [ ] Add Calcite script: `<script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>`
- [ ] Add SDK script: `<script src="https://js.arcgis.com/4.34/"></script>`
- [ ] Add components script: `<script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>`
- [ ] Use `<arcgis-map>` or `<arcgis-scene>` in HTML
- [ ] Use `$arcgis.import()` for dynamic imports inside `<script type="module">`

### Core API (CDN)
- [ ] Add CSS: `<link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />`
- [ ] Add SDK script: `<script src="https://js.arcgis.com/4.34/"></script>`
- [ ] Create `#viewDiv` with full height
- [ ] Use `<script type="module">` for async/await support

## CDN vs npm Comparison

| Aspect | CDN | npm + Build Tool |
|--------|-----|-----------------|
| Setup speed | Fastest (3 script tags) | Requires project scaffolding |
| Tree-shaking | No (loads full SDK) | Yes (smaller bundles) |
| TypeScript | No type checking | Full type support |
| Offline dev | No | Yes |
| Production use | Prototypes and demos | Recommended |
| Import style | `$arcgis.import()` | `import X from "@arcgis/core/..."` |
| CSS handling | Manual link tag (Core API) | `@import` in CSS (Core API), automatic (Components) |
| Versioning | URL-pinned (`/4.34/`) | `package.json` pinned |

## Quick Reference: Coordinate Order

ArcGIS uses **[longitude, latitude]**, not [latitude, longitude].

```
center: [-118.24, 34.05]  // Los Angeles: longitude first, latitude second
```

## Quick Reference: View Containers

| Container | Dimension | Class |
|-----------|-----------|-------|
| `<arcgis-map>` | 2D | Web component (MapView internally) |
| `<arcgis-scene>` | 3D | Web component (SceneView internally) |
| `<arcgis-video>` | Video | Web component (VideoView internally) |
| `new MapView()` | 2D | Core API |
| `new SceneView()` | 3D | Core API |
