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
  "@arcgis/core/Graphic.js",
]);
```

- Works with Map Components (web components)
- No build step required
- Good for quick prototypes and demos
- Requires `<script src="https://js.arcgis.com/5.0/"></script>` in HTML

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Autocasting vs Explicit Classes (TypeScript)

The ArcGIS SDK supports [autocasting](https://developers.arcgis.com/javascript/latest/autocasting/) - passing plain objects instead of class instances.

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
    size: 8,
  }),
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
    size: 8,
  },
} as const;

// Or with satisfies for better type inference
const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: [226, 119, 40],
    size: 8,
  },
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
  color: "red",
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
      html,
      body {
        height: 100%;
        margin: 0;
      }
    </style>
    <!-- Load Calcite components -->
    <script
      type="module"
      src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"
    ></script>
    <!-- Load ArcGIS Maps SDK -->
    <script src="https://js.arcgis.com/5.0/"></script>
    <!-- Load Map components -->
    <script
      type="module"
      src="https://js.arcgis.com/5.0/map-components/"
    ></script>
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
      html,
      body,
      #viewDiv {
        height: 100%;
        margin: 0;
      }
    </style>
    <!-- REQUIRED: main.css for Core API -->
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/5.0/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/5.0/"></script>
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
        zoom: 12,
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
  const view = mapElement.view; // Access the MapView
  const map = mapElement.map; // Access the Map
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
    rotationEnabled: false,
  },
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
  ground: "world-elevation",
});

const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: {
    position: {
      longitude: -118.24,
      latitude: 34.05,
      z: 25000, // altitude in meters
    },
    heading: 0, // compass direction
    tilt: 45, // 0 = straight down, 90 = horizon
  },
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
  portalItem: { id: "f2e9b762544945f390ca4ac3671cfa72" },
});

const view = new MapView({
  map: webmap,
  container: "viewDiv",
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
  portalItem: { id: "YOUR_WEBSCENE_ID" },
});

const view = new SceneView({
  map: webscene,
  container: "viewDiv",
});
```

## Navigation Components

| Component                  | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `arcgis-zoom`              | Zoom in/out buttons                         |
| `arcgis-compass`           | Orientation indicator, click to reset north |
| `arcgis-home`              | Return to initial extent                    |
| `arcgis-locate`            | Find user's location                        |
| `arcgis-navigation-toggle` | Switch between pan/rotate modes (3D)        |
| `arcgis-fullscreen`        | Toggle fullscreen mode                      |
| `arcgis-scale-bar`         | Display map scale                           |

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

Available slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `top-start`, `top-end`, `bottom-start`, `bottom-end`

## Component Attributes

The `<arcgis-map>` / `<arcgis-scene>` components expose many declarative attributes beyond `basemap`, `center`, `zoom`. High-value ones:

| Attribute                 | Type                  | Purpose                                                                                       |
| ------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `item-id`                 | string                | Load a WebMap/WebScene from ArcGIS Online or Enterprise                                       |
| `rotation`                | number                | Map rotation in degrees                                                                       |
| `scale`                   | number                | Initial scale (e.g. `50000` for 1:50,000)                                                     |
| `extent`                  | Extent (autocast)     | Initial visible extent                                                                        |
| `viewpoint`               | Viewpoint (autocast)  | Combined center + scale + rotation                                                            |
| `spatial-reference`       | SpatialReference      | Coordinate system (WKID)                                                                      |
| `time-extent`             | TimeExtent            | Temporal filter for time-aware layers                                                         |
| `animations-disabled`     | boolean               | Disable all `goTo` animations                                                                 |
| `popup-disabled`          | boolean               | Disable the auto-popup on click                                                               |
| `popup-component-enabled` | boolean               | Use the new Popup component (beta) instead of the widget                                      |
| `auto-destroy-disabled`   | boolean               | Keep the view alive across unmount — **critical for React strict mode and SPA route changes** |
| `attribution-mode`        | `"dark"` \| `"light"` | Attribution text theme                                                                        |
| `hide-attribution`        | boolean               | Hide attribution (check the SDK license terms first)                                          |

Some properties are only settable via JavaScript (not as attributes):

| Property     | Type                 | Purpose                                                           |
| ------------ | -------------------- | ----------------------------------------------------------------- |
| `padding`    | ViewPadding          | Offset the UI logical area when side panels cover part of the map |
| `theme`      | Theme                | Light / dark rendering theme                                      |
| `background` | ColorBackground      | Background color for non-tiled regions                            |
| `graphics`   | Collection<Graphic>  | View-level graphics, independent of any layer                     |
| `highlights` | Collection           | Up to 6 highlight option sets for feature highlighting            |
| `analyses`   | Collection<Analysis> | 3D analyses (line-of-sight, viewshed) — SceneView only            |
| `aria`       | ARIAProperties       | Accessibility labels and descriptions                             |

```html
<!-- React / Vue / SPA pattern: keep view alive across unmount -->
<arcgis-map
  auto-destroy-disabled
  basemap="topo-vector"
  center="-118.24,34.05"
  zoom="12"
></arcgis-map>
```

```javascript
// Layout: offset the UI when a 320px left sidebar covers part of the map
const mapElement = document.querySelector("arcgis-map");
await mapElement.viewOnReady();
mapElement.padding = { left: 320 };
```

## Map Properties

| Property         | Type                  | Description                    |
| ---------------- | --------------------- | ------------------------------ |
| `basemap`        | string or Basemap     | Base layer(s) for the map      |
| `ground`         | string or Ground      | Surface properties (elevation) |
| `layers`         | Collection            | Operational layers             |
| `tables`         | Collection            | Non-spatial tables             |
| `allLayers`      | Collection (readonly) | Flattened layer collection     |
| `allTables`      | Collection (readonly) | Flattened table collection     |
| `editableLayers` | Collection (readonly) | Layers that support editing    |
| `focusAreas`     | Collection (readonly) | Focus areas for the map        |

## Map Methods

| Method                    | Returns | Purpose                                      |
| ------------------------- | ------- | -------------------------------------------- |
| `add(layer, index?)`      | void    | Add a layer, optionally at a specific index  |
| `addMany(layers, index?)` | void    | Add multiple layers in one call              |
| `remove(layer)`           | Layer   | Remove a single layer                        |
| `removeMany(layers)`      | Layer[] | Remove multiple layers                       |
| `removeAll()`             | Layer[] | Remove all operational layers                |
| `reorder(layer, index?)`  | Layer   | Change layer draw order                      |
| `findLayerById(id)`       | Layer   | Find a layer by its `id` property            |
| `findTableById(id)`       | Layer   | Find a table by its `id` property            |
| `destroy()`               | void    | Release the map, its layers, basemap, ground |

```javascript
// Add at a specific index (below existing layers)
map.add(baseLayer, 0);

// Batch add for initial setup
map.addMany([featureLayer, graphicsLayer, imageryLayer]);

// Reorder — move a layer to index 2
map.reorder(roadsLayer, 2);

// Lookup by ID (requires `id` to be set on the layer at creation)
const roads = map.findLayerById("roads");
if (roads) roads.visible = false;
```

> **Pattern:** A single `Map` instance can be shared across both a `MapView` (2D) and a `SceneView` (3D). User interaction happens on the view, not the map, so two views over the same map stay in sync for layers while maintaining independent camera/extent state.

## View Configuration

### Setting Initial Extent

```javascript
// By center and zoom
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  zoom: 12,
});

// By scale
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-118.24, 34.05],
  scale: 50000, // 1:50,000
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
    spatialReference: { wkid: 4326 },
  },
});
```

### Programmatic Navigation

```javascript
// Go to location
await view.goTo({
  center: [-118.24, 34.05],
  zoom: 15,
});

// Animated navigation
await view.goTo(
  { center: [-118.24, 34.05], zoom: 15 },
  { duration: 2000, easing: "ease-in-out" },
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
  maxZoom: 18,
};

// Constrain to area
view.constraints = {
  geometry: layer.fullExtent,
  minScale: 500000,
};

// Disable rotation
view.constraints = {
  rotationEnabled: false,
};
```

## View State Properties

| Property      | Type    | Description                               |
| ------------- | ------- | ----------------------------------------- |
| `ready`       | boolean | Whether the view is fully initialized     |
| `updating`    | boolean | Whether any layer or the view is updating |
| `stationary`  | boolean | True when no navigation is in progress    |
| `interacting` | boolean | True when user is interacting (pan/zoom)  |
| `suspended`   | boolean | True when the view is not visible         |
| `focused`     | boolean | True when the view has keyboard focus     |
| `resolution`  | number  | Map units per pixel                       |

## Event Handling

### Component Events

Map Components fire DOM events on the `<arcgis-map>` / `<arcgis-scene>` element itself, prefixed with `arcgisView`. These mirror the view events but can be handled via `addEventListener` on the element — including _before_ the view is ready.

```javascript
const mapElement = document.querySelector("arcgis-map");

// Alternative to awaiting viewOnReady()
mapElement.addEventListener("arcgisViewReadyChange", () => {
  if (mapElement.ready) {
    const view = mapElement.view;
    const map = mapElement.map;
    // Safe to use view and map here
  }
});
```

**When to use which:**

- **Component events** on the element — declarative, framework-friendly, work before the view is ready. Good for React/Vue patterns that want DOM-style event listeners.
- **View events** via `view.on(...)` — imperative, return a handle for cleanup, work identically to Core API code.

Most view events have a corresponding `arcgisView*` component event. See the [arcgis-map component reference](https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/) for the full list.

### View Events

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

// Hit test (identify features under cursor)
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked feature:", graphic.attributes);
  }
});

// Extent change (using reactiveUtils)
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => view.extent,
  (extent) => console.log("Extent changed:", extent),
);

// Stationary (after pan/zoom completes)
reactiveUtils.watch(
  () => view.stationary,
  (isStationary) => {
    if (isStationary) {
      console.log("Navigation complete");
    }
  },
);
```

### View Events Reference

| Event                             | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `click`                           | User clicks on the view                            |
| `double-click`                    | User double-clicks on the view                     |
| `immediate-click`                 | Fires immediately on click (no double-click delay) |
| `pointer-move`                    | Mouse/touch pointer moves over the view            |
| `pointer-down` / `pointer-up`     | Pointer press/release                              |
| `pointer-enter` / `pointer-leave` | Pointer enters/leaves the view                     |
| `key-down` / `key-up`             | Keyboard events when view is focused               |
| `drag`                            | User drags (pan) on the view                       |
| `hold`                            | User holds pointer on the view                     |
| `mouse-wheel`                     | Mouse wheel scroll                                 |
| `resize`                          | View container resizes                             |
| `focus` / `blur`                  | View gains/loses keyboard focus                    |
| `layerview-create`                | A layer view is created                            |
| `layerview-destroy`               | A layer view is destroyed                          |

## Common Basemaps

| Basemap ID         | Description                |
| ------------------ | -------------------------- |
| `streets-vector`   | Street map                 |
| `topo-vector`      | Topographic                |
| `satellite`        | Satellite imagery          |
| `hybrid`           | Satellite with labels      |
| `dark-gray-vector` | Dark gray canvas           |
| `gray-vector`      | Light gray canvas          |
| `osm`              | OpenStreetMap              |
| `topo-3d`          | 3D topographic (SceneView) |

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

  const viewElement = document.querySelector("arcgis-scene");

  // Set Mars spatial reference
  viewElement.spatialReference = { wkid: 104971 }; // Mars 2000

  // Configure camera for Mars
  viewElement.camera = {
    position: {
      x: 27.63423,
      y: -6.34466,
      z: 1281525,
      spatialReference: { wkid: 104971 },
    },
    heading: 332,
    tilt: 37,
  };

  await viewElement.viewOnReady();

  // Mars elevation
  const marsElevation = new ElevationLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer",
  });
  viewElement.ground = { layers: [marsElevation] };

  // Mars imagery
  const marsImagery = new TileLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer",
    title: "Mars Imagery",
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
  <arcgis-map
    basemap="topo-vector"
    id="overviewDiv"
    slot="top-right"
  ></arcgis-map>
</arcgis-scene>

<style>
  #overviewDiv {
    width: 300px;
    height: 200px;
    border: 1px solid black;
  }
</style>

<script type="module">
  import Graphic from "@arcgis/core/Graphic.js";
  import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

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
      outline: null,
    },
  });
  overviewElement.graphics.add(visibleAreaGraphic);

  // Sync overview with main scene
  reactiveUtils.watch(
    () => sceneElement.visibleArea,
    async (visibleArea) => {
      visibleAreaGraphic.geometry = visibleArea;
      await overviewElement.goTo(visibleArea);
    },
    { initial: true },
  );
</script>
```

## Reference Samples

- `intro-mapview` - Basic MapView setup and configuration
- `intro-sceneview` - Basic SceneView setup for 3D
- `webmap-basic` - Loading a WebMap from portal
- `watch-for-changes-reactiveutils` - Reactive property watching with reactiveUtils
- `overview-map` - Creating an overview/inset map

## Related Skills

- See `arcgis-layers` for adding data layers to maps.
- See `arcgis-starter-app` for project setup and scaffolding.
- See `arcgis-core-utilities` for reactiveUtils and promiseUtils details.
- See `arcgis-interaction` for hit testing, popups, and user interaction.

## Common Pitfalls

1. **Missing CSS for Core API**: The Core API requires `main.css` for widgets and popups to render correctly.

   ```html
   <!-- Anti-pattern: no CSS import -->
   <script type="module">
     import MapView from "@arcgis/core/views/MapView.js";
     import Map from "@arcgis/core/Map.js";
     const view = new MapView({
       container: "viewDiv",
       map: new Map({ basemap: "topo-vector" }),
     });
   </script>
   ```

   ```html
   <!-- Correct: include the CSS -->
   <link
     rel="stylesheet"
     href="https://js.arcgis.com/5.0/esri/themes/light/main.css"
   />
   <script type="module">
     import MapView from "@arcgis/core/views/MapView.js";
     import Map from "@arcgis/core/Map.js";
     const view = new MapView({
       container: "viewDiv",
       map: new Map({ basemap: "topo-vector" }),
     });
   </script>
   ```

   **Impact:** The map itself renders, but widgets (Zoom, Legend, Search) and popups appear unstyled or completely broken. Layouts collapse and controls become unusable.

2. **Not awaiting viewOnReady()**: View properties are not available until the view is ready.

   ```javascript
   // Anti-pattern: accessing view before it is ready
   const mapElement = document.querySelector("arcgis-map");
   const view = mapElement.view; // undefined - view is not ready yet
   view.goTo({ center: [-118, 34] }); // TypeError: Cannot read properties of undefined
   ```

   ```javascript
   // Correct: wait for the view to be ready
   const mapElement = document.querySelector("arcgis-map");
   await mapElement.viewOnReady();
   const view = mapElement.view; // MapView instance, safe to use
   view.goTo({ center: [-118, 34] });
   ```

   **Impact:** `view` is `null` or `undefined` before the component initializes, causing runtime errors on any property access or method call.

3. **Coordinate order**: ArcGIS uses `[longitude, latitude]`, not `[latitude, longitude]`.

   ```javascript
   // Anti-pattern: lat/lng order (Google Maps convention)
   const view = new MapView({
     center: [34.05, -118.24], // lat first, lng second - WRONG
     zoom: 12,
   });
   ```

   ```javascript
   // Correct: lng/lat order (ArcGIS convention)
   const view = new MapView({
     center: [-118.24, 34.05], // lng first, lat second
     zoom: 12,
   });
   ```

   **Impact:** The map centers on the wrong location, often in the middle of the ocean or on a different continent, with no error message to indicate the mistake.

4. **Missing viewDiv height**: Ensure the container has height:

   ```css
   html,
   body,
   #viewDiv {
     height: 100%;
     margin: 0;
   }
   ```

5. **Script type**: Use `type="module"` for async/await support:

   ```html
   <script type="module">
     // async/await works here
   </script>
   ```

6. **Layers belong to exactly one Map**: Adding a layer to a second `Map` silently removes it from the first.

   ```javascript
   // Anti-pattern: sharing a layer between two maps expecting both to display it
   const layer = new FeatureLayer({ url: "..." });
   const map1 = new Map({ layers: [layer] });
   const map2 = new Map({ layers: [layer] }); // silently removes layer from map1
   ```

   ```javascript
   // Correct: create two instances against the same data source
   const layer1 = new FeatureLayer({ url: "..." });
   const layer2 = new FeatureLayer({ url: "..." });
   const map1 = new Map({ layers: [layer1] });
   const map2 = new Map({ layers: [layer2] });
   ```

   **Impact:** The layer appears only in the most recently created map, with no error or warning. Common when toggling between 2D and 3D with separate map instances rather than sharing one map across two views.
