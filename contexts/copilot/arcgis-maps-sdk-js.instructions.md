---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK for JavaScript - GitHub Copilot Instructions

## Overview

When working with ArcGIS Maps SDK for JavaScript, follow these guidelines for consistent, high-quality code.

## SDK Version

- Use ArcGIS Maps SDK for JavaScript version 4.x (currently 4.34)
- Import from `@arcgis/core/` for ESM modules

## Import Patterns

### Direct ESM Imports (Recommended)
```javascript
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
```

### Dynamic Imports (CDN/No Build)
```javascript
const Map = await $arcgis.import("@arcgis/core/Map.js");
const MapView = await $arcgis.import("@arcgis/core/views/MapView.js");
```

## Key Patterns

### Creating a 2D Map
```javascript
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";

const map = new Map({ basemap: "topo-vector" });
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05], // [longitude, latitude]
  zoom: 12
});
```

### Creating a 3D Scene
```javascript
import Map from "@arcgis/core/Map.js";
import SceneView from "@arcgis/core/views/SceneView.js";

const map = new Map({
  basemap: "topo-3d",
  ground: "world-elevation"
});

const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: {
    position: { longitude: -118.24, latitude: 34.05, z: 25000 },
    heading: 0,
    tilt: 45
  }
});
```

### Adding Feature Layers
```javascript
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  outFields: ["*"],
  popupTemplate: {
    title: "{NAME}",
    content: "{DESCRIPTION}"
  }
});

map.add(layer);
```

## Best Practices

### Coordinate Order
- ArcGIS uses `[longitude, latitude]`, NOT `[latitude, longitude]`

### Async/Await
- Use `view.when()` to wait for view initialization
- Use `layer.load()` before accessing layer properties
- Use `view.whenLayerView(layer)` for layer view operations

### TypeScript
- Use `as const` for autocast objects with `type` properties
- Import types from `@arcgis/core/interfaces`

### CSS Requirements
- Core API requires: `<link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />`
- Container div must have height: `#viewDiv { height: 100%; }`

## Common Layers

| Layer Type | Use Case |
|------------|----------|
| FeatureLayer | Feature services, editable data |
| GraphicsLayer | Client-side temporary graphics |
| GeoJSONLayer | GeoJSON files/URLs |
| TileLayer | Cached map tiles |
| VectorTileLayer | Vector tiles |
| SceneLayer | 3D buildings (SceneView only) |

## Common Widgets

| Widget | Purpose |
|--------|---------|
| Search | Location search |
| Legend | Map legend |
| LayerList | Layer visibility control |
| BasemapGallery | Basemap selection |
| Sketch | Drawing tools |
| Editor | Feature editing |
| Print | Map printing |

## Error Handling

```javascript
try {
  await view.goTo(target);
} catch (error) {
  if (error.name === "AbortError") {
    // Navigation was interrupted
    return;
  }
  throw error;
}
```

## Resources

- [API Reference](https://developers.arcgis.com/javascript/latest/api-reference/)
- [Sample Code](https://developers.arcgis.com/javascript/latest/sample-code/)
- [Tutorials](https://developers.arcgis.com/javascript/latest/tutorials/)
