---
name: arcgis-core-maps
description: Create 2D and 3D maps using ArcGIS Maps SDK for JavaScript. Use for initializing maps, scenes, views, and navigation. Supports both Map Components (web components) and Core API approaches.
---

# ArcGIS Core Maps

Use this skill when creating 2D maps (MapView) or 3D scenes (SceneView) with the ArcGIS Maps SDK for JavaScript.

## Import Patterns

### Direct ESM Imports (Recommended for Build Tools)
Use with Vite, webpack, Rollup, or other build tools:
```javascript
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
```
- Tree-shakeable
- Standard JavaScript modules
- Best for production applications

### Dynamic Imports (CDN / No Build Tools)
Use with CDN script tags when no build step is available:
```javascript
const Map = await $arcgis.import("@arcgis/core/Map.js");
const MapView = await $arcgis.import("@arcgis/core/views/MapView.js");

// Multiple imports
const [FeatureLayer, Graphic] = await $arcgis.import([
  "@arcgis/core/layers/FeatureLayer.js",
  "@arcgis/core/Graphic.js"
]);
```
- Works with Map Components (web components)
- No build step required
- Good for quick prototypes and demos
- Requires `<script src="https://js.arcgis.com/4.34/"></script>` in HTML

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Autocasting vs Explicit Classes (TypeScript)

The ArcGIS SDK supports [autocasting](https://developers.arcgis.com/javascript/latest/autocasting/) - passing plain objects instead of class instances. Understanding when to use each approach is important for TypeScript projects.

### When to Use Explicit Classes (Non-Autocast)

Use `new SimpleRenderer()`, `new Point()`, etc. when:

- **You need instance methods or `instanceof` checks**
- **Building shared internal libraries** - constructor APIs surface breaking changes at compile time
- **You want strong editor discoverability** - `new SimpleRenderer({ ... })` exposes properties clearly
- **You mutate objects incrementally** - long-lived instances are clearer as real classes

```typescript
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";

const renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [226, 119, 40],
    size: 8
  })
});
```

### When to Use Autocasting

Use plain objects with `type` property when:

- **Configuration-heavy code** - renderers, symbols, popups are usually data, not behavior
- **UI-driven configuration** - React state → plain objects → SDK properties is simpler
- **Serialization and reuse matter** - configs can be stored, diffed, tested, reused
- **Property updates after creation** - `layer.renderer = { ... }` works cleanly in React `useEffect`

```typescript
// Use 'as const' or 'satisfies' to keep discriminated unions narrow
const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: [226, 119, 40],
    size: 8
  }
} as const;

// Or with satisfies for better type inference
import type { SimpleRenderer } from "@arcgis/core/renderers/SimpleRenderer.js";

const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: [226, 119, 40],
    size: 8
  }
} satisfies __esri.SimpleRendererProperties;
```

### TypeScript Best Practices

The real TypeScript concern is keeping discriminated unions narrow:

```typescript
// ❌ BAD - type widens to string
const symbol = { type: "simple-marker", color: "red" };

// ✅ GOOD - type stays literal
const symbol = { type: "simple-marker", color: "red" } as const;

// ✅ GOOD - explicit type annotation
const symbol: __esri.SimpleMarkerSymbolProperties = {
  type: "simple-marker",
  color: "red"
};
```

### Recommended Default

- **Autocast for configuration** (renderers, symbols, popups, labels)
- **Explicit classes for behavior** (when you need methods or instanceof)
- **Use `as const` or `satisfies`** to maintain type safety with autocasting

## Two Approaches

### 1. Map Components (Modern - Recommended)
Web components approach using `<arcgis-map>` and `<arcgis-scene>`.

### 2. Core API
Traditional JavaScript approach using `Map`, `MapView`, and `SceneView` classes.

## CDN Setup

### Map Components Approach
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ArcGIS Map</title>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
  <!-- Load Calcite components -->
  <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
  <!-- Load ArcGIS Maps SDK -->
  <script src="https://js.arcgis.com/4.34/"></script>
  <!-- Load Map components -->
  <script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
</head>
<body>
  <arcgis-map basemap="topo-vector" center="-118.24,34.05" zoom="12">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
</body>
</html>
```

### Core API Approach
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ArcGIS Map</title>
  <style>
    html, body, #viewDiv { height: 100%; margin: 0; }
  </style>
  <!-- REQUIRED: main.css for Core API -->
  <link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/4.34/"></script>
</head>
<body>
  <div id="viewDiv"></div>
  <script type="module">
    import Map from "@arcgis/core/Map.js";
    import MapView from "@arcgis/core/views/MapView.js";

    const map = new Map({ basemap: "topo-vector" });
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-118.24, 34.05], // [longitude, latitude]
      zoom: 12
    });
  </script>
</body>
</html>
```

## 2D Maps

### Map Components
```html
<arcgis-map basemap="topo-vector" center="-118.24,34.05" zoom="12">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-compass slot="top-left"></arcgis-compass>
  <arcgis-home slot="top-left"></arcgis-home>
  <arcgis-locate slot="top-left"></arcgis-locate>
</arcgis-map>

<script type="module">
  const mapElement = document.querySelector("arcgis-map");
  await mapElement.viewOnReady(); // Wait for view to be ready
  const view = mapElement.view;   // Access the MapView
  const map = mapElement.map;     // Access the Map
</script>
```

### Core API
```javascript
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";

const map = new Map({ basemap: "streets-vector" });

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  zoom: 12,
  // Optional constraints
  constraints: {
    minZoom: 5,
    maxZoom: 18,
    rotationEnabled: false
  }
});
```

## 3D Scenes

### Map Components
```html
<arcgis-scene basemap="topo-3d" ground="world-elevation">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
</arcgis-scene>

<script type="module">
  const sceneElement = document.querySelector("arcgis-scene");
  await sceneElement.viewOnReady();
  const view = sceneElement.view; // SceneView
</script>
```

### Core API
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
    position: {
      longitude: -118.24,
      latitude: 34.05,
      z: 25000 // altitude in meters
    },
    heading: 0,   // compass direction
    tilt: 45      // 0 = straight down, 90 = horizon
  }
});
```

## Loading WebMaps and WebScenes

### WebMap (2D)
```html
<!-- Map Components -->
<arcgis-map item-id="f2e9b762544945f390ca4ac3671cfa72">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>
```

```javascript
// Core API
import MapView from "@arcgis/core/views/MapView.js";
import WebMap from "@arcgis/core/WebMap.js";

const webmap = new WebMap({
  portalItem: { id: "f2e9b762544945f390ca4ac3671cfa72" }
});

const view = new MapView({
  map: webmap,
  container: "viewDiv"
});
```

### WebScene (3D)
```html
<!-- Map Components -->
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>
```

```javascript
// Core API
import SceneView from "@arcgis/core/views/SceneView.js";
import WebScene from "@arcgis/core/WebScene.js";

const webscene = new WebScene({
  portalItem: { id: "YOUR_WEBSCENE_ID" }
});

const view = new SceneView({
  map: webscene,
  container: "viewDiv"
});
```

## Navigation Components

| Component | Purpose |
|-----------|---------|
| `arcgis-zoom` | Zoom in/out buttons |
| `arcgis-compass` | Orientation indicator, click to reset north |
| `arcgis-home` | Return to initial extent |
| `arcgis-locate` | Find user's location |
| `arcgis-navigation-toggle` | Switch between pan/rotate modes (3D) |
| `arcgis-fullscreen` | Toggle fullscreen mode |
| `arcgis-scale-bar` | Display map scale |

### Slot Positions
```html
<arcgis-map basemap="streets-vector">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-home slot="top-left"></arcgis-home>
  <arcgis-search slot="top-right"></arcgis-search>
  <arcgis-legend slot="bottom-left"></arcgis-legend>
  <arcgis-scale-bar slot="bottom-right"></arcgis-scale-bar>
</arcgis-map>
```

Available slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `manual`

## View Configuration

### Setting Initial Extent
```javascript
// By center and zoom
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  zoom: 12
});

// By scale
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  scale: 50000 // 1:50,000
});

// By extent
const view = new MapView({
  container: "viewDiv",
  map: map,
  extent: {
    xmin: -118.5,
    ymin: 33.8,
    xmax: -117.9,
    ymax: 34.3,
    spatialReference: { wkid: 4326 }
  }
});
```

### Programmatic Navigation
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

// Go to extent
await view.goTo(layer.fullExtent);

// Go to features
await view.goTo(featureSet.features);
```

### View Constraints
```javascript
// Constrain zoom levels
view.constraints = {
  minZoom: 5,
  maxZoom: 18
};

// Constrain to area
view.constraints = {
  geometry: layer.fullExtent,
  minScale: 500000
};

// Disable rotation
view.constraints = {
  rotationEnabled: false
};
```

## Event Handling

```javascript
// View ready
view.when(() => {
  console.log("View is ready");
});

// Click event
view.on("click", (event) => {
  console.log("Clicked at:", event.mapPoint);
});

// Pointer move
view.on("pointer-move", (event) => {
  const point = view.toMap(event);
  console.log("Mouse at:", point.longitude, point.latitude);
});

// Extent change
view.watch("extent", (extent) => {
  console.log("Extent changed:", extent);
});

// Stationary (after pan/zoom completes)
view.watch("stationary", (isStationary) => {
  if (isStationary) {
    console.log("Navigation complete");
  }
});
```

## Module Imports

```javascript
// Single import
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

// Multiple imports
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Graphic from "@arcgis/core/Graphic.js";
```

## Common Basemaps

| Basemap ID | Description |
|------------|-------------|
| `streets-vector` | Street map |
| `topo-vector` | Topographic |
| `satellite` | Satellite imagery |
| `hybrid` | Satellite with labels |
| `dark-gray-vector` | Dark gray canvas |
| `gray-vector` | Light gray canvas |
| `osm` | OpenStreetMap |
| `topo-3d` | 3D topographic (SceneView) |

## esriRequest (HTTP Requests)

### Basic Request
```javascript
import esriRequest from "@arcgis/core/request.js";

// GET request with JSON response
const response = await esriRequest(url, {
  query: { f: "json" },
  responseType: "json"
});

console.log("Status:", response.httpStatus);
console.log("Data:", response.data);
```

### Request with Options
```javascript
const response = await esriRequest(url, {
  query: {
    f: "json",
    param1: "value1"
  },
  responseType: "json",  // "json", "text", "array-buffer", "blob", "image"
  method: "post",        // "auto", "get", "post"
  body: formData,        // For POST requests
  timeout: 30000,        // Timeout in ms
  headers: {
    "X-Custom-Header": "value"
  }
});
```

### Download Binary Data
```javascript
// Image response
const imageResponse = await esriRequest(imageUrl, {
  responseType: "image"
});
const imageElement = imageResponse.data;

// Binary data
const binaryResponse = await esriRequest(fileUrl, {
  responseType: "array-buffer"
});
const arrayBuffer = binaryResponse.data;
```

## Planetary Visualization (Mars)

### Mars Scene
```html
<arcgis-scene>
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
</arcgis-scene>

<script type="module">
  import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";
  import TileLayer from "@arcgis/core/layers/TileLayer.js";
  import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

  const viewElement = document.querySelector("arcgis-scene");

  // Set Mars spatial reference
  viewElement.spatialReference = { wkid: 104971 }; // Mars 2000

  // Configure camera for Mars
  viewElement.camera = {
    position: {
      x: 27.63423,
      y: -6.34466,
      z: 1281525,
      spatialReference: { wkid: 104971 }
    },
    heading: 332,
    tilt: 37
  };

  await viewElement.viewOnReady();

  // Mars elevation
  const marsElevation = new ElevationLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer"
  });
  viewElement.ground = { layers: [marsElevation] };

  // Mars imagery
  const marsImagery = new TileLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer",
    title: "Mars Imagery"
  });
  viewElement.map.add(marsImagery);
</script>
```

## Overview Map (Synchronized Views)

### Overview Map with Scene
```html
<arcgis-scene basemap="hybrid" ground="world-elevation">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <!-- Embed overview map inside scene -->
  <arcgis-map basemap="topo-vector" id="overviewDiv" slot="top-right"></arcgis-map>
</arcgis-scene>

<style>
  #overviewDiv { width: 300px; height: 200px; border: 1px solid black; }
</style>

<script type="module">
  import Graphic from "@arcgis/core/Graphic.js";
  import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

  const sceneElement = document.querySelector("arcgis-scene");
  const overviewElement = document.querySelector("arcgis-map");

  await sceneElement.viewOnReady();
  await overviewElement.viewOnReady();

  // Disable rotation on overview
  overviewElement.constraints.rotationEnabled = false;
  overviewElement.view.ui.components = [];

  // Add visible area graphic
  const visibleAreaGraphic = new Graphic({
    symbol: {
      type: "simple-fill",
      color: [0, 0, 0, 0.5],
      outline: null
    }
  });
  overviewElement.graphics.add(visibleAreaGraphic);

  // Sync overview with main scene
  reactiveUtils.watch(
    () => sceneElement.visibleArea,
    async (visibleArea) => {
      visibleAreaGraphic.geometry = visibleArea;
      await overviewElement.goTo(visibleArea);
    },
    { initial: true }
  );
</script>
```

## promiseUtils (Async Utilities)

### Debounce
```javascript
import promiseUtils from "@arcgis/core/core/promiseUtils.js";

// Create debounced function
const debouncedUpdate = promiseUtils.debounce(async () => {
  // This only runs after 300ms of no calls
  await updateFeatures();
});

view.on("pointer-move", () => {
  debouncedUpdate();
});
```

### Abort Error Handling
```javascript
import promiseUtils from "@arcgis/core/core/promiseUtils.js";

const abortController = new AbortController();

try {
  await someAsyncOperation({ signal: abortController.signal });
} catch (error) {
  if (promiseUtils.isAbortError(error)) {
    // Operation was intentionally cancelled
    console.log("Operation cancelled");
  } else {
    // Real error
    throw error;
  }
}

// Cancel the operation
abortController.abort();
```

### Create Resolver
```javascript
import promiseUtils from "@arcgis/core/core/promiseUtils.js";

// Create a promise that can be resolved/rejected externally
const { promise, resolve, reject } = promiseUtils.createResolver();

// Later, resolve or reject
resolve(result);
// or
reject(error);

// Use the promise
const result = await promise;
```

## reactiveUtils (Property Watching)

### Watch Properties
```javascript
import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// Watch single property
reactiveUtils.watch(
  () => view.scale,
  (scale) => console.log("Scale:", scale)
);

// Watch with initial value
reactiveUtils.watch(
  () => view.extent,
  (extent) => console.log("Extent:", extent),
  { initial: true }
);

// Watch once
reactiveUtils.once(
  () => view.stationary === true
).then(() => {
  console.log("View became stationary");
});

// When condition becomes true
reactiveUtils.when(
  () => layer.loaded,
  () => console.log("Layer loaded")
);
```

## Common Pitfalls

1. **Missing CSS for Core API**: The Core API requires `main.css`:
   ```html
   <link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
   ```

2. **Not awaiting viewOnReady()**: Always wait for the view before accessing properties:
   ```javascript
   await mapElement.viewOnReady();
   const view = mapElement.view; // Safe to access now
   ```

3. **Coordinate order**: ArcGIS uses `[longitude, latitude]`, not `[latitude, longitude]`

4. **Missing viewDiv height**: Ensure the container has height:
   ```css
   html, body, #viewDiv { height: 100%; margin: 0; }
   ```

5. **Script type**: Use `type="module"` for async/await support:
   ```html
   <script type="module">
     // async/await works here
   </script>
   ```

