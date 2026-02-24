---
name: arcgis-performance
description: Optimize ArcGIS Maps SDK for JavaScript applications for speed, memory, and bundle size. Use for improving map initialization, data loading, query efficiency, large dataset handling, and view rendering performance.
---

# ArcGIS Performance

Use this skill when optimizing ArcGIS Maps SDK for JavaScript applications for faster load times, reduced memory usage, efficient data handling, and smooth rendering in both 2D MapView and 3D SceneView.

## Critical Priority (P0)

### Map Initialization

Using incorrect readiness patterns causes race conditions, missed events, or wasted CPU cycles.

#### Map Components

```javascript
// Anti-pattern: polling or setTimeout to check view readiness
const mapElement = document.querySelector("arcgis-map");
const checkReady = setInterval(() => {
  if (mapElement.view && mapElement.view.ready) {
    clearInterval(checkReady);
    initializeApp(mapElement.view);
  }
}, 100);
```

```javascript
// Correct: use viewOnReady() which returns a promise
const mapElement = document.querySelector("arcgis-map");
await mapElement.viewOnReady();
initializeApp(mapElement.view);
```

**Impact:** Polling wastes CPU cycles and introduces unpredictable delays. `viewOnReady()` resolves at the earliest possible moment the view is usable, with zero overhead.

#### Core API

```javascript
// Anti-pattern: setTimeout to "wait" for the view
const view = new MapView({ container: "viewDiv", map });
setTimeout(() => {
  console.log("Extent:", view.extent); // May still be undefined
}, 3000);
```

```javascript
// Correct: use view.when() which resolves when the view is ready
const view = new MapView({ container: "viewDiv", map });
await view.when();
console.log("Extent:", view.extent);
```

**Impact:** `setTimeout` either fires too early (view not ready) or too late (wasted idle time). `view.when()` resolves at exactly the right moment.

#### Layer Readiness

```javascript
// Anti-pattern: accessing layer properties before it has loaded
const layer = new FeatureLayer({ url: serviceUrl });
map.add(layer);
console.log(layer.fields); // undefined
```

```javascript
// Correct: wait for the layer to load
const layer = new FeatureLayer({ url: serviceUrl });
map.add(layer);
await layer.when();
console.log(layer.fields); // Now available
```

**Impact:** Accessing properties on an unloaded layer returns `undefined` or stale data.

### Data Loading Waterfalls

```javascript
// Anti-pattern: sequential layer loading creates a waterfall
for (const url of urls) {
  const layer = new FeatureLayer({ url });
  map.add(layer);
  await layer.when(); // Blocks until this layer loads before starting the next
}
```

```javascript
// Correct: parallel layer loading with Promise.all
const layers = urls.map((url) => new FeatureLayer({ url }));
map.addMany(layers);
await Promise.all(layers.map((layer) => layer.when()));
```

**Impact:** With 4 layers each taking 500ms, sequential loading takes ~2000ms. Parallel loading takes ~500ms.

#### Parallel Loading with Error Handling

```javascript
// Correct: parallel loading with individual error handling
const layers = urls.map((url) => new FeatureLayer({ url }));
map.addMany(layers);

const results = await Promise.allSettled(layers.map((layer) => layer.when()));
results.forEach((result, index) => {
  if (result.status === "rejected") {
    console.warn(`Layer ${index} failed to load:`, result.reason);
    map.remove(layers[index]);
  }
});
```

**Impact:** `Promise.allSettled` prevents one failed layer from blocking all others.

### Bundle Size

#### Core API Imports

```javascript
// Anti-pattern: barrel imports pull in the entire module tree
import { Map, MapView } from "@arcgis/core";
import { FeatureLayer, GraphicsLayer } from "@arcgis/core/layers";
```

```javascript
// Correct: deep imports enable tree-shaking
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
```

**Impact:** Barrel imports bypass tree-shaking and can add hundreds of kilobytes of unused code to the bundle.

#### Map Components Imports

```javascript
// Anti-pattern: importing the entire map-components package
import "@arcgis/map-components";
```

```javascript
// Correct: import only the components you use
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import "@arcgis/map-components/dist/components/arcgis-legend";
```

**Impact:** Importing the entire package registers every component even if only a few are used.

#### Bundle Size Comparison

| Import Pattern | Approximate Bundle Impact |
|---|---|
| `import "@arcgis/map-components"` | Entire component library loaded |
| `import "@arcgis/map-components/dist/components/arcgis-map"` | Only map component + dependencies |
| `import { Map } from "@arcgis/core"` | Barrel import, entire core pulled in |
| `import Map from "@arcgis/core/Map.js"` | Only Map class + direct dependencies |

#### Dynamic Imports for Code Splitting

```javascript
// Anti-pattern: importing heavy modules at startup
import Print from "@arcgis/core/widgets/Print.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";
import Editor from "@arcgis/core/widgets/Editor.js";
```

```javascript
// Correct: dynamic import loads modules only when needed
async function addPrintWidget(view) {
  const { default: Print } = await import("@arcgis/core/widgets/Print.js");
  const print = new Print({ view });
  view.ui.add(print, "top-right");
}
```

**Impact:** Widgets like Print, Sketch, and Editor are large. Dynamic imports keep them out of the initial bundle, reducing time-to-interactive.

## High Impact (P1)

### FeatureLayer Query Optimization

#### Specify outFields

```javascript
// Anti-pattern: requesting all fields
const results = await layer.queryFeatures({
  where: "status = 'active'",
  outFields: ["*"],
  returnGeometry: true
});
```

```javascript
// Correct: request only the fields you need
const results = await layer.queryFeatures({
  where: "status = 'active'",
  outFields: ["OBJECTID", "name", "status", "category"],
  returnGeometry: true
});
```

**Impact:** For a layer with 50 fields, requesting only 4 reduces payload size by ~90%.

#### Skip Geometry When Not Needed

```javascript
// Anti-pattern: fetching geometry for a list view
const results = await layer.queryFeatures({
  where: "population > 100000",
  outFields: ["name", "population"],
  returnGeometry: true // Default is true
});
// Only using attributes
results.features.forEach((f) => addToList(f.attributes.name));
```

```javascript
// Correct: disable geometry when only attributes are needed
const results = await layer.queryFeatures({
  where: "population > 100000",
  outFields: ["name", "population"],
  returnGeometry: false
});
```

**Impact:** Geometry data (especially polygons) can be orders of magnitude larger than attribute data.

#### Server-Side Filtering with definitionExpression

```javascript
// Anti-pattern: loading all features then filtering on the client
const allResults = await layer.queryFeatures({ where: "1=1", outFields: ["*"] });
const filtered = allResults.features.filter(
  (f) => f.attributes.region === "West" && f.attributes.revenue > 50000
);
```

```javascript
// Correct: use definitionExpression for server-side filtering
const layer = new FeatureLayer({
  url: serviceUrl,
  definitionExpression: "region = 'West' AND revenue > 50000",
  outFields: ["OBJECTID", "name", "region", "revenue"]
});
```

**Impact:** Loading 100,000 features to filter down to 500 wastes bandwidth, memory, and CPU.

#### Use Lightweight Query Methods

```javascript
// Anti-pattern: querying full features just to get a count
const results = await layer.queryFeatures({ where: "status = 'active'" });
const count = results.features.length;
```

```javascript
// Correct: use queryFeatureCount for count-only operations
const count = await layer.queryFeatureCount({ where: "status = 'active'" });

// Correct: use queryExtent when you only need the bounding box
const { extent } = await layer.queryExtent({ where: "status = 'active'" });
await view.goTo(extent);
```

**Impact:** `queryFeatureCount` and `queryExtent` are lightweight server operations.

### Large Dataset Handling

#### Strategy Thresholds

| Feature Count | Strategy | Implementation |
|---|---|---|
| < 2,000 | Render as-is | Default rendering |
| 2,000 - 50,000 | Clustering | featureReduction type `"cluster"` |
| 50,000 - 500,000 | Binning | featureReduction type `"binning"` |
| 500,000+ | Server-side tiling | VectorTileLayer or server-side filtering |

#### Clustering (2,000 - 50,000 features)

```javascript
// Anti-pattern: rendering thousands of individual point features
const layer = new FeatureLayer({ url: serviceUrl });
```

```javascript
// Correct: enable clustering to group nearby features
const layer = new FeatureLayer({
  url: serviceUrl,
  featureReduction: {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: {
        expression: "Text($feature.cluster_count, '#,###')"
      },
      symbol: {
        type: "text",
        color: "#004a5d",
        font: { size: "12px", weight: "bold" }
      },
      labelPlacement: "center-center"
    }]
  }
});
```

**Impact:** Clustering reduces rendered elements from thousands to dozens, dramatically improving frame rates.

#### Binning (50,000 - 500,000 features)

```javascript
const layer = new FeatureLayer({
  url: serviceUrl,
  featureReduction: {
    type: "binning",
    fixedBinLevel: 6,
    labelsVisible: true,
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: {
        expression: "Text($feature.aggregateCount, '#,###')"
      },
      symbol: {
        type: "text",
        color: "white",
        font: { size: "10px", weight: "bold" }
      }
    }],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 76, 115, 0.5],
        outline: { color: "white", width: 0.5 }
      },
      visualVariables: [{
        type: "color",
        field: "aggregateCount",
        stops: [
          { value: 1, color: "#d7e1ee" },
          { value: 100, color: "#6baed6" },
          { value: 1000, color: "#08519c" }
        ]
      }]
    }
  }
});
```

**Impact:** Binning aggregates features into hexagonal bins on the server, reducing data transfer and rendering cost.

#### Server-Side Tiling (500,000+ features)

```javascript
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";

const layer = new VectorTileLayer({ url: vectorTileServerUrl });
map.add(layer);

// Alternative: server-side filtering to limit features displayed
const filteredLayer = new FeatureLayer({
  url: serviceUrl,
  definitionExpression: "population > 10000",
  maxScale: 50000
});
```

### Memory Management

#### Destroying Views

```javascript
// Anti-pattern: removing DOM element without destroying view
function removeMap() {
  document.getElementById("viewDiv").remove();
  // View still alive in memory
}
```

```javascript
// Correct: destroy the view to release all resources
function removeMap(view) {
  view.destroy();
}
```

**Impact:** A single undestroyed MapView can retain 50-200MB of memory. In SPAs, this causes memory to grow until the tab crashes.

#### Handle Cleanup with Handle Groups

```javascript
// Anti-pattern: creating watchers without tracking them
function setupWatchers(view) {
  reactiveUtils.watch(() => view.extent, (extent) => updatePanel(extent));
  reactiveUtils.watch(() => view.scale, (scale) => updateScaleBar(scale));
  // These watches live forever
}
```

```javascript
// Correct: use handle groups for organized cleanup
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

function setupWatchers(view) {
  const handle1 = reactiveUtils.watch(
    () => view.extent, (extent) => updatePanel(extent)
  );
  const handle2 = reactiveUtils.watch(
    () => view.scale, (scale) => updateScaleBar(scale)
  );
  view.addHandles([handle1, handle2], "my-watchers");
}

function cleanup(view) {
  view.removeHandles("my-watchers");
}
```

**Impact:** Orphaned watchers continue executing callbacks on destroyed components, causing errors and memory leaks.

#### AbortController for Cancellable Queries

```javascript
// Anti-pattern: queries that cannot be cancelled
async function onViewChange(view) {
  const results = await layer.queryFeatures({
    geometry: view.extent, outFields: ["name"]
  });
  currentResults = results;
}
```

```javascript
// Correct: use AbortController to cancel superseded queries
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

let abortController = null;

async function onViewChange(view) {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const results = await layer.queryFeatures(
      { geometry: view.extent, outFields: ["name"] },
      { signal: abortController.signal }
    );
    updateUI(results);
  } catch (error) {
    if (!promiseUtils.isAbortError(error)) {
      console.error("Query failed:", error);
    }
  }
}
```

**Impact:** Without cancellation, rapid view changes trigger dozens of concurrent queries.

#### React Cleanup Pattern

```javascript
// Anti-pattern: no cleanup in React component
function MapComponent() {
  const mapRef = useRef(null);
  useEffect(() => {
    const view = new MapView({
      container: mapRef.current,
      map: new Map({ basemap: "streets-vector" })
    });
    // Missing cleanup
  }, []);
  return <div ref={mapRef} style={{ height: "100%" }} />;
}
```

```javascript
// Correct: destroy view on unmount
function MapComponent() {
  const mapRef = useRef(null);
  useEffect(() => {
    const view = new MapView({
      container: mapRef.current,
      map: new Map({ basemap: "streets-vector" })
    });
    return () => { view.destroy(); };
  }, []);
  return <div ref={mapRef} style={{ height: "100%" }} />;
}
```

**Impact:** React strict mode mounts and unmounts components twice. Without cleanup, two views are created but only one is visible.

> **Note:** Map Components (`<arcgis-map>`, `<arcgis-scene>`) manage their own lifecycle. When the DOM element is removed by React, Angular, or Vue, the component cleans up internally.

### 2D View Performance

#### Waiting for Stationary

```javascript
// Anti-pattern: running expensive queries on every view change
reactiveUtils.watch(
  () => view.extent,
  async (extent) => {
    // Fires dozens of times per second during panning
    const results = await layer.queryFeatures({
      geometry: extent, outFields: ["name", "population"]
    });
    updateSidebar(results);
  }
);
```

```javascript
// Correct: wait for view.stationary before querying
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => view.stationary,
  async (isStationary) => {
    if (isStationary) {
      const results = await layer.queryFeatures({
        geometry: view.extent, outFields: ["name", "population"]
      });
      updateSidebar(results);
    }
  }
);
```

**Impact:** `view.stationary` becomes `true` only after the user stops interacting. Reduces query calls from hundreds per interaction to one.

#### Debouncing Queries

```javascript
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

const debouncedQuery = promiseUtils.debounce(async (extent) => {
  const results = await layer.queryFeatures({
    geometry: extent, outFields: ["name"]
  });
  updateUI(results);
});

reactiveUtils.watch(() => view.extent, (extent) => debouncedQuery(extent));
```

**Impact:** `promiseUtils.debounce` is ArcGIS-aware: it handles abort errors and only executes the latest invocation.

#### Scale-Dependent Layer Visibility

```javascript
// Anti-pattern: all layers visible at all zoom levels
const parcelsLayer = new FeatureLayer({ url: parcelsUrl });
```

```javascript
// Correct: use minScale and maxScale
const parcelsLayer = new FeatureLayer({
  url: parcelsUrl,
  minScale: 25000,  // Only visible when zoomed in past 1:25,000
  maxScale: 0
});

const regionsLayer = new FeatureLayer({
  url: regionsUrl,
  minScale: 0,
  maxScale: 50000   // Hidden when zoomed in past 1:50,000
});
```

**Impact:** Without scale limits, a parcels layer with 500,000 features attempts to render all of them at state level.

### 3D Scene Performance

#### Quality Profile

```javascript
import SceneView from "@arcgis/core/views/SceneView.js";

const view = new SceneView({
  container: "viewDiv",
  map: map,
  qualityProfile: "low" // "low" | "medium" | "high"
});
```

| Quality Profile | Effect |
|---|---|
| `"low"` | Reduced texture resolution, fewer terrain tiles, lower polygon count |
| `"medium"` | Default balance of quality and performance |
| `"high"` | Maximum texture resolution, more terrain detail |

**Impact:** Switching from `"high"` to `"low"` can double frame rates on mid-range hardware.

#### Local vs Global Viewing Mode

```javascript
// Anti-pattern: using global mode for a focused area
const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: { position: { longitude: 8.5, latitude: 47.3, z: 500 }, tilt: 70 }
});
```

```javascript
// Correct: use local viewing mode for focused scenes
const view = new SceneView({
  container: "viewDiv",
  map: map,
  viewingMode: "local",
  clippingArea: {
    xmin: 8.4, ymin: 47.2, xmax: 8.6, ymax: 47.4,
    spatialReference: { wkid: 4326 }
  },
  camera: { position: { longitude: 8.5, latitude: 47.3, z: 500 }, tilt: 70 }
});
```

**Impact:** Global mode renders the entire Earth. Local mode clips to a flat plane, reducing terrain tiles and rendering complexity.

#### Shadow Performance

```javascript
// Anti-pattern: enabling shadows for all scenes by default
const view = new SceneView({
  container: "viewDiv",
  map: map,
  environment: { lighting: { directShadowsEnabled: true } }
});
```

```javascript
// Correct: enable shadows only when needed
const view = new SceneView({
  container: "viewDiv",
  map: map,
  environment: { lighting: { directShadowsEnabled: false } }
});

// Toggle on demand
function toggleShadows(view, enabled) {
  view.environment.lighting.directShadowsEnabled = enabled;
}
```

**Impact:** Real-time shadows approximately double rendering cost.

## Optimization (P2)

### Lazy Layer Loading

#### Load on Navigation

```javascript
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

const layerConfigs = [
  { url: url1, extent: region1Extent },
  { url: url2, extent: region2Extent }
];
const loadedLayers = new Set();

reactiveUtils.watch(
  () => view.stationary && view.extent,
  (extent) => {
    if (!extent) return;
    for (const config of layerConfigs) {
      if (!loadedLayers.has(config.url) && extent.intersects(config.extent)) {
        map.add(new FeatureLayer({ url: config.url }));
        loadedLayers.add(config.url);
      }
    }
  }
);
```

#### Load on User Toggle

```javascript
async function toggleLayer(registry, id, map) {
  const entry = registry.get(id);
  if (!entry) return;

  if (entry.layer) {
    entry.layer.visible = !entry.layer.visible;
  } else {
    entry.layer = new FeatureLayer({ url: entry.url });
    map.add(entry.layer);
    await entry.layer.when();
  }
}
```

### Non-Critical Layer Deferral

```javascript
// Correct: defer non-critical layers until the browser is idle
map.add(criticalLayer);
await Promise.all([criticalLayer.when(), view.when()]);

function addWhenIdle(layerFactory) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => map.add(layerFactory()));
  } else {
    setTimeout(() => map.add(layerFactory()), 200);
  }
}

addWhenIdle(() => new FeatureLayer({ url: labelsUrl }));
addWhenIdle(() => new FeatureLayer({ url: boundariesUrl }));
```

**Impact:** `requestIdleCallback` schedules work during browser idle periods, ensuring non-critical layers do not compete with critical rendering.

## Common Pitfalls

1. **Forgetting to cancel queries on rapid view changes**: Without AbortController, each pan/zoom triggers a new query while previous queries are still in-flight.

2. **Using `outFields: ["*"]` by default**: Always specify only the fields you need.

3. **Not using `returnGeometry: false`**: When building lists, tables, or statistics, geometry is unnecessary overhead.

4. **Missing `view.destroy()` in SPAs**: Each map component mount without destroying the previous view causes memory to grow.

5. **Loading all layers at startup**: Use `definitionExpression`, `minScale`/`maxScale`, and lazy loading to reduce the initial working set.

6. **Watching `view.extent` for expensive operations**: Use `view.stationary` or `promiseUtils.debounce` to batch updates.

7. **Barrel imports in production builds**: Always use deep imports like `import Map from "@arcgis/core/Map.js"`.

8. **Enabling shadows in 3D without need**: `directShadowsEnabled: true` approximately doubles rendering cost.

9. **Using global viewing mode for local scenes**: `viewingMode: "local"` with `clippingArea` avoids rendering the entire globe.

10. **Not using featureReduction for large point datasets**: Datasets with more than 2,000 points should use clustering or binning.

## Reference Samples

- `featurereduction-cluster` - Intro to clustering
- `featurereduction-binning` - Aggregate features to bins to visualize density
- `featurereduction-cluster-query` - Query clusters for performance analysis
- `featurelayerview-query` - Efficient client-side feature querying
- `layers-featurelayer-large-collection` - Keep apps interactive with large datasets
- `featurelayer-queryextent` - Optimize queries with extent-based requests

## Related Skills

- See `arcgis-core-maps` for map/view initialization patterns
- See `arcgis-layers` for layer configuration and queries
- See `arcgis-core-utilities` for reactiveUtils and promiseUtils
- See `arcgis-starter-app` for build tool configuration
