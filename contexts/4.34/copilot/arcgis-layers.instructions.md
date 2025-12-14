---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Layers

## Layer Types Overview

| Layer Type | Use Case |
|------------|----------|
| FeatureLayer | Feature services, editable data |
| GraphicsLayer | Client-side temporary graphics |
| GeoJSONLayer | GeoJSON files/URLs |
| CSVLayer | CSV files with coordinates |
| TileLayer | Cached map tiles |
| VectorTileLayer | Vector tiles |
| ImageryTileLayer | Raster imagery |
| SceneLayer | 3D buildings (SceneView only) |
| IntegratedMeshLayer | Photogrammetry meshes |
| PointCloudLayer | LiDAR point clouds |

## FeatureLayer

### From URL
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

### From Portal Item
```javascript
const layer = new FeatureLayer({
  portalItem: { id: "51c851fef66143959986b473b345b7ca" },
  outFields: ["*"]
});
```

### Client-Side (In-Memory)
```javascript
const layer = new FeatureLayer({
  source: graphics,
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "name", type: "string" },
    { name: "value", type: "double" }
  ],
  objectIdField: "ObjectID",
  geometryType: "point",
  spatialReference: { wkid: 4326 }
});
```

### Configuration Options
```javascript
const layer = new FeatureLayer({
  url: "...",
  outFields: ["*"],
  definitionExpression: "population > 10000",
  minScale: 500000,
  maxScale: 0,
  visible: true,
  opacity: 0.8,
  title: "Cities",
  elevationInfo: { mode: "relative-to-ground" }
});
```

## GraphicsLayer

```javascript
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";

const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

const graphic = new Graphic({
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

graphicsLayer.add(graphic);
graphicsLayer.addMany([graphic1, graphic2]);
graphicsLayer.removeAll();
```

## GeoJSONLayer

```javascript
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

const layer = new GeoJSONLayer({
  url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
  popupTemplate: {
    title: "Magnitude {mag}",
    content: "Location: {place}"
  }
});
```

## CSVLayer

```javascript
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";

const layer = new CSVLayer({
  url: "https://example.com/data.csv",
  latitudeField: "latitude",
  longitudeField: "longitude",
  delimiter: ","
});
```

## TileLayer

```javascript
import TileLayer from "@arcgis/core/layers/TileLayer.js";

const layer = new TileLayer({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
});
```

## VectorTileLayer

```javascript
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";

const layer = new VectorTileLayer({
  portalItem: { id: "VECTOR_TILE_ITEM_ID" }
});
```

## WebTileLayer (OpenStreetMap, etc.)

```javascript
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";

const osmLayer = new WebTileLayer({
  urlTemplate: "https://{subDomain}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  subDomains: ["a", "b", "c"],
  copyright: "OpenStreetMap contributors"
});
```

## 3D Layers

### SceneLayer
```javascript
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";

const layer = new SceneLayer({
  portalItem: { id: "2e0761b9a4274b8db52c4bf34356911e" }
});
```

### IntegratedMeshLayer
```javascript
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";

const layer = new IntegratedMeshLayer({
  url: "https://tiles.arcgis.com/tiles/.../IntegratedMeshServer"
});
```

### PointCloudLayer
```javascript
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer.js";

const layer = new PointCloudLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});
```

## Layer Management

```javascript
// Add layers
map.add(layer);
map.add(layer, 0); // At index
map.addMany([layer1, layer2]);

// Remove layers
map.remove(layer);
map.removeAll();

// Reorder
map.reorder(layer, newIndex);

// Find layer
const layer = map.findLayerById("myLayerId");
const layer = map.layers.find(l => l.title === "Cities");

// Visibility and opacity
layer.visible = false;
layer.opacity = 0.5;
```

## Querying Features

### Basic Query
```javascript
const query = layer.createQuery();
query.where = "population > 100000";
query.outFields = ["name", "population"];
query.returnGeometry = true;

const result = await layer.queryFeatures(query);
console.log(result.features);
```

### Spatial Query
```javascript
query.geometry = view.extent;
query.spatialRelationship = "intersects";
```

### Statistics Query
```javascript
query.outStatistics = [{
  statisticType: "sum",
  onStatisticField: "population",
  outStatisticFieldName: "totalPop"
}];
```

### Query from LayerView (Client-side)
```javascript
const layerView = await view.whenLayerView(layer);
const result = await layerView.queryFeatures(layerView.createQuery());
```

## Definition Expressions (Filters)

```javascript
layer.definitionExpression = "state = 'California'";
layer.definitionExpression = null; // Clear filter
```

## Layer Loading

```javascript
await layer.load();
console.log("Fields:", layer.fields);
console.log("Extent:", layer.fullExtent);

const layerView = await view.whenLayerView(layer);
layerView.watch("updating", (updating) => {
  if (!updating) console.log("Layer view ready");
});
```

## Common Pitfalls

1. **CORS errors with GeoJSON** - URL must be CORS-enabled
2. **Missing outFields** - Specify `outFields: ["*"]` for all attributes
3. **Not waiting for layer load** - Use `await layer.load()` before accessing properties
4. **Spatial reference mismatch** - Ensure layer matches view's spatial reference
