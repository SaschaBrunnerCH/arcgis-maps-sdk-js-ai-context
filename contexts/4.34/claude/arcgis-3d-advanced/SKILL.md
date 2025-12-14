---
name: arcgis-3d-advanced
description: Advanced 3D features including VoxelLayer, PointCloudLayer, weather effects, daylight simulation, glTF model imports, and custom WebGL rendering. Use for volumetric data, LiDAR visualization, and immersive 3D experiences.
---

# ArcGIS 3D Advanced

Use this skill for advanced 3D visualization including voxel layers, point clouds, weather, daylight, glTF imports, and custom rendering.

## VoxelLayer (Volumetric 3D Data)

VoxelLayer displays 3D volumetric data like atmospheric, oceanographic, or geological data.

### Basic VoxelLayer
```javascript
import VoxelLayer from "@arcgis/core/layers/VoxelLayer.js";

const voxelLayer = new VoxelLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer",
  visible: true,
  popupEnabled: true
});

map.add(voxelLayer);
```

### VoxelLayer with Map Component
```html
<arcgis-scene viewing-mode="local">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-legend slot="bottom-right"></arcgis-legend>
</arcgis-scene>

<script type="module">
  import VoxelLayer from "@arcgis/core/layers/VoxelLayer.js";

  const vxlLayer = new VoxelLayer({
    url: "https://tiles.arcgis.com/tiles/.../SceneServer"
  });

  const viewElement = document.querySelector("arcgis-scene");
  viewElement.map = new Map({
    layers: [vxlLayer],
    ground: { navigationConstraint: "none" }
  });
</script>
```

### VoxelLayer Configuration
```javascript
const voxelLayer = new VoxelLayer({
  url: "...",
  // Variable to display
  currentVariableId: 0,
  // Slicing
  enableDynamicSections: true,
  // Rendering style
  renderStyle: "volume", // or "surfaces"
  // Quality settings
  qualityFactor: 1.0
});

// Access voxel-specific properties after load
await voxelLayer.load();
console.log("Variables:", voxelLayer.variables);
console.log("Dimensions:", voxelLayer.dimensions);
```

### Voxel Slicing
```javascript
// Add dynamic section (slice)
voxelLayer.enableDynamicSections = true;

// Configure slice plane
const slicePlane = {
  point: { x: 0, y: 0, z: -500 },
  normal: { x: 0, y: 0, z: 1 }
};
```

### Voxel Isosurface
```javascript
// Create isosurface at specific value
const isosurface = {
  value: 25,
  enabled: true,
  color: [255, 0, 0, 0.7]
};
```

## PointCloudLayer (LiDAR Data)

### Basic PointCloudLayer
```javascript
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer.js";

const pcLayer = new PointCloudLayer({
  url: "https://tiles.arcgis.com/tiles/.../SceneServer"
});

map.add(pcLayer);
```

### PointCloud Renderers

```javascript
// RGB (True Color) Renderer
const rgbRenderer = {
  type: "point-cloud-rgb",
  field: "RGB"
};

// Class (Classification) Renderer
const classRenderer = {
  type: "point-cloud-unique-value",
  field: "CLASS_CODE",
  colorUniqueValueInfos: [
    { values: ["2"], label: "Ground", color: [139, 90, 43] },
    { values: ["6"], label: "Building", color: [194, 194, 194] },
    { values: ["5"], label: "High Vegetation", color: [34, 139, 34] }
  ]
};

// Elevation Renderer (Stretch)
const elevationRenderer = {
  type: "point-cloud-stretch",
  field: "ELEVATION",
  fieldTransformType: "none",
  colorModulation: null,
  stops: [
    { value: 0, color: [0, 0, 255] },
    { value: 50, color: [255, 255, 0] },
    { value: 100, color: [255, 0, 0] }
  ]
};

pcLayer.renderer = rgbRenderer;
```

### Smart Mapping for PointCloud
```javascript
import colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";
import typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";

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

// Continuous color renderer
const elevResponse = await colorRendererCreator.createPCContinuousRenderer({
  layer: pcLayer,
  field: "ELEVATION"
});
```

### PointCloud Filters
```javascript
pcLayer.filters = [{
  field: "CLASS_CODE",
  operator: "includes",
  values: [2, 6] // Ground and Building only
}];

// Remove filters
pcLayer.filters = [];
```

## Weather Effects

### Weather Types
```javascript
// Sunny (default)
view.environment.weather = {
  type: "sunny",
  cloudCover: 0.2
};

// Cloudy
view.environment.weather = {
  type: "cloudy",
  cloudCover: 0.6
};

// Rainy
view.environment.weather = {
  type: "rainy",
  cloudCover: 0.8,
  precipitation: 0.5 // 0-1
};

// Foggy
view.environment.weather = {
  type: "foggy",
  fogStrength: 0.5 // 0-1
};

// Snowy
view.environment.weather = {
  type: "snowy",
  cloudCover: 0.8,
  precipitation: 0.5,
  snowCover: "enabled" // or "disabled"
};
```

### Weather Component
```html
<arcgis-scene item-id="...">
  <arcgis-expand slot="top-right" expanded>
    <arcgis-weather></arcgis-weather>
  </arcgis-expand>
</arcgis-scene>
```

### Weather Widget (Core API) - Deprecated

> **DEPRECATED since 4.33:** Use the `arcgis-weather` component shown above instead. For information on widget deprecation, see [Esri's move to web components](https://developers.arcgis.com/javascript/latest/components-transition-plan/).

```javascript
// DEPRECATED - Use arcgis-weather component instead
import Weather from "@arcgis/core/widgets/Weather.js";

const weatherWidget = new Weather({
  view: view
});

view.ui.add(weatherWidget, "top-right");
```

## Daylight & Lighting

### Setting Date/Time
```javascript
// Set lighting date and time
view.environment.lighting = {
  date: new Date("2024-06-21T12:00:00"),
  directShadowsEnabled: true,
  ambientOcclusionEnabled: true
};

// Update time dynamically
function setTime(hours) {
  const date = new Date(view.environment.lighting.date);
  date.setHours(hours);
  view.environment.lighting.date = date;
}
```

### Daylight Component
```html
<arcgis-scene item-id="...">
  <arcgis-expand slot="top-right" expanded>
    <arcgis-daylight hide-timezone play-speed-multiplier="2"></arcgis-daylight>
  </arcgis-expand>
</arcgis-scene>

<script type="module">
  const daylight = document.querySelector("arcgis-daylight");

  // Toggle sun position vs virtual lighting
  daylight.sunlightingDisabled = false; // Use sun position
  daylight.sunlightingDisabled = true;  // Use virtual light
</script>
```

### Daylight Widget (Core API)
```javascript
import Daylight from "@arcgis/core/widgets/Daylight.js";

const daylightWidget = new Daylight({
  view: view,
  playSpeedMultiplier: 2 // Animation speed
});

view.ui.add(daylightWidget, "top-right");
```

### Shadow Analysis
```javascript
// Enable shadows
view.environment.lighting.directShadowsEnabled = true;

// Shadow cast analysis
import ShadowCastAnalysis from "@arcgis/core/analysis/ShadowCastAnalysis.js";

const shadowAnalysis = new ShadowCastAnalysis();
view.analyses.add(shadowAnalysis);
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
      // Optional: scale and rotate
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
      resource: {
        href: "https://example.com/model.glb"
      }
    }]
  }
});

// Start placing model
sketchVM.create("point");

sketchVM.on("create", (event) => {
  if (event.state === "complete") {
    // Model placed, allow editing
    sketchVM.update(event.graphic);
  }
});
```

## IntegratedMeshLayer

```javascript
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer.js";

const meshLayer = new IntegratedMeshLayer({
  url: "https://tiles.arcgis.com/tiles/.../IntegratedMeshServer"
});

map.add(meshLayer);
```

## DimensionLayer (Length Dimensioning)

### Basic DimensionLayer
```javascript
import DimensionLayer from "@arcgis/core/layers/DimensionLayer.js";
import DimensionAnalysis from "@arcgis/core/analysis/DimensionAnalysis.js";
import LengthDimension from "@arcgis/core/analysis/LengthDimension.js";

// Create dimension analysis with style
const dimensionAnalysis = new DimensionAnalysis({
  style: {
    type: "simple",
    textBackgroundColor: [0, 0, 0, 0.6],
    textColor: "white",
    fontSize: 12
  }
});

// Create dimension layer
const dimensionLayer = new DimensionLayer({
  title: "Dimensions",
  source: dimensionAnalysis
});

map.add(dimensionLayer);
```

### Add Length Dimensions
```javascript
// Add a dimension between two points
const dimension = new LengthDimension({
  startPoint: {
    x: -122.4, y: 37.8, z: 0,
    spatialReference: { wkid: 4326 }
  },
  endPoint: {
    x: -122.5, y: 37.8, z: 0,
    spatialReference: { wkid: 4326 }
  },
  orientation: 0,  // Rotation in degrees
  offset: 10       // Distance from line
});

dimensionLayer.source.dimensions.push(dimension);
```

### Interactive Dimension Placement
```javascript
const layerView = await view.whenLayerView(dimensionLayer);

// Start interactive placement
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

## OpenStreetMapLayer (3D Buildings)

```javascript
import OpenStreetMapLayer from "@arcgis/core/layers/OpenStreetMapLayer.js";

// OSM tiles in 3D SceneView
const osmLayer = new OpenStreetMapLayer();

const map = new Map({
  ground: "world-elevation",
  layers: [osmLayer]
});

const view = new SceneView({
  map: map,
  container: "viewDiv"
});
```

## Scene Environment

### Ground Configuration
```javascript
// World elevation
map.ground = "world-elevation";

// Custom elevation layer
import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";

map.ground = {
  layers: [
    new ElevationLayer({
      url: "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    })
  ]
};

// Underground navigation
map.ground.navigationConstraint = "none"; // Allow underground
map.ground.opacity = 0.5; // Semi-transparent ground
```

### Scene Quality
```javascript
view.qualityProfile = "high"; // "low", "medium", "high"

// Custom quality settings
view.environment.atmosphereEnabled = true;
view.environment.starsEnabled = true;
view.environment.lighting.ambientOcclusionEnabled = true;
```

### Background
```javascript
// Solid color background
view.environment.background = {
  type: "color",
  color: [0, 0, 0, 1]
};

// Transparent background (for screenshots)
view.environment.background = {
  type: "color",
  color: [0, 0, 0, 0]
};
```

## Scene Performance

### Memory Management
```javascript
// Monitor memory usage
view.watch("memoryUsage", (memoryUsage) => {
  console.log("Memory:", memoryUsage.total, "bytes");
});

// Reduce quality for performance
view.qualityProfile = "low";
```

### Level of Detail
```javascript
// For SceneLayer
sceneLayer.lodFactor = 1.0; // 0.5 = lower detail, 2.0 = higher detail
```

## Viewing Modes

```javascript
// Global mode (default) - spherical Earth
view.viewingMode = "global";

// Local mode - flat, for local areas
view.viewingMode = "local";
```

```html
<!-- Local mode for indoor/underground -->
<arcgis-scene viewing-mode="local">
</arcgis-scene>
```

## TypeScript Usage

3D symbols and configurations use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety
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
  } as const
});

// Weather configuration
view.environment.weather = {
  type: "rainy",
  cloudCover: 0.8,
  precipitation: 0.5
} as const;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Common Pitfalls

1. **VoxelLayer requires local viewing mode**: Use `viewing-mode="local"` for best results

2. **PointCloud renderer fields**: Common fields are `RGB`, `CLASS_CODE`, `ELEVATION`, `INTENSITY`

3. **Weather only in SceneView**: Weather effects don't work in MapView

4. **glTF model scale**: Models may need scaling to fit the scene properly

5. **Ground navigation constraint**: Set `navigationConstraint: "none"` to allow underground viewing

