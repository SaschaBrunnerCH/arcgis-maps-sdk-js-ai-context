---
name: arcgis-performance
description: Optimize ArcGIS Maps SDK for JavaScript applications for speed, memory, and bundle size. Use for improving map initialization, data loading, query efficiency, large dataset handling, and view rendering performance in both 2D and 3D.
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
// Correct: use viewOnReady() which returns a promise when the view is ready
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

**Impact:** `setTimeout` with an arbitrary delay either fires too early (view not ready) or too late (wasted idle time). `view.when()` resolves at exactly the right moment.

#### Layer Readiness

```javascript
// Anti-pattern: accessing layer properties before it has loaded
const layer = new FeatureLayer({ url: serviceUrl });
map.add(layer);
console.log(layer.fields); // undefined - layer hasn't loaded yet
```

```javascript
// Correct: wait for the layer to load before accessing its properties
const layer = new FeatureLayer({ url: serviceUrl });
map.add(layer);
await layer.when();
console.log(layer.fields); // Now available
```

**Impact:** Accessing properties on an unloaded layer returns `undefined` or stale data. `layer.when()` ensures metadata is fetched and parsed.

### Data Loading Waterfalls

Each `await` in a loop forces the next layer to wait for the previous one to fully load before starting its network request.

```javascript
// Anti-pattern: sequential layer loading creates a waterfall
const urls = [
  "https://services.arcgis.com/.../FeatureServer/0",
  "https://services.arcgis.com/.../FeatureServer/1",
  "https://services.arcgis.com/.../FeatureServer/2",
  "https://services.arcgis.com/.../FeatureServer/3"
];

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

**Impact:** With 4 layers each taking 500ms to load, sequential loading takes ~2000ms. Parallel loading takes ~500ms (limited by the slowest layer).

#### Parallel Loading with Error Handling

```javascript
// Correct: parallel loading with individual error handling using Promise.allSettled
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

**Impact:** `Promise.allSettled` prevents one failed layer from blocking all others, while still loading everything in parallel.

### Bundle Size

The ArcGIS Maps SDK is modular, but incorrect import patterns can pull in the entire library.

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
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
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

**Impact:** Importing the entire package registers every component even if only a few are used. Individual imports allow the bundler to exclude unused components.

#### Bundle Size Comparison

| Import Pattern | Approximate Bundle Impact |
|---|---|
| `import "@arcgis/map-components"` | Entire component library loaded |
| `import "@arcgis/map-components/dist/components/arcgis-map"` | Only map component + dependencies |
| `import { Map } from "@arcgis/core"` | Barrel import, entire core pulled in |
| `import Map from "@arcgis/core/Map.js"` | Only Map class + direct dependencies |

#### Dynamic Imports for Code Splitting

```javascript
// Anti-pattern: importing heavy modules at startup that are only needed later
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

Inefficient queries transfer unnecessary data over the network and force the client to process more than needed.

#### Specify outFields

```javascript
// Anti-pattern: requesting all fields when only a few are needed
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

**Impact:** `outFields: ["*"]` transfers every field for every feature. For a layer with 50 fields, requesting only 4 reduces payload size by ~90%.

#### Skip Geometry When Not Needed

```javascript
// Anti-pattern: fetching geometry for a statistics panel or list view
const results = await layer.queryFeatures({
  where: "population > 100000",
  outFields: ["name", "population"],
  returnGeometry: true // Default is true
});
// Only using attributes, never the geometry
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

**Impact:** Geometry data (especially polygons) can be orders of magnitude larger than attribute data. Setting `returnGeometry: false` dramatically reduces response size for attribute-only use cases.

#### Server-Side Filtering with definitionExpression

```javascript
// Anti-pattern: loading all features then filtering on the client
const layer = new FeatureLayer({ url: serviceUrl });
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

**Impact:** Server-side filtering reduces data transferred from server to client. Loading 100,000 features to filter down to 500 wastes bandwidth, memory, and CPU.

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

**Impact:** `queryFeatureCount` and `queryExtent` are lightweight server operations. Fetching full feature geometries and attributes just to count them wastes bandwidth and memory.

### Large Dataset Handling

Rendering too many individual features causes frame drops and high memory usage. Choose a strategy based on data volume.

#### Strategy Thresholds

| Feature Count | Strategy | Implementation |
|---|---|---|
| < 2,000 | Render as-is | Default rendering |
| 2,000 - 50,000 | Clustering | featureReduction type `"cluster"` |
| 50,000 - 500,000 | Binning | featureReduction type `"binning"` |
| 500,000+ | Server-side tiling | Use VectorTileLayer or server-side filtering |

#### Clustering (2,000 - 50,000 features)

```javascript
// Anti-pattern: rendering thousands of individual point features
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
  // No featureReduction - all 20,000 points rendered individually
});
```

```javascript
// Correct: enable clustering to group nearby features
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  featureReduction: {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: { expression: "Text($feature.cluster_count, '#,###')" },
      symbol: { type: "text", color: "#004a5d", font: { size: "12px", weight: "bold" } },
      labelPlacement: "center-center"
    }]
  }
});
```

**Impact:** Clustering reduces rendered elements from thousands to dozens, dramatically improving frame rates. Users can still click clusters to expand and access individual features.

#### Binning (50,000 - 500,000 features)

```javascript
// Correct: use binning for very large point datasets
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  featureReduction: {
    type: "binning",
    fixedBinLevel: 6,
    labelsVisible: true,
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: { expression: "Text($feature.aggregateCount, '#,###')" },
      symbol: { type: "text", color: "white", font: { size: "10px", weight: "bold" } }
    }],
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color: [0, 76, 115, 0.5], outline: { color: "white", width: 0.5 } },
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

**Impact:** Binning aggregates features into hexagonal bins on the server, reducing data transfer and rendering cost. Unlike clustering, binning provides uniform spatial aggregation regardless of feature distribution.

#### Server-Side Tiling (500,000+ features)

```javascript
// Correct: use VectorTileLayer for massive datasets
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

**Impact:** For datasets exceeding 500,000 features, client-side rendering is not viable. Server-side tiling pre-renders features into vector tiles, enabling display of millions of features efficiently.

### Memory Management

Failing to clean up views and handles on component unmount causes memory leaks.

#### Destroying Views

```javascript
// Anti-pattern: removing the DOM element without destroying the view
function removeMap() {
  document.getElementById("viewDiv").remove();
  // View still alive in memory with all layers, graphics, etc.
}
```

```javascript
// Correct: destroy the view to release all resources
function removeMap(view) {
  view.destroy();
}
```

**Impact:** A single undestroyed MapView can retain 50-200MB of memory. In single-page applications, this causes memory to grow until the tab crashes.

#### Handle Cleanup with Handle Groups

```javascript
// Anti-pattern: creating watchers without tracking or removing them
function setupWatchers(view) {
  reactiveUtils.watch(() => view.extent, (extent) => updatePanel(extent));
  reactiveUtils.watch(() => view.scale, (scale) => updateScaleBar(scale));
  // These watches live forever, even after the component is gone
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

**Impact:** Orphaned watchers continue executing callbacks on destroyed components, causing errors and memory leaks. Handle groups provide a single cleanup call.

#### AbortController for Cancellable Queries

```javascript
// Anti-pattern: queries that cannot be cancelled
async function onViewChange(view) {
  const results = await layer.queryFeatures({
    geometry: view.extent, outFields: ["name"]
  });
  currentResults = results; // Stale if another query completed first
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

**Impact:** Without cancellation, rapid view changes trigger dozens of concurrent queries. Earlier queries may resolve after later ones, causing stale data to overwrite fresh data.

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
    // Missing cleanup - view leaks on unmount
  }, []);
  return <div ref={mapRef} style={{ height: "100%" }} />;
}
```

```javascript
// Correct: destroy view on unmount in React
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

**Impact:** React strict mode mounts and unmounts components twice. Without cleanup, two views are created but only one is visible. In production, route navigation leaks a full view each time.

#### Map Components Cleanup in Frameworks

Map Components (`<arcgis-map>`, `<arcgis-scene>`) manage their own lifecycle. When the DOM element is removed by React, Angular, or Vue, the component cleans up internally, avoiding the need for manual `view.destroy()` calls.

### 2D View Performance

MapView events like extent changes fire continuously during panning and zooming. Running expensive operations on every frame causes jank.

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

**Impact:** `view.stationary` becomes `true` only after the user stops interacting. This reduces query calls from hundreds per interaction to one.

#### Debouncing Queries

```javascript
// Correct: debounce for operations that should respond during interaction
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

const debouncedQuery = promiseUtils.debounce(async (extent) => {
  const results = await layer.queryFeatures({
    geometry: extent, outFields: ["name"]
  });
  updateUI(results);
});

reactiveUtils.watch(() => view.extent, (extent) => debouncedQuery(extent));
```

**Impact:** `promiseUtils.debounce` is ArcGIS-aware: it automatically handles abort errors from cancelled promises and only executes the latest invocation.

#### Scale-Dependent Layer Visibility

```javascript
// Anti-pattern: all layers visible at all zoom levels
const parcelsLayer = new FeatureLayer({ url: parcelsUrl });
const buildingsLayer = new FeatureLayer({ url: buildingsUrl });
```

```javascript
// Correct: use minScale and maxScale to limit when layers render
const parcelsLayer = new FeatureLayer({
  url: parcelsUrl,
  minScale: 25000,  // Only visible when zoomed in past 1:25,000
  maxScale: 0
});

const buildingsLayer = new FeatureLayer({
  url: buildingsUrl,
  minScale: 10000
});

const regionsLayer = new FeatureLayer({
  url: regionsUrl,
  minScale: 0,
  maxScale: 50000   // Hidden when zoomed in past 1:50,000
});
```

**Impact:** Without scale limits, a parcels layer with 500,000 features attempts to render all of them when zoomed out to state level. Scale-dependent visibility eliminates rendering work for layers not meaningful at the current scale.

### 3D Scene Performance

SceneView has additional considerations due to 3D rendering, terrain, lighting, and atmosphere.

#### Quality Profile

```javascript
// Correct: choose quality profile based on use case and target hardware
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
| `"high"` | Maximum texture resolution, more terrain detail, higher polygon count |

**Impact:** Switching from `"high"` to `"low"` can double frame rates on mid-range hardware, especially for scenes with terrain and many 3D objects.

#### Local vs Global Viewing Mode

```javascript
// Anti-pattern: using global mode for a focused area
const view = new SceneView({
  container: "viewDiv",
  map: map,
  // Default viewingMode is "global" - renders the entire globe
  camera: { position: { longitude: 8.5, latitude: 47.3, z: 500 }, tilt: 70 }
});
```

```javascript
// Correct: use local viewing mode for focused, small-area scenes
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

**Impact:** Global mode renders the entire Earth's curvature, atmosphere, and stars. Local mode clips the scene to a flat plane, reducing terrain tiles and rendering complexity.

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

// Toggle shadows on demand (e.g., for shadow analysis)
function toggleShadows(view, enabled) {
  view.environment.lighting.directShadowsEnabled = enabled;
}
```

**Impact:** Real-time shadows require rendering the scene from the light's perspective in addition to the camera's, approximately doubling rendering cost.

#### Level of Detail Considerations

```javascript
// Correct: use SceneLayer with minScale for detailed 3D objects
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";

const buildingsLayer = new SceneLayer({ url: buildingsUrl });
const detailedLayer = new SceneLayer({
  url: detailedBuildingsUrl,
  minScale: 5000 // Only load detailed 3D objects when zoomed in
});
```

**Impact:** SceneLayers use LOD technology to simplify distant objects. Combining with `minScale` prevents loading detailed 3D models at zoom levels where they appear as single pixels.

## Optimization (P2)

### Lazy Layer Loading

#### Load on Navigation

```javascript
// Anti-pattern: adding all layers upfront
map.addMany([layer1, layer2, layer3, layer4, layer5]);
```

```javascript
// Correct: load layers when the user navigates to the relevant area
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

**Impact:** Loading 5 layers at startup when the user only views one region wastes bandwidth and memory. Lazy loading ensures only relevant layers are fetched.

#### Load on User Toggle

```javascript
// Correct: create layer only when user first enables it in layer list
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

**Impact:** For applications with a layer list, creating layers only when first enabled avoids loading data that may never be viewed.

### Non-Critical Layer Deferral

#### Using requestIdleCallback

```javascript
// Anti-pattern: loading all layers at the same priority
map.addMany([criticalLayer, referenceLabels, decorativeBoundaries]);
```

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

**Impact:** `requestIdleCallback` schedules work during browser idle periods, ensuring non-critical layers do not compete with critical rendering or user interaction.

#### Prioritized Layer Loading

Load layers in tiers: (1) critical data layers first with `Promise.all`, (2) interactive layers after `view.when()`, (3) reference/decorative layers via `requestIdleCallback`. This ensures the user sees meaningful data as quickly as possible while reference layers load without blocking the critical path.

## Common Pitfalls

1. **Forgetting to cancel queries on rapid view changes**: Without AbortController, each pan/zoom triggers a new query while previous queries are still in-flight, wasting bandwidth and causing stale data race conditions.

2. **Using `outFields: ["*"]` by default**: Requesting all fields is the most common performance mistake with FeatureLayer queries. Always specify only the fields you need.

3. **Not using `returnGeometry: false`**: When building lists, tables, or statistics from query results, geometry is unnecessary overhead. Polygon geometries in particular can be extremely large.

4. **Missing `view.destroy()` in single-page applications**: Each time a map component mounts without destroying the previous view, memory grows. This is especially impactful in React, Angular, and Vue apps with route-based navigation.

5. **Loading all layers at startup**: Applications with 10+ layers should not load everything at once. Use `definitionExpression`, `minScale`/`maxScale`, and lazy loading to reduce the initial working set.

6. **Watching `view.extent` for expensive operations**: `view.extent` changes on every animation frame during panning. Use `view.stationary` or `promiseUtils.debounce` to batch updates.

7. **Barrel imports in production builds**: `import { Map } from "@arcgis/core"` looks clean but prevents tree-shaking. Always use deep imports: `import Map from "@arcgis/core/Map.js"`.

8. **Enabling shadows in 3D without need**: `directShadowsEnabled: true` approximately doubles rendering cost. Only enable for shadow analysis or presentation scenarios.

9. **Using global viewing mode for local scenes**: When displaying a single building, campus, or city block, `viewingMode: "local"` with a `clippingArea` avoids rendering the entire globe.

10. **Not using featureReduction for large point datasets**: Datasets with more than 2,000 points should use clustering or binning. Without feature reduction, thousands of overlapping markers cause poor rendering performance and an unusable visual experience.
