---
name: arcgis-scene-effects
description: Configure SceneView environment settings including shadows, lighting, backgrounds, underground navigation, and elevation modes. Use for realistic 3D visualizations.
---

# ArcGIS Scene Effects

Use this skill for configuring SceneView environment, shadows, backgrounds, underground navigation, and elevation settings.

## Environment Settings

### Basic Environment Configuration
```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  environment: {
    lighting: {
      directShadowsEnabled: true,
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
      directShadowsEnabled: true,
      date: new Date()
    },
    atmosphereEnabled: true,
    starsEnabled: true
  };
</script>
```

## Shadows and Lighting

### Enable Direct Shadows
```javascript
view.environment = {
  lighting: {
    directShadowsEnabled: true,
    date: new Date("Sun Mar 15 2019 16:00:00 GMT+0100")
  }
};

// Update time of day dynamically
function updateTimeOfDay(dateString) {
  view.environment.lighting.date = new Date(dateString);
}
```

### Toggle Shadows on Symbols
```javascript
// Clone renderer and toggle castShadows
const clone = layer.renderer.clone();
clone.symbol.symbolLayers.getItemAt(0).castShadows = true;
layer.renderer = clone;
```

### Highlight Shadow Color
```javascript
import HighlightOptions from "@arcgis/core/views/support/HighlightOptions.js";

const highlightOptions = new HighlightOptions({
  name: "default",
  color: "cyan",
  shadowColor: "cyan"
});

view.highlights = [highlightOptions];

// Change shadow color dynamically
highlightOptions.shadowColor = "#ff0000";
```

### Virtual Lighting
```javascript
view.environment = {
  lighting: {
    type: "virtual"  // Consistent lighting without sun position
  }
};
```

## Transparent Background

### Configure Transparent Background
```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  alphaCompositingEnabled: true,  // Required for transparency
  environment: {
    background: {
      type: "color",
      color: [255, 252, 244, 0]  // RGBA with 0 alpha = transparent
    },
    starsEnabled: false,
    atmosphereEnabled: false
  }
});
```

### Toggle Background Transparency
```javascript
// Make background transparent
const backgroundColor = view.environment.background.color.clone();
backgroundColor.a = 0;  // 0 = transparent, 1 = opaque
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

  // Allow navigation below ground
  viewElement.map.ground.navigationConstraint = {
    type: "none"
  };

  // Set ground opacity to see through
  viewElement.map.ground.opacity = 0.4;

  // Optional: set surface color when no basemap
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
  // Allow camera below ground
  view.map.ground.navigationConstraint = {
    type: "none"
  };

  // Make ground semi-transparent
  view.map.ground.opacity = 0.4;
});

// Navigate to underground viewpoint
view.goTo({
  position: {
    x: -122.4,
    y: 37.8,
    z: -500,  // Negative z = underground
    spatialReference: { wkid: 4326 }
  },
  tilt: 80
});
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

// Define clipping extent
const clippingExtent = {
  xmax: -10834217,
  xmin: -10932882,
  ymax: 4493918,
  ymin: 4432667,
  spatialReference: { wkid: 3857 }
};

// Set clipping area
viewElement.clippingArea = clippingExtent;
viewElement.extent = clippingExtent;

// Disable atmosphere for local scenes
viewElement.environment = {
  atmosphereEnabled: false,
  starsEnabled: false
};
```

## Elevation Info

### Elevation Modes
```javascript
// Feature placement relative to ground/scene
layer.elevationInfo = {
  mode: "on-the-ground"          // Features draped on ground
  // mode: "relative-to-ground"  // Features offset from ground
  // mode: "relative-to-scene"   // Features offset from scene
  // mode: "absolute-height"     // Features at absolute Z values
};
```

### Elevation with Offset
```javascript
layer.elevationInfo = {
  mode: "relative-to-ground",
  offset: 100,  // Meters above ground
  unit: "meters"
};
```

### Elevation with Expression
```javascript
layer.elevationInfo = {
  mode: "relative-to-ground",
  featureExpressionInfo: {
    expression: "Geometry($feature).z * 10"  // Exaggerate Z values
  },
  unit: "meters"
};
```

### Dynamic Elevation Configuration
```javascript
function updateElevationInfo(mode, offset, expression, unit) {
  layer.elevationInfo = {
    mode: mode,
    offset: Number(offset),
    featureExpressionInfo: {
      expression: expression || "0"
    },
    unit: unit
  };
}
```

## Screenshot Capture

### Take Screenshot
```javascript
const viewElement = document.querySelector("arcgis-scene");

// Take full view screenshot
const screenshot = await viewElement.takeScreenshot({
  format: "png"
});

// Display screenshot
const img = document.createElement("img");
img.src = screenshot.dataUrl;
document.body.appendChild(img);
```

### Screenshot of Specific Area
```javascript
const screenshot = await viewElement.takeScreenshot({
  area: {
    x: 100,
    y: 100,
    width: 500,
    height: 400
  },
  format: "png"
});
```

### Screenshot with Drag Selection
```javascript
viewElement.addEventListener("arcgisViewDrag", (event) => {
  event.detail.stopPropagation();  // Prevent navigation

  if (event.detail.action === "end") {
    const area = {
      x: Math.min(event.detail.origin.x, event.detail.x),
      y: Math.min(event.detail.origin.y, event.detail.y),
      width: Math.abs(event.detail.x - event.detail.origin.x),
      height: Math.abs(event.detail.y - event.detail.origin.y)
    };

    viewElement.takeScreenshot({ area, format: "png" })
      .then(screenshot => {
        // Use screenshot.dataUrl or screenshot.data
      });
  }
});
```

### Download Screenshot
```javascript
function downloadImage(filename, dataUrl) {
  const element = document.createElement("a");
  element.href = dataUrl;
  element.download = filename;
  element.click();
}

const screenshot = await view.takeScreenshot({ format: "png" });
downloadImage("scene-screenshot.png", screenshot.dataUrl);
```

## Atmosphere and Stars

### Configure Atmosphere
```javascript
view.environment = {
  atmosphereEnabled: true,   // Show atmosphere haze
  starsEnabled: true,        // Show stars at night
  lighting: {
    date: new Date()         // Current sun position
  }
};
```

### Disable for Clean Visualization
```javascript
view.environment = {
  atmosphereEnabled: false,
  starsEnabled: false
};
```

## View Constraints

### Altitude Constraints
```javascript
const view = new SceneView({
  container: "viewDiv",
  map: scene,
  constraints: {
    altitude: {
      min: 20000000,  // Minimum camera altitude
      max: 25000000   // Maximum camera altitude
    }
  }
});
```

## Focus Area

### Create Focus Area
```javascript
import FocusArea from "@arcgis/core/effects/FocusArea.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import Collection from "@arcgis/core/core/Collection.js";

// Define focus area geometry
const focusGeometry = new Polygon({
  spatialReference: { wkid: 102100 },
  rings: [[
    [1288603, 6130075],
    [1288506, 6129722],
    [1288260, 6129821],
    [1288603, 6130075]
  ]]
});

// Create focus area effect
const focusArea = new FocusArea({
  title: "Area of Interest",
  id: "focus-1",
  outline: { color: [255, 128, 128, 0.55] },
  geometries: new Collection([focusGeometry])
});

// Add to view
viewElement.focusAreas.areas.add(focusArea);
viewElement.focusAreas.style = "bright"; // or "dark"
```

### Focus Area Styles
```javascript
// Bright style - highlights focus area
viewElement.focusAreas.style = "bright";

// Dark style - darkens surrounding area
viewElement.focusAreas.style = "dark";
```

### Toggle Focus Area
```javascript
// Disable focus area
focusArea.enabled = false;

// Enable focus area
focusArea.enabled = true;
```

### Update Focus Area Geometry
```javascript
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";

const sketchVM = new SketchViewModel({
  view: view,
  layer: graphicsLayer
});

sketchVM.on("update", (event) => {
  // Update focus area with new geometry
  focusArea.geometries = new Collection([event.graphics[0].geometry]);
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
  <script src="https://js.arcgis.com/4.34/"></script>
  <script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <arcgis-scene item-id="YOUR_WEBSCENE_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-scene>

  <script type="module">
    const viewElement = document.querySelector("arcgis-scene");
    await viewElement.viewOnReady();

    // Configure environment
    viewElement.environment = {
      lighting: {
        directShadowsEnabled: true,
        date: new Date()
      },
      atmosphereEnabled: true,
      starsEnabled: true
    };

    // Enable underground navigation
    viewElement.map.ground.navigationConstraint = { type: "none" };
    viewElement.map.ground.opacity = 0.6;

    // Configure layer elevation
    const layer = viewElement.map.layers.getItemAt(0);
    layer.elevationInfo = {
      mode: "relative-to-ground",
      offset: 50,
      unit: "meters"
    };
  </script>
</body>
</html>
```

## TypeScript Usage

Scene environment configurations use autocasting. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for environment settings
view.environment = {
  lighting: {
    date: new Date("2024-06-21T12:00:00"),
    directShadowsEnabled: true
  },
  weather: {
    type: "sunny",
    cloudCover: 0.3
  } as const,
  background: {
    type: "color",
    color: [0, 0, 0, 1]
  } as const
};
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Common Pitfalls

1. **Alpha compositing**: Must set `alphaCompositingEnabled: true` for transparent backgrounds

2. **Local scenes**: Require clipping area and typically disable atmosphere/stars

3. **Underground navigation**: Must set `ground.navigationConstraint.type = "none"`

4. **Shadow performance**: `directShadowsEnabled` can impact performance

5. **Elevation modes**: "on-the-ground" ignores offset and expression settings

6. **Screenshot CORS**: External layers may block screenshot capture

