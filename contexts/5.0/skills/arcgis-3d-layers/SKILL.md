---
name: arcgis-3d-layers
description: Add 3D layer types including SceneLayer, IntegratedMeshLayer, PointCloudLayer, VoxelLayer, and DimensionLayer to SceneView. Use for 3D buildings, LiDAR, volumetric data, glTF models, and 3D measurements.
---

# ArcGIS 3D Layers

Use this skill for 3D-specific layer types in SceneView: scene layers, integrated meshes, point clouds, voxels, dimensions, and glTF model imports.

## Import Patterns

### ESM (npm)
```javascript
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";
import IntegratedMesh3DTilesLayer from "@arcgis/core/layers/IntegratedMesh3DTilesLayer.js";
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer.js";
import VoxelLayer from "@arcgis/core/layers/VoxelLayer.js";
import DimensionLayer from "@arcgis/core/layers/DimensionLayer.js";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";
```

### CDN (dynamic import)
```javascript
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");
const PointCloudLayer = await $arcgis.import("@arcgis/core/layers/PointCloudLayer.js");
const VoxelLayer = await $arcgis.import("@arcgis/core/layers/VoxelLayer.js");
```

> All 3D-specific layers (SceneLayer, IntegratedMeshLayer, PointCloudLayer, VoxelLayer) require **SceneView** — they do not work in MapView.

## SceneLayer

SceneLayer displays 3D building models, objects, and mesh data from scene services.

### Basic SceneLayer

```javascript
const sceneLayer = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer",
  popupTemplate: {
    title: "{NAME}",
    content: "{*}"
  }
});

map.add(sceneLayer);
```

### SceneLayer with Renderer

```javascript
const sceneLayer = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer",
  renderer: {
    type: "simple",
    symbol: {
      type: "mesh-3d",
      symbolLayers: [{
        type: "fill",
        material: { color: [244, 247, 134] },
        edges: {
          type: "solid",
          color: [50, 50, 50, 0.5],
          size: 1
        }
      }]
    }
  }
});
```

### SceneLayer Edge Rendering

```javascript
// Solid edges
const solidEdges = {
  type: "solid",
  color: [50, 50, 50, 0.5],
  size: 1
};

// Sketch edges
const sketchEdges = {
  type: "sketch",
  color: [50, 50, 50, 0.8],
  size: 1.5,
  extensionLength: 2
};

sceneLayer.renderer = {
  type: "simple",
  symbol: {
    type: "mesh-3d",
    symbolLayers: [{
      type: "fill",
      material: { color: "white" },
      edges: sketchEdges
    }]
  }
};
```

### Querying SceneLayer

```javascript
const layerView = await view.whenLayerView(sceneLayer);

// Client-side query
const query = layerView.createQuery();
query.geometry = view.extent;
query.where = "HEIGHT > 100";
const results = await layerView.queryFeatures(query);

// Server-side query
const serverQuery = sceneLayer.createQuery();
serverQuery.where = "CATEGORY = 'Commercial'";
serverQuery.outFields = ["*"];
const serverResults = await sceneLayer.queryFeatures(serverQuery);
```

### Editable SceneLayer

```javascript
// Apply edits to scene layer (if editing enabled)
await sceneLayer.applyEdits({
  addFeatures: [newGraphic],
  updateFeatures: [updatedGraphic],
  deleteFeatures: [{ objectId: 123 }]
});
```

## IntegratedMeshLayer

IntegratedMeshLayer displays photogrammetric mesh data (3D reality capture).

```javascript
const meshLayer = new IntegratedMeshLayer({
  url: "https://tiles.arcgis.com/tiles/.../IntegratedMeshServer"
});

map.add(meshLayer);
```

### IntegratedMesh3DTilesLayer

For 3D Tiles 1.1 data sources:

```javascript
const mesh3DTiles = new IntegratedMesh3DTilesLayer({
  url: "https://example.com/tileset.json"
});

map.add(mesh3DTiles);
```

### Mesh Modifications

```javascript
// Clip or replace mesh areas
const modification = {
  geometry: polygon,
  type: "clip" // or "replace", "mask"
};
```

## PointCloudLayer (LiDAR Data)

### Basic PointCloudLayer

```javascript
const pcLayer = new PointCloudLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});

map.add(pcLayer);
```

### PointCloud Renderers

```javascript
// RGB (True Color) Renderer
pcLayer.renderer = {
  type: "point-cloud-rgb",
  field: "RGB"
};

// Classification Renderer
pcLayer.renderer = {
  type: "point-cloud-unique-value",
  field: "CLASS_CODE",
  colorUniqueValueInfos: [
    { values: ["2"], label: "Ground", color: [139, 90, 43] },
    { values: ["6"], label: "Building", color: [194, 194, 194] },
    { values: ["5"], label: "High Vegetation", color: [34, 139, 34] }
  ]
};

// Elevation Stretch Renderer
pcLayer.renderer = {
  type: "point-cloud-stretch",
  field: "ELEVATION",
  stops: [
    { value: 0, color: [0, 0, 255] },
    { value: 50, color: [255, 255, 0] },
    { value: 100, color: [255, 0, 0] }
  ]
};
```

### PointCloud Density and Size

```javascript
pcLayer.pointsPerInch = 40; // Density control
```

### PointCloud Filters

```javascript
// Include only specific classifications
pcLayer.filters = [{
  field: "CLASS_CODE",
  mode: "include",
  values: [2, 6] // Ground and Building
}];

// Remove filters
pcLayer.filters = [];
```

### Smart Mapping for PointCloud

```javascript
import * as colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";
import * as typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";

// True color renderer
const rgbResponse = await colorRendererCreator.createPCTrueColorRenderer({
  layer: pcLayer
});
pcLayer.renderer = rgbResponse.renderer;

// Classification renderer
const classResponse = await typeRendererCreator.createPCClassRenderer({
  layer: pcLayer,
  field: "CLASS_CODE"
});
pcLayer.renderer = classResponse.renderer;
```

## VoxelLayer (Volumetric 3D Data)

VoxelLayer displays 3D volumetric data (atmospheric, oceanographic, geological).

### Basic VoxelLayer

```javascript
const voxelLayer = new VoxelLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer",
  currentVariableId: 0
});

map.add(voxelLayer);
```

### VoxelLayer with Map Component

```html
<arcgis-scene viewing-mode="local">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>

<script type="module">
  import VoxelLayer from "@arcgis/core/layers/VoxelLayer.js";
  import Map from "@arcgis/core/Map.js";

  const vxlLayer = new VoxelLayer({
    url: "https://tiles.arcgis.com/tiles/.../SceneServer"
  });

  const viewElement = document.querySelector("arcgis-scene");
  viewElement.map = new Map({
    layers: [vxlLayer],
    ground: { navigationConstraint: { type: "none" } }
  });
</script>
```

### VoxelLayer Configuration

```javascript
const voxelLayer = new VoxelLayer({
  url: "...",
  currentVariableId: 0,
  enableDynamicSections: true,
  volumeDisplayQuality: "high" // "low", "medium", "high"
});

await voxelLayer.load();
console.log("Variables:", voxelLayer.variables);
console.log("Styles:", voxelLayer.styles);
```

### Voxel Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentVariableId` | number | Active variable to display |
| `currentStyleId` | number | Active style/rendering |
| `enableDynamicSections` | boolean | Allow interactive slicing |
| `volumeDisplayQuality` | string | `"low"`, `"medium"`, `"high"` |
| `variables` | VoxelVariable[] | Available data variables |
| `styles` | VoxelTransferFunctionStyle[] | Rendering styles |

### Voxel Slicing (Dynamic Sections)

```javascript
voxelLayer.enableDynamicSections = true;

// Configure slice plane
const slicePlane = {
  point: { x: 0, y: 0, z: -500 },
  normal: { x: 0, y: 0, z: 1 }
};
```

### Voxel Isosurfaces

```javascript
// Create isosurface at specific value
const isosurface = {
  value: 25,
  enabled: true,
  color: [255, 0, 0, 0.7]
};
```

### Voxel Color Stops

```javascript
// Customize color stops for variable rendering
// Accessed through voxelLayer.styles
```

## DimensionLayer (3D Measurements)

### Basic DimensionLayer

```javascript
import DimensionLayer from "@arcgis/core/layers/DimensionLayer.js";
import DimensionAnalysis from "@arcgis/core/analysis/DimensionAnalysis.js";
import LengthDimension from "@arcgis/core/analysis/LengthDimension.js";

const dimensionAnalysis = new DimensionAnalysis({
  style: {
    type: "simple",
    textBackgroundColor: [0, 0, 0, 0.6],
    textColor: "white",
    fontSize: 12
  }
});

const dimensionLayer = new DimensionLayer({
  title: "Dimensions",
  source: dimensionAnalysis
});

map.add(dimensionLayer);
```

### Add Length Dimensions

```javascript
const dimension = new LengthDimension({
  startPoint: {
    x: -122.4, y: 37.8, z: 0,
    spatialReference: { wkid: 4326 }
  },
  endPoint: {
    x: -122.5, y: 37.8, z: 0,
    spatialReference: { wkid: 4326 }
  },
  orientation: 0,
  offset: 10
});

dimensionLayer.source.dimensions.push(dimension);
```

### Interactive Dimension Placement

```javascript
const layerView = await view.whenLayerView(dimensionLayer);

const abortController = new AbortController();

async function startPlacement() {
  try {
    while (!abortController.signal.aborted) {
      await layerView.place({ signal: abortController.signal });
    }
  } catch (error) {
    if (!promiseUtils.isAbortError(error)) throw error;
  }
}

startPlacement();

// Stop placement
abortController.abort();
```

## BuildingSceneLayer

```javascript
const buildingLayer = new BuildingSceneLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});

await buildingLayer.load();

// Access sublayers (disciplines and categories)
buildingLayer.allSublayers.forEach(sublayer => {
  console.log(sublayer.title, sublayer.type);
});
```

## Importing 3D Models (glTF)

### glTF Symbol

```javascript
const graphic = new Graphic({
  geometry: {
    type: "point",
    longitude: -122.4,
    latitude: 37.8,
    z: 0
  },
  symbol: {
    type: "point-3d",
    symbolLayers: [{
      type: "object",
      resource: {
        href: "https://example.com/model.glb"
      },
      width: 10,
      height: 10,
      depth: 10,
      heading: 45,
      tilt: 0,
      roll: 0
    }]
  }
});

graphicsLayer.add(graphic);
```

### Interactive Model Placement

```javascript
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";

const graphicsLayer = new GraphicsLayer({
  elevationInfo: { mode: "on-the-ground" }
});

const sketchVM = new SketchViewModel({
  layer: graphicsLayer,
  view: view,
  pointSymbol: {
    type: "point-3d",
    symbolLayers: [{
      type: "object",
      resource: { href: "https://example.com/model.glb" }
    }]
  }
});

sketchVM.create("point");

sketchVM.on("create", (event) => {
  if (event.state === "complete") {
    sketchVM.update(event.graphic);
  }
});
```

## Elevation Info

```javascript
// Feature placement relative to ground/scene
layer.elevationInfo = {
  mode: "on-the-ground"          // Features draped on ground
  // mode: "relative-to-ground"  // Features offset from ground
  // mode: "relative-to-scene"   // Features offset from scene
  // mode: "absolute-height"     // Features at absolute Z values
};

// With offset
layer.elevationInfo = {
  mode: "relative-to-ground",
  offset: 100,
  unit: "meters"
};

// With expression
layer.elevationInfo = {
  mode: "relative-to-ground",
  featureExpressionInfo: {
    expression: "Geometry($feature).z * 10"
  },
  unit: "meters"
};
```

## 3D Analysis Components

| Component | Purpose |
|-----------|---------|
| `arcgis-building-explorer` | Explore building scene layers by discipline and floor |
| `arcgis-elevation-profile` | Generate elevation profiles along a path |
| `arcgis-line-of-sight` | Analyze line-of-sight visibility |
| `arcgis-shadow-cast` | Simulate shadow casting at different times |
| `arcgis-slice` | Slice through 3D content to reveal interior |
| `arcgis-directional-pad` | Navigate 3D scenes with directional controls |

## Viewing Modes

```javascript
// Global mode (default) - spherical Earth
view.viewingMode = "global";

// Local mode - flat, for local areas
view.viewingMode = "local";
```

```html
<!-- Local mode for indoor/underground/voxel -->
<arcgis-scene viewing-mode="local">
</arcgis-scene>
```

## Common Pitfalls

1. **SceneView only**: SceneLayer, IntegratedMeshLayer, PointCloudLayer, and VoxelLayer only work in SceneView, not MapView.

2. **VoxelLayer requires local viewing mode**: Use `viewing-mode="local"` for best results with voxel data.

3. **PointCloud renderer fields**: Common fields are `RGB`, `CLASS_CODE`, `ELEVATION`, `INTENSITY`.

4. **glTF model scale**: Models may need explicit `width`/`height`/`depth` to fit the scene properly.

5. **Ground navigation constraint**: Set `navigationConstraint: { type: "none" }` to allow underground viewing.

6. **Load before accessing metadata**: Always `await layer.load()` before accessing `variables`, `styles`, `allSublayers`, or similar properties.

## Reference Samples

- `layers-scenelayer` — Basic SceneLayer
- `layers-scenelayer-edges` — Edge rendering styles
- `layers-pointcloud` — PointCloudLayer with renderers
- `layers-pointcloud-filters` — Filtering point cloud data
- `layers-voxel` — VoxelLayer basics
- `layers-voxel-isosurface` — Isosurface visualization
- `layers-voxel-dynamic-sections` — Voxel slicing
- `layers-integratedmeshlayer` — IntegratedMeshLayer
- `layers-dimension` — DimensionLayer measurements
- `import-gltf` — Importing glTF 3D models

## Related Skills

- `arcgis-scene-environment` — Lighting, weather, atmosphere, shadows
- `arcgis-custom-rendering` — RenderNode for custom 3D WebGL rendering
- `arcgis-visualization` — Renderers and symbology
- `arcgis-layers` — Common layer patterns and configuration
