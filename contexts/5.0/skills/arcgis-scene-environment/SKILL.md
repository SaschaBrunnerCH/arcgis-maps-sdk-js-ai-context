---
name: arcgis-scene-environment
description: Configure SceneView environment settings including lighting, weather, shadows, atmosphere, backgrounds, and underground navigation. Use for realistic 3D visualizations.
---

# ArcGIS Scene Environment

Use this skill for configuring SceneView environment: lighting, weather, shadows, atmosphere, backgrounds, underground navigation, and elevation settings.

## Import Patterns

### ESM (npm)
```javascript
import Environment from "@arcgis/core/views/3d/environment/Environment.js";
import SunLighting from "@arcgis/core/views/3d/environment/SunLighting.js";
import VirtualLighting from "@arcgis/core/views/3d/environment/VirtualLighting.js";
import SunnyWeather from "@arcgis/core/views/3d/environment/SunnyWeather.js";
import CloudyWeather from "@arcgis/core/views/3d/environment/CloudyWeather.js";
import RainyWeather from "@arcgis/core/views/3d/environment/RainyWeather.js";
import FoggyWeather from "@arcgis/core/views/3d/environment/FoggyWeather.js";
import SnowyWeather from "@arcgis/core/views/3d/environment/SnowyWeather.js";
import ShadowCastAnalysis from "@arcgis/core/analysis/ShadowCastAnalysis.js";
```

### CDN (dynamic import)
```javascript
const SunLighting = await $arcgis.import("@arcgis/core/views/3d/environment/SunLighting.js");
const RainyWeather = await $arcgis.import("@arcgis/core/views/3d/environment/RainyWeather.js");
const ShadowCastAnalysis = await $arcgis.import("@arcgis/core/analysis/ShadowCastAnalysis.js");
```

## Environment Settings

### Basic Environment Configuration

```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  environment: {
    lighting: {
      date: new Date("Sun Mar 15 2019 16:00:00 GMT+0100")
    },
    atmosphereEnabled: true,
    starsEnabled: true
  }
});
```

### Map Component Environment

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>

<script type="module">
  const viewElement = document.querySelector("arcgis-scene");
  await viewElement.viewOnReady();

  viewElement.environment = {
    lighting: {
      date: new Date()
    },
    atmosphereEnabled: true,
    starsEnabled: true
  };
</script>
```

### Environment Properties

| Property | Type | Description |
|----------|------|-------------|
| `lighting` | SunLighting \| VirtualLighting | Lighting configuration |
| `weather` | SunnyWeather \| CloudyWeather \| RainyWeather \| FoggyWeather \| SnowyWeather | Weather effects |
| `weatherAvailable` | boolean (readonly) | Whether weather effects are supported |
| `atmosphereEnabled` | boolean | Show atmospheric haze |
| `starsEnabled` | boolean | Show stars at night |
| `background` | ColorBackground \| null | Scene background color/transparency |

## Lighting

### Sun Lighting

Realistic lighting based on sun position calculated from date, time, and geographic location.

```javascript
view.environment = {
  lighting: {
    date: new Date("2024-06-21T14:00:00"),
    directShadowsEnabled: true
  }
};

// Update sun position dynamically
view.environment.lighting.date = new Date("2024-06-21T18:00:00");
```

### Virtual Lighting

Consistent directional lighting without sun position calculations.

```javascript
view.environment = {
  lighting: {
    type: "virtual"
  }
};
```

## Shadows

### Enable Direct Shadows

```javascript
view.environment = {
  lighting: {
    directShadowsEnabled: true,
    date: new Date("Sun Mar 15 2019 16:00:00 GMT+0100")
  }
};
```

### Toggle Shadows on Symbols

```javascript
const clone = layer.renderer.clone();
clone.symbol.symbolLayers.getItemAt(0).castShadows = true;
layer.renderer = clone;
```

### Shadow Cast Analysis

```javascript
const shadowAnalysis = new ShadowCastAnalysis({
  startTime: new Date("2024-03-21T09:00:00"),
  endTime: new Date("2024-03-21T17:00:00")
});

view.analyses.add(shadowAnalysis);
```

## Weather

### Weather Types

```javascript
// Sunny
view.environment.weather = {
  type: "sunny",
  cloudCover: 0.2
};

// Cloudy
view.environment.weather = {
  type: "cloudy",
  cloudCover: 0.8
};

// Rainy
view.environment.weather = {
  type: "rainy",
  cloudCover: 0.8,
  precipitation: 0.3
};

// Foggy
view.environment.weather = {
  type: "foggy",
  visibility: 1000
};

// Snowy
view.environment.weather = {
  type: "snowy",
  cloudCover: 0.9
};
```

### Weather Properties

| Weather Type | Key Properties |
|-------------|---------------|
| `sunny` | `cloudCover` (0–1), `visibility` (meters) |
| `cloudy` | `cloudCover` (0–1) |
| `rainy` | `cloudCover` (0–1), `precipitation` (0–1) |
| `foggy` | `visibility` (meters) |
| `snowy` | `cloudCover` (0–1) |

## Weather and Daylight Components

### Daylight Component

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-daylight slot="top-right"></arcgis-daylight>
</arcgis-scene>
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `date-or-season` | `"date"` \| `"season"` | Calendar or season selector |
| `play-speed-multiplier` | number | Animation speed multiplier |
| `hide-timezone` | boolean | Hide timezone display |

**Events:**
- `arcgis-daylight-change` — Date/time changed
- `arcgis-season-change` — Season changed

### Weather Component

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-weather slot="top-right"></arcgis-weather>
</arcgis-scene>
```

### Shadow Cast Component

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-shadow-cast slot="top-right"></arcgis-shadow-cast>
</arcgis-scene>
```

## Transparent Background

### Configure Transparent Background

```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  alphaCompositingEnabled: true,
  environment: {
    background: {
      type: "color",
      color: [255, 252, 244, 0]
    },
    starsEnabled: false,
    atmosphereEnabled: false
  }
});
```

### Toggle Background Transparency

```javascript
const backgroundColor = view.environment.background.color.clone();
backgroundColor.a = 0;
view.environment.background.color = backgroundColor;
```

## Underground Navigation

### Enable Underground Navigation (Map Component)

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>

<script type="module">
  const viewElement = document.querySelector("arcgis-scene");
  await viewElement.viewOnReady();

  viewElement.map.ground.navigationConstraint = { type: "none" };
  viewElement.map.ground.opacity = 0.4;
  viewElement.map.ground.surfaceColor = "#fff";
</script>
```

### Underground Navigation (Core API)

```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene
});

view.when(() => {
  view.map.ground.navigationConstraint = { type: "none" };
  view.map.ground.opacity = 0.4;
});

// Navigate underground
view.goTo({
  position: {
    x: -122.4, y: 37.8, z: -500,
    spatialReference: { wkid: 4326 }
  },
  tilt: 80
});
```

## Ground Configuration

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

// Underground navigation + semi-transparent ground
map.ground.navigationConstraint = { type: "none" };
map.ground.opacity = 0.5;
```

## Local Scene Mode

### Create Local Scene

```html
<arcgis-scene basemap="topo-vector" viewing-mode="local">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>
```

### Local Scene with Clipping Area

```javascript
const viewElement = document.querySelector("arcgis-scene");
await viewElement.viewOnReady();

const clippingExtent = {
  xmax: -10834217,
  xmin: -10932882,
  ymax: 4493918,
  ymin: 4432667,
  spatialReference: { wkid: 3857 }
};

viewElement.clippingArea = clippingExtent;
viewElement.extent = clippingExtent;

viewElement.environment = {
  atmosphereEnabled: false,
  starsEnabled: false
};
```

## Elevation Modes

```javascript
layer.elevationInfo = {
  mode: "on-the-ground"          // Draped on ground
  // mode: "relative-to-ground"  // Offset from ground
  // mode: "relative-to-scene"   // Offset from scene
  // mode: "absolute-height"     // Absolute Z values
};

// With offset
layer.elevationInfo = {
  mode: "relative-to-ground",
  offset: 100,
  unit: "meters"
};

// With Arcade expression
layer.elevationInfo = {
  mode: "relative-to-ground",
  featureExpressionInfo: {
    expression: "Geometry($feature).z * 10"
  },
  unit: "meters"
};
```

## Scene Quality

```javascript
view.qualityProfile = "high"; // "low", "medium", "high"
```

## Screenshot Capture

```javascript
// Full view screenshot
const screenshot = await view.takeScreenshot({ format: "png" });

const img = document.createElement("img");
img.src = screenshot.dataUrl;
document.body.appendChild(img);

// Specific area
const screenshot = await view.takeScreenshot({
  area: { x: 100, y: 100, width: 500, height: 400 },
  format: "png"
});

// Download
function downloadImage(filename, dataUrl) {
  const element = document.createElement("a");
  element.href = dataUrl;
  element.download = filename;
  element.click();
}

downloadImage("scene-screenshot.png", screenshot.dataUrl);
```

## View Constraints

```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  constraints: {
    altitude: {
      min: 20000000,
      max: 25000000
    }
  }
});
```

## Common Pitfalls

1. **Alpha compositing**: Must set `alphaCompositingEnabled: true` on SceneView for transparent backgrounds.

2. **Local scenes**: Require clipping area and typically disable atmosphere/stars.

3. **Underground navigation**: Must set `ground.navigationConstraint.type = "none"`.

4. **Shadow performance**: `directShadowsEnabled` can impact rendering performance significantly.

5. **Elevation modes**: `"on-the-ground"` ignores `offset` and `featureExpressionInfo`.

6. **Weather only in SceneView**: Weather effects do not work in MapView.

7. **Screenshot CORS**: External layers may block screenshot capture due to CORS.

## Reference Samples

- `daylight` — Daylight widget for sun position
- `weather` — Weather effects in SceneView
- `scene-shadow` — Shadow casting in 3D
- `analysis-shadow-cast` — Shadow cast analysis
- `scene-underground` — Underground navigation
- `scene-environment` — Environment settings

## Related Skills

- `arcgis-3d-layers` — SceneLayer, PointCloudLayer, VoxelLayer
- `arcgis-custom-rendering` — RenderNode for custom 3D effects
- `arcgis-core-maps` — SceneView setup and initialization
