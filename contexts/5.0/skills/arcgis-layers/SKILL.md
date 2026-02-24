---
name: arcgis-layers
description: Add and manage data layers in ArcGIS maps. Use for FeatureLayer, TileLayer, SceneLayer, GeoJSONLayer, and all other layer types. Covers layer configuration, queries, and management.
---

# ArcGIS Layers

Use this skill when adding, configuring, or querying data layers in ArcGIS maps.

## Import Patterns

### Direct ESM Imports
```javascript
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
```

### Dynamic Imports (CDN)
```javascript
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const [GraphicsLayer, Graphic] = await $arcgis.import([
  "@arcgis/core/layers/GraphicsLayer.js",
  "@arcgis/core/Graphic.js"
]);
```

## Layer Types Overview

| Layer Type | Use Case | Geometry |
|------------|----------|----------|
| FeatureLayer | Most common - feature services, editable data | Points, lines, polygons |
| GraphicsLayer | Client-side temporary graphics | Any |
| GeoJSONLayer | GeoJSON files/URLs | Points, lines, polygons |
| CSVLayer | CSV files with coordinates | Points |
| TileLayer | Cached map tiles | Raster |
| VectorTileLayer | Vector tiles (Mapbox style) | Vector |
| ImageryTileLayer | Raster imagery | Raster |
| SceneLayer | 3D buildings, meshes | 3D objects |
| IntegratedMeshLayer | Photogrammetry meshes | 3D mesh |
| PointCloudLayer | LiDAR point clouds | Points |
| ParquetLayer | Apache Parquet files | Points, lines, polygons |
| StreamLayer | Real-time WebSocket data | Points, lines, polygons |

## FeatureLayer

### From URL
```javascript
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
  outFields: ["*"],
  popupTemplate: {
    title: "{Tree_ID}",
    content: "Height: {Crown_Height} ft"
  }
});

map.add(featureLayer);
```

### From Portal Item
```javascript
const featureLayer = new FeatureLayer({
  portalItem: {
    id: "51c851fef66143959986b473b345b7ca"
  },
  outFields: ["*"]
});
```

### Client-Side (In-Memory)
```javascript
const featureLayer = new FeatureLayer({
  source: graphics, // Array of Graphic objects
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "name", type: "string" },
    { name: "value", type: "double" }
  ],
  objectIdField: "ObjectID",
  geometryType: "point",
  spatialReference: { wkid: 4326 },
  renderer: {
    type: "simple",
    symbol: { type: "simple-marker", color: "blue" }
  }
});
```

### Configuration Options
```javascript
const featureLayer = new FeatureLayer({
  url: "...",
  outFields: ["*"],           // Fields to include (* = all)
  definitionExpression: "population > 10000", // SQL filter
  minScale: 500000,           // Hide when zoomed out beyond this
  maxScale: 0,                // Hide when zoomed in beyond this
  visible: true,              // Initial visibility
  opacity: 0.8,               // Transparency (0-1)
  title: "Cities",            // Display name
  blendMode: "normal",        // Blend mode for compositing
  orderBy: [{ field: "population" }], // Feature draw order
  featureReduction: null,     // Clustering / binning config
  labelingInfo: [...],        // Labels
  renderer: {...},            // Symbology
  popupTemplate: {...},       // Popup configuration
  elevationInfo: {            // 3D elevation mode
    mode: "relative-to-ground"
  }
});
```

## GraphicsLayer

```javascript
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";

const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

// Add a point
const pointGraphic = new Graphic({
  geometry: {
    type: "point",
    longitude: -118.24,
    latitude: 34.05
  },
  symbol: {
    type: "simple-marker",
    color: "red",
    size: 12
  },
  attributes: { name: "Los Angeles" },
  popupTemplate: { title: "{name}" }
});

graphicsLayer.add(pointGraphic);

// Add multiple graphics
graphicsLayer.addMany([graphic1, graphic2, graphic3]);

// Remove graphics
graphicsLayer.remove(pointGraphic);
graphicsLayer.removeAll();
```

## GeoJSONLayer

```javascript
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

const geojsonLayer = new GeoJSONLayer({
  url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
  copyright: "USGS Earthquakes",
  popupTemplate: {
    title: "Earthquake Info",
    content: "Magnitude {mag} hit {place} on {time}",
    fieldInfos: [{
      fieldName: "time",
      format: { dateFormat: "short-date-short-time" }
    }]
  },
  renderer: {
    type: "simple",
    symbol: { type: "simple-marker", color: "orange" },
    visualVariables: [{
      type: "size",
      field: "mag",
      stops: [
        { value: 2.5, size: "4px" },
        { value: 8, size: "40px" }
      ]
    }]
  },
  orderBy: [{ field: "mag" }] // Draw smaller on top
});

map.add(geojsonLayer);
```

## CSVLayer

```javascript
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";

const csvLayer = new CSVLayer({
  url: "https://example.com/data.csv",
  latitudeField: "latitude",  // Column name for lat
  longitudeField: "longitude", // Column name for lon
  delimiter: ",",
  popupTemplate: {
    title: "{name}",
    content: "{description}"
  }
});
```

## TileLayer (Cached Tiles)

```javascript
import TileLayer from "@arcgis/core/layers/TileLayer.js";

const tileLayer = new TileLayer({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
});

map.add(tileLayer);
```

## VectorTileLayer

```javascript
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";

// From portal item
const vtl = new VectorTileLayer({
  portalItem: { id: "VECTOR_TILE_ITEM_ID" }
});

// From URL
const vtl2 = new VectorTileLayer({
  url: "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer"
});
```

## ImageryTileLayer

```javascript
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer.js";

const imageryLayer = new ImageryTileLayer({
  url: "https://tiledimageservices.arcgis.com/..."
});

// From Cloud Optimized GeoTIFF (COG)
const cogLayer = new ImageryTileLayer({
  url: "https://example.com/image.tif"
});
```

## 3D Layers

### SceneLayer (3D Buildings)
```javascript
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";

const sceneLayer = new SceneLayer({
  portalItem: { id: "2e0761b9a4274b8db52c4bf34356911e" },
  popupEnabled: false
});

// Add to SceneView map
map.add(sceneLayer);

// Custom 3D symbology
sceneLayer.renderer = {
  type: "simple",
  symbol: {
    type: "mesh-3d",
    symbolLayers: [{
      type: "fill",
      material: { color: [244, 247, 134] }
    }]
  }
};
```

### IntegratedMeshLayer
```javascript
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";

const meshLayer = new IntegratedMeshLayer({
  url: "https://tiles.arcgis.com/tiles/.../IntegratedMeshServer"
});
```

### PointCloudLayer
```javascript
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer.js";

const pcLayer = new PointCloudLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});
```

## Specialized Layers

> For WMS, WFS, KML, MapImageLayer, and CatalogLayer, see `arcgis-advanced-layers`.

### StreamLayer (Real-time)
```javascript
import StreamLayer from "@arcgis/core/layers/StreamLayer.js";

const streamLayer = new StreamLayer({
  url: "wss://example.com/stream/service",
  purgeOptions: {
    displayCount: 10000
  }
});
```

### ParquetLayer (File-based)
```javascript
import ParquetLayer from "@arcgis/core/layers/ParquetLayer.js";

const parquetLayer = new ParquetLayer({
  urls: [
    "https://example.com/data.parquet"
  ],
  title: "Parquet Data",
  renderer: {
    type: "simple",
    symbol: { type: "simple-marker", color: "blue" }
  },
  popupTemplate: {
    title: "{name}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "field1", label: "Field 1" }
      ]
    }]
  }
});

// Query feature count
const count = await parquetLayer.queryFeatureCount();
```

### GeoRSSLayer
```javascript
import GeoRSSLayer from "@arcgis/core/layers/GeoRSSLayer.js";

const georssLayer = new GeoRSSLayer({
  url: "https://example.com/feed.xml"
});

map.add(georssLayer);

// Zoom to layer extent
await view.whenLayerView(georssLayer);
view.goTo(georssLayer.fullExtent);
```

### WebTileLayer
```javascript
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";

// OpenStreetMap tiles
const osmLayer = new WebTileLayer({
  urlTemplate: "https://{subDomain}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  subDomains: ["a", "b", "c"],
  copyright: "OpenStreetMap contributors"
});

// Custom tile service
const customTileLayer = new WebTileLayer({
  urlTemplate: "https://tiles.example.com/{level}/{col}/{row}.png"
});

map.add(osmLayer);
```

### MapNotesLayer
```javascript
import MapNotesLayer from "@arcgis/core/layers/MapNotesLayer.js";

// Layer for sketches and annotations
const notesLayer = new MapNotesLayer();
map.add(notesLayer);

// Access sublayers
const pointLayer = notesLayer.pointLayer;
const polylineLayer = notesLayer.polylineLayer;
const polygonLayer = notesLayer.polygonLayer;
const textLayer = notesLayer.textLayer;

// Add a text annotation
const textGraphic = new Graphic({
  geometry: point,
  symbol: {
    type: "text",
    text: "Note here",
    color: [255, 255, 255],
    haloColor: [0, 0, 0],
    haloSize: 2,
    font: { family: "Arial", size: 14 }
  }
});
textLayer.add(textGraphic);
```

## Layer Management

### Adding Layers
```javascript
// Add single layer
map.add(layer);

// Add at specific index (0 = bottom)
map.add(layer, 0);

// Add multiple layers
map.addMany([layer1, layer2, layer3]);

// Add to Map Component
const viewElement = document.querySelector("arcgis-map");
viewElement.map.add(layer);
```

### Removing Layers
```javascript
map.remove(layer);
map.removeMany([layer1, layer2]);
map.removeAll();
```

### Layer Ordering
```javascript
// Reorder layer
map.reorder(layer, newIndex);

// Get layer position
const index = map.layers.indexOf(layer);

// Find layer by id
const layer = map.findLayerById("myLayerId");

// Find layer by title
const layer = map.layers.find(l => l.title === "Cities");
```

### Visibility and Opacity
```javascript
layer.visible = false;
layer.opacity = 0.5; // 0-1

// Watch visibility changes
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => layer.visible,
  (newValue) => console.log("Visibility changed:", newValue)
);
```

## Querying Features

### Basic Query
```javascript
// Create query from layer settings
const query = featureLayer.createQuery();
query.where = "population > 100000";
query.outFields = ["name", "population"];
query.returnGeometry = true;

const result = await featureLayer.queryFeatures(query);
console.log(result.features); // Array of Graphic objects
```

### Query with Pagination
```javascript
const query = featureLayer.createQuery();
query.start = 0;       // Start index
query.num = 20;        // Number of features
query.orderByFields = ["population DESC"];

const result = await featureLayer.queryFeatures(query);
```

### Spatial Query
```javascript
const query = featureLayer.createQuery();
query.geometry = view.extent; // Or any geometry
query.spatialRelationship = "intersects"; // contains, crosses, etc.
query.returnGeometry = true;

const result = await featureLayer.queryFeatures(query);
```

### Count Query
```javascript
const count = await featureLayer.queryFeatureCount();
console.log("Total features:", count);
```

### Extent Query
```javascript
const result = await featureLayer.queryExtent();
console.log("Feature count:", result.count);
await view.goTo(result.extent);
```

### Statistics Query
```javascript
const query = featureLayer.createQuery();
query.outStatistics = [{
  statisticType: "sum",
  onStatisticField: "population",
  outStatisticFieldName: "totalPop"
}, {
  statisticType: "avg",
  onStatisticField: "population",
  outStatisticFieldName: "avgPop"
}];

const result = await featureLayer.queryFeatures(query);
console.log(result.features[0].attributes.totalPop);
```

### Query from LayerView (Client-side)
```javascript
const layerView = await view.whenLayerView(featureLayer);

// Query only currently visible features
const query = layerView.createQuery();
query.geometry = view.extent;

const result = await layerView.queryFeatures(query);
```

## Query Methods Reference

| Method | Returns | Use When |
|--------|---------|----------|
| `queryFeatures(query)` | FeatureSet (graphics) | You need the actual feature data |
| `queryObjectIds(query)` | number[] (OIDs) | You only need IDs for highlighting |
| `queryFeatureCount(query)` | number | You need a count without fetching data |
| `queryExtent(query)` | { count, extent } | You want to zoom to matching features |
| `queryRelatedFeatures(params)` | Related feature sets | You need related table records |
| `queryAttachments(params)` | AttachmentInfo[] | You need file attachments |

### Server vs Client-side Queries

| Aspect | `featureLayer.queryFeatures()` | `layerView.queryFeatures()` |
|--------|-------------------------------|----------------------------|
| Runs on | Server | Client (browser) |
| Data scope | All features in service | Only features in view/cache |
| Network cost | HTTP request per call | No network (already loaded) |
| Use when | Need full dataset, pagination, stats | Need fast filtering of visible features |

## Layer Loading

```javascript
// Wait for layer to load
await featureLayer.load();
console.log("Fields:", featureLayer.fields);
console.log("Extent:", featureLayer.fullExtent);

// Wait for layer view
const layerView = await view.whenLayerView(featureLayer);

// Check if updating
reactiveUtils.watch(
  () => layerView.updating,
  (updating) => {
    if (!updating) {
      console.log("Layer view finished updating");
    }
  }
);
```

## Definition Expressions (Filters)

```javascript
// SQL WHERE clause filter
featureLayer.definitionExpression = "state = 'California'";

// Clear filter
featureLayer.definitionExpression = null;

// Dynamic filter
function filterByYear(year) {
  featureLayer.definitionExpression = `year = ${year}`;
}
```

## TypeScript Usage

Layer configurations with `type` properties support autocasting. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety
const featureLayer = new FeatureLayer({
  source: graphics,
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "name", type: "string" }
  ],
  geometryType: "point",
  renderer: {
    type: "simple",
    symbol: { type: "simple-marker", color: "blue" }
  } as const
});
```

For complex layer configurations, use type annotations:

```typescript
const renderer: __esri.SimpleRendererProperties = {
  type: "simple",
  symbol: { type: "simple-marker", color: "blue" }
};

layer.renderer = renderer;
```

> **Tip:** See `arcgis-core-maps` for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `intro-layers` - Introduction to working with layers
- `layers-featurelayer` - FeatureLayer configuration and usage
- `layers-geojson` - Loading GeoJSON data as a layer
- `featurelayer-query` - Querying features from a FeatureLayer
- `get-started-graphics` - Working with Graphics and GraphicsLayer

## Related Skills

- See `arcgis-core-maps` for map and view setup.
- See `arcgis-visualization` for renderers, symbols, and visual variables.
- See `arcgis-popup-templates` for popup configuration.
- See `arcgis-editing` for feature editing with applyEdits.
- See `arcgis-advanced-layers` for WMS, WFS, KML, MapImageLayer, CatalogLayer.
- See `arcgis-3d-layers` for 3D-specific layer configuration.

## Common Pitfalls

1. **CORS errors with GeoJSON**: GeoJSON URLs must be CORS-enabled or use a proxy.

2. **Missing outFields**: Queries return no attribute values unless `outFields` is specified.

   ```javascript
   // Anti-pattern: querying without outFields
   const results = await featureLayer.queryFeatures({
     where: "population > 100000",
     returnGeometry: true
   });
   console.log(results.features[0].attributes.name); // undefined
   ```

   ```javascript
   // Correct: specify outFields to include desired attributes
   const results = await featureLayer.queryFeatures({
     where: "population > 100000",
     returnGeometry: true,
     outFields: ["name", "population", "state"]
   });
   console.log(results.features[0].attributes.name); // "Los Angeles"
   ```

   **Impact:** Feature attributes come back as `undefined` or `null`. The query succeeds but the response contains no usable attribute data, leading to silent data bugs.

3. **Not waiting for layer load**: Layer metadata (fields, extent, renderer) is unavailable until the layer finishes loading.

   ```javascript
   // Anti-pattern: accessing properties before load
   const layer = new FeatureLayer({ url: "https://services.arcgis.com/.../FeatureServer/0" });
   console.log(layer.fields); // null - layer has not loaded yet
   console.log(layer.fullExtent); // null
   ```

   ```javascript
   // Correct: await layer.load() first
   const layer = new FeatureLayer({ url: "https://services.arcgis.com/.../FeatureServer/0" });
   await layer.load();
   console.log(layer.fields); // Array of Field objects
   console.log(layer.fullExtent); // Extent object
   ```

   **Impact:** `fields` is `null` or an empty array, `fullExtent` is `null`, and any code that depends on layer metadata throws errors or silently fails.

4. **Wrong layer for MapView vs SceneView**: Some layers only work in 3D (SceneLayer, IntegratedMeshLayer, PointCloudLayer).

5. **Spatial reference mismatch**: Adding layers with a different spatial reference than the view without projection support.

   ```javascript
   // Anti-pattern: adding a layer in a different SR without handling projection
   const view = new MapView({
     spatialReference: { wkid: 4326 } // WGS84
   });
   const layer = new FeatureLayer({
     url: "https://services.arcgis.com/.../FeatureServer/0" // Data in Web Mercator (3857)
   });
   view.map.add(layer); // Features may render in wrong location
   ```

   ```javascript
   // Correct: match spatial references or load the projection engine
   import * as projection from "@arcgis/core/geometry/projection.js";
   await projection.load();

   const view = new MapView({
     spatialReference: { wkid: 4326 }
   });
   const layer = new FeatureLayer({
     url: "https://services.arcgis.com/.../FeatureServer/0"
   });
   view.map.add(layer); // Projection engine handles the transformation
   ```

   **Impact:** Features appear in the wrong location, are offset by thousands of kilometers, or do not display at all when spatial references are incompatible.
