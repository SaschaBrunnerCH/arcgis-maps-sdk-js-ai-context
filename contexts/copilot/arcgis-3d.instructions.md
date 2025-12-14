---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - 3D Visualization

## SceneView

```javascript
import SceneView from "@arcgis/core/views/SceneView.js";

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

```html
<arcgis-scene basemap="topo-3d" ground="world-elevation">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
</arcgis-scene>
```

## 3D Layers

### SceneLayer (Buildings)
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

// RGB Renderer
layer.renderer = { type: "point-cloud-rgb", field: "RGB" };

// Classification Renderer
layer.renderer = {
  type: "point-cloud-unique-value",
  field: "CLASS_CODE",
  colorUniqueValueInfos: [
    { values: ["2"], label: "Ground", color: [139, 90, 43] },
    { values: ["6"], label: "Building", color: [194, 194, 194] }
  ]
};
```

### VoxelLayer
```javascript
import VoxelLayer from "@arcgis/core/layers/VoxelLayer.js";

const layer = new VoxelLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});
```

## 3D Symbols

### PointSymbol3D
```javascript
const symbol = {
  type: "point-3d",
  symbolLayers: [{
    type: "icon",
    resource: { primitive: "circle" },
    material: { color: "red" },
    size: 12
  }]
};

// Object symbol
const symbol = {
  type: "point-3d",
  symbolLayers: [{
    type: "object",
    resource: { primitive: "cylinder" },  // cone, cube, sphere, diamond
    material: { color: "blue" },
    height: 100,
    width: 10
  }]
};
```

### glTF Model
```javascript
const graphic = new Graphic({
  geometry: point,
  symbol: {
    type: "point-3d",
    symbolLayers: [{
      type: "object",
      resource: { href: "https://example.com/model.glb" },
      width: 10,
      height: 10
    }]
  }
});
```

### PolygonSymbol3D (Extrusion)
```javascript
const symbol = {
  type: "polygon-3d",
  symbolLayers: [{
    type: "extrude",
    material: { color: "blue" },
    size: 100
  }]
};
```

### MeshSymbol3D
```javascript
const symbol = {
  type: "mesh-3d",
  symbolLayers: [{
    type: "fill",
    material: { color: [244, 247, 134] }
  }]
};
```

## Weather Effects

```javascript
// Sunny
view.environment.weather = { type: "sunny", cloudCover: 0.2 };

// Cloudy
view.environment.weather = { type: "cloudy", cloudCover: 0.6 };

// Rainy
view.environment.weather = { type: "rainy", cloudCover: 0.8, precipitation: 0.5 };

// Foggy
view.environment.weather = { type: "foggy", fogStrength: 0.5 };

// Snowy
view.environment.weather = { type: "snowy", precipitation: 0.5, snowCover: "enabled" };
```

```html
<arcgis-expand slot="top-right">
  <arcgis-weather></arcgis-weather>
</arcgis-expand>
```

## Daylight & Lighting

```javascript
view.environment.lighting = {
  date: new Date("2024-06-21T12:00:00"),
  directShadowsEnabled: true,
  ambientOcclusionEnabled: true
};
```

```html
<arcgis-expand slot="top-right">
  <arcgis-daylight></arcgis-daylight>
</arcgis-expand>
```

## Ground Configuration

```javascript
// World elevation
map.ground = "world-elevation";

// Custom elevation
import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";

map.ground = {
  layers: [
    new ElevationLayer({
      url: "https://elevation.arcgis.com/.../Terrain3D/ImageServer"
    })
  ]
};

// Underground navigation
map.ground.navigationConstraint = "none";
map.ground.opacity = 0.5;
```

## Scene Environment

```javascript
view.environment.atmosphereEnabled = true;
view.environment.starsEnabled = true;
view.qualityProfile = "high";  // low, medium, high

// Background
view.environment.background = {
  type: "color",
  color: [0, 0, 0, 1]  // or [0, 0, 0, 0] for transparent
};
```

## Viewing Modes

```javascript
view.viewingMode = "global";  // Spherical Earth
view.viewingMode = "local";   // Flat, for local areas
```

```html
<arcgis-scene viewing-mode="local"></arcgis-scene>
```

## Elevation Info

```javascript
layer.elevationInfo = {
  mode: "on-the-ground",      // Features on ground
  mode: "relative-to-ground", // Height above ground
  mode: "absolute-height",    // Height above sea level
  mode: "relative-to-scene",  // Height above scene
  offset: 10,
  featureExpressionInfo: {
    expression: "$feature.height"
  }
};
```

## 3D Measurement

```html
<arcgis-direct-line-measurement-3d slot="top-right"></arcgis-direct-line-measurement-3d>
<arcgis-area-measurement-3d slot="top-right"></arcgis-area-measurement-3d>
```

## Common Pitfalls

1. **VoxelLayer requires local mode** - Use `viewing-mode="local"`
2. **Weather only in SceneView** - Doesn't work in MapView
3. **glTF model scale** - May need scaling to fit scene
4. **Ground navigation** - Set `navigationConstraint: "none"` for underground
5. **PointCloud fields** - Common: `RGB`, `CLASS_CODE`, `ELEVATION`
