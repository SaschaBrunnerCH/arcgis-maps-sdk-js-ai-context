---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Core Maps & Views

## SDK Version
Use ArcGIS Maps SDK for JavaScript version 4.x (currently 4.34).

## Import Patterns

### Direct ESM Imports (Recommended for Build Tools)
```javascript
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import WebMap from "@arcgis/core/WebMap.js";
import WebScene from "@arcgis/core/WebScene.js";
```

### Dynamic Imports (CDN / No Build Tools)
```javascript
const Map = await $arcgis.import("@arcgis/core/Map.js");
const MapView = await $arcgis.import("@arcgis/core/views/MapView.js");
```

## Two Approaches: Map Components vs Core API

### Map Components (Modern - Recommended)
```html
<arcgis-map basemap="topo-vector" center="-118.24,34.05" zoom="12">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-compass slot="top-left"></arcgis-compass>
</arcgis-map>

<script type="module">
  const mapElement = document.querySelector("arcgis-map");
  await mapElement.viewOnReady();
  const view = mapElement.view;
  const map = mapElement.map;
</script>
```

### Core API
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

## CDN Setup

### Map Components
```html
<script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
<script src="https://js.arcgis.com/4.34/"></script>
<script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
```

### Core API (requires CSS)
```html
<link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
<script src="https://js.arcgis.com/4.34/"></script>
```

## 2D Maps

```javascript
const map = new Map({ basemap: "streets-vector" });

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  zoom: 12,
  constraints: {
    minZoom: 5,
    maxZoom: 18,
    rotationEnabled: false
  }
});
```

## 3D Scenes

```javascript
import SceneView from "@arcgis/core/views/SceneView.js";

const map = new Map({
  basemap: "topo-3d",
  ground: "world-elevation"
});

const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: {
    position: {
      longitude: -118.24,
      latitude: 34.05,
      z: 25000
    },
    heading: 0,
    tilt: 45
  }
});
```

## Loading WebMaps and WebScenes

```javascript
import WebMap from "@arcgis/core/WebMap.js";
import WebScene from "@arcgis/core/WebScene.js";

// WebMap
const webmap = new WebMap({
  portalItem: { id: "f2e9b762544945f390ca4ac3671cfa72" }
});

// WebScene
const webscene = new WebScene({
  portalItem: { id: "YOUR_WEBSCENE_ID" }
});
```

## Navigation

```javascript
// Go to location
await view.goTo({
  center: [-118.24, 34.05],
  zoom: 15
});

// Animated navigation
await view.goTo(
  { center: [-118.24, 34.05], zoom: 15 },
  { duration: 2000, easing: "ease-in-out" }
);

// Go to extent or features
await view.goTo(layer.fullExtent);
await view.goTo(featureSet.features);
```

## View Constraints

```javascript
view.constraints = {
  minZoom: 5,
  maxZoom: 18,
  geometry: layer.fullExtent,
  rotationEnabled: false
};
```

## Event Handling

```javascript
// View ready
view.when(() => console.log("View is ready"));

// Click event
view.on("click", (event) => {
  console.log("Clicked at:", event.mapPoint);
});

// Pointer move
view.on("pointer-move", (event) => {
  const point = view.toMap(event);
});

// Watch properties
view.watch("extent", (extent) => console.log("Extent changed"));
view.watch("stationary", (isStationary) => {
  if (isStationary) console.log("Navigation complete");
});
```

## Common Basemaps

| ID | Description |
|----|-------------|
| `streets-vector` | Street map |
| `topo-vector` | Topographic |
| `satellite` | Satellite imagery |
| `hybrid` | Satellite with labels |
| `dark-gray-vector` | Dark gray canvas |
| `gray-vector` | Light gray canvas |
| `topo-3d` | 3D topographic |

## reactiveUtils (Property Watching)

```javascript
import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => view.scale,
  (scale) => console.log("Scale:", scale)
);

reactiveUtils.when(
  () => layer.loaded,
  () => console.log("Layer loaded")
);
```

## Autocasting vs Explicit Classes

### Use Autocasting for Configuration
```javascript
layer.renderer = {
  type: "simple",
  symbol: { type: "simple-marker", color: "red" }
};
```

### Use Explicit Classes for Instance Methods
```javascript
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
const renderer = new SimpleRenderer({ ... });
```

### TypeScript: Use `as const`
```typescript
layer.renderer = {
  type: "simple",
  symbol: { type: "simple-marker", color: "red" }
} as const;
```

## Common Pitfalls

1. **Missing CSS for Core API** - Always include main.css
2. **Not awaiting viewOnReady()** - Wait before accessing view properties
3. **Coordinate order** - ArcGIS uses [longitude, latitude], not [lat, lon]
4. **Missing container height** - Ensure `#viewDiv { height: 100%; }`
5. **Script type** - Use `type="module"` for async/await
