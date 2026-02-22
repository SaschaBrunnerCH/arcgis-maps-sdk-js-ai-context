---
name: arcgis-widgets-advanced
description: Advanced and specialized widgets including BuildingExplorer, FloorFilter, Track, Locate, Histogram, ScaleBar, Compass, NavigationToggle, and media viewers
---

# ArcGIS Advanced Widgets

Use this skill for specialized and advanced widgets including building exploration, indoor mapping, device GPS tracking, navigation aids, histograms, and media viewing.

> **Related skills:** See [arcgis-widgets-ui](../arcgis-widgets-ui/SKILL.md) for basic widgets (Legend, LayerList, Search, Popup, etc.) and [arcgis-map-tools](../arcgis-map-tools/SKILL.md) for measurement, print, directions, and swipe tools.

## Component Overview

| Component | Widget Class | Purpose |
|-----------|-------------|---------|
| `arcgis-building-explorer` | BuildingExplorer | Explore building scene layers |
| `arcgis-floor-filter` | FloorFilter | Filter indoor maps by floor |
| `arcgis-oriented-imagery-viewer` | OrientedImageryViewer | View oriented imagery |
| `arcgis-video-player` | VideoPlayer | Play video service feeds |
| `arcgis-track` | Track | Track device GPS location |
| `arcgis-locate` | Locate | Zoom to user location |
| `arcgis-scale-bar` | ScaleBar | Display map scale bar |
| `arcgis-compass` | Compass | Show north orientation |
| `arcgis-navigation-toggle` | NavigationToggle | Switch between pan and rotate |
| `arcgis-histogram-range-slider` | HistogramRangeSlider | Histogram with range selection |

## BuildingExplorer

Explore and filter BuildingSceneLayer data by disciplines and categories. Works only in 3D SceneView with BuildingSceneLayer.

### BuildingExplorer Component

```html
<arcgis-scene>
  <arcgis-building-explorer slot="top-right"></arcgis-building-explorer>
</arcgis-scene>

<script type="module">
  import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";

  const sceneElement = document.querySelector("arcgis-scene");
  const buildingExplorer = document.querySelector("arcgis-building-explorer");

  await sceneElement.viewOnReady();

  const buildingLayer = new BuildingSceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__United_States__NewYork__702702_702_Main/SceneServer"
  });

  sceneElement.map.add(buildingLayer);
</script>
```

### BuildingExplorer Widget (Core API)

```javascript
import BuildingExplorer from "@arcgis/core/widgets/BuildingExplorer.js";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";

const buildingLayer = new BuildingSceneLayer({
  url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__United_States__NewYork__702702_702_Main/SceneServer"
});

map.add(buildingLayer);

const buildingExplorer = new BuildingExplorer({
  view: view,
  layers: [buildingLayer]
});

view.ui.add(buildingExplorer, "top-right");
```

### BuildingExplorer with External Reference

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start">
    <calcite-panel heading="Building Explorer">
      <arcgis-building-explorer reference-element="sceneView"></arcgis-building-explorer>
    </calcite-panel>
  </calcite-shell-panel>

  <arcgis-scene id="sceneView"></arcgis-scene>
</calcite-shell>
```

## FloorFilter

Filter floor-aware web maps by facility and floor level. Requires a floor-aware web map that contains floor plan data with facility and level information.

### FloorFilter Component

```html
<arcgis-map item-id="YOUR_FLOOR_AWARE_WEBMAP_ID">
  <arcgis-floor-filter slot="top-left"></arcgis-floor-filter>
</arcgis-map>
```

### FloorFilter Widget (Core API)

```javascript
import FloorFilter from "@arcgis/core/widgets/FloorFilter.js";
import WebMap from "@arcgis/core/WebMap.js";

const webMap = new WebMap({
  portalItem: {
    id: "YOUR_FLOOR_AWARE_WEBMAP_ID"
  }
});

const view = new MapView({
  container: "viewDiv",
  map: webMap
});

await view.when();

const floorFilter = new FloorFilter({
  view: view
});

view.ui.add(floorFilter, "top-left");
```

### FloorFilter with External Reference

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start">
    <calcite-panel heading="Floor Filter">
      <arcgis-floor-filter reference-element="mapView"></arcgis-floor-filter>
    </calcite-panel>
  </calcite-shell-panel>

  <arcgis-map id="mapView" item-id="YOUR_FLOOR_AWARE_WEBMAP_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
</calcite-shell>
```

### FloorFilter Events

```javascript
// Watch for floor level changes
floorFilter.watch("level", (level) => {
  console.log("Selected level:", level);
});

// Watch for facility changes
floorFilter.watch("facility", (facility) => {
  console.log("Selected facility:", facility);
});

// Watch for site changes
floorFilter.watch("site", (site) => {
  console.log("Selected site:", site);
});
```

## OrientedImageryViewer

View and navigate oriented imagery captured in the field. Requires an OrientedImageryLayer.

### OrientedImageryViewer Component

```html
<arcgis-map>
  <arcgis-oriented-imagery-viewer slot="top-right"></arcgis-oriented-imagery-viewer>
</arcgis-map>

<script type="module">
  import OrientedImageryLayer from "@arcgis/core/layers/OrientedImageryLayer.js";

  const viewElement = document.querySelector("arcgis-map");
  const viewer = document.querySelector("arcgis-oriented-imagery-viewer");

  await viewElement.viewOnReady();

  const oiLayer = new OrientedImageryLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/OrientedImagery/MapServer/0"
  });

  viewElement.map.add(oiLayer);
  viewer.layer = oiLayer;
</script>
```

### OrientedImageryViewer Widget (Core API)

```javascript
import OrientedImageryViewer from "@arcgis/core/widgets/OrientedImageryViewer.js";
import OrientedImageryLayer from "@arcgis/core/layers/OrientedImageryLayer.js";

const oiLayer = new OrientedImageryLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/OrientedImagery/MapServer/0"
});

map.add(oiLayer);

const viewer = new OrientedImageryViewer({
  view: view,
  layer: oiLayer
});

view.ui.add(viewer, "top-right");
```

### OrientedImageryViewer with External Panel

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-end" width-scale="l">
    <calcite-panel heading="Oriented Imagery">
      <arcgis-oriented-imagery-viewer reference-element="mapView"></arcgis-oriented-imagery-viewer>
    </calcite-panel>
  </calcite-shell-panel>

  <arcgis-map id="mapView" basemap="satellite">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
</calcite-shell>
```

## VideoPlayer

Play video feeds from a VideoLayer service. Requires a VideoLayer with an associated video service.

### VideoPlayer Component

```html
<arcgis-map>
  <arcgis-video-player slot="top-right"></arcgis-video-player>
</arcgis-map>

<script type="module">
  import VideoLayer from "@arcgis/core/layers/VideoLayer.js";

  const viewElement = document.querySelector("arcgis-map");
  const videoPlayer = document.querySelector("arcgis-video-player");

  await viewElement.viewOnReady();

  const videoLayer = new VideoLayer({
    url: "https://your-server.com/arcgis/rest/services/VideoService/MapServer/0"
  });

  viewElement.map.add(videoLayer);
  videoPlayer.layer = videoLayer;
</script>
```

### VideoPlayer Widget (Core API)

```javascript
import VideoPlayer from "@arcgis/core/widgets/VideoPlayer.js";
import VideoLayer from "@arcgis/core/layers/VideoLayer.js";

const videoLayer = new VideoLayer({
  url: "https://your-server.com/arcgis/rest/services/VideoService/MapServer/0"
});

map.add(videoLayer);

const videoPlayer = new VideoPlayer({
  view: view,
  layer: videoLayer
});

view.ui.add(videoPlayer, "top-right");
```

## Track

Track the user's device GPS location in real time. Requires HTTPS and user permission to access device location.

### Track Component

```html
<arcgis-map basemap="streets-navigation-vector" center="-118.24, 34.05" zoom="12">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-track slot="top-left"></arcgis-track>
</arcgis-map>
```

### Track Widget (Core API)

```javascript
import Track from "@arcgis/core/widgets/Track.js";
import Graphic from "@arcgis/core/Graphic.js";

const track = new Track({
  view: view,
  useHeadingEnabled: true,
  goToOverride: (view, options) => {
    options.target.scale = 1500;
    return view.goTo(options.target);
  }
});

view.ui.add(track, "top-left");

// Start tracking programmatically
track.start();
```

### Track Events

```javascript
// Track position updates
track.on("track", (event) => {
  const { position } = event;
  console.log("Latitude:", position.coords.latitude);
  console.log("Longitude:", position.coords.longitude);
  console.log("Accuracy:", position.coords.accuracy);
  console.log("Heading:", position.coords.heading);
  console.log("Speed:", position.coords.speed);
});

// Track errors
track.on("track-error", (event) => {
  console.error("Tracking error:", event.error);
});
```

### Track with Custom Symbol

```javascript
const track = new Track({
  view: view,
  graphic: new Graphic({
    symbol: {
      type: "simple-marker",
      size: 12,
      color: "blue",
      outline: {
        color: "white",
        width: 2
      }
    }
  })
});

view.ui.add(track, "top-left");
```

## Locate

Zoom to the user's current location. A single-action widget that finds the device location and pans the map to it.

### Locate Component

```html
<arcgis-map basemap="streets-navigation-vector" center="-118.24, 34.05" zoom="12">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-locate slot="top-left"></arcgis-locate>
</arcgis-map>
```

### Locate Widget (Core API)

```javascript
import Locate from "@arcgis/core/widgets/Locate.js";

const locate = new Locate({
  view: view,
  useHeadingEnabled: false,
  goToOverride: (view, options) => {
    options.target.scale = 1500;
    return view.goTo(options.target);
  }
});

view.ui.add(locate, "top-left");
```

### Locate Events

```javascript
// Listen for locate event
locate.on("locate", (event) => {
  console.log("Located at:", event.position.coords.latitude, event.position.coords.longitude);
});

// Listen for errors
locate.on("locate-error", (event) => {
  console.error("Location error:", event.error);
});
```

### Locate with Custom Symbol

```javascript
const locate = new Locate({
  view: view,
  graphic: new Graphic({
    symbol: {
      type: "simple-marker",
      size: 14,
      color: "#00bfff",
      outline: {
        color: "white",
        width: 2
      }
    }
  })
});

view.ui.add(locate, "top-left");
```

## ScaleBar

Display a scale bar indicator showing map scale in metric or imperial units.

### ScaleBar Component

```html
<arcgis-map basemap="streets-navigation-vector" center="-118.24, 34.05" zoom="12">
  <arcgis-scale-bar slot="bottom-left"></arcgis-scale-bar>
</arcgis-map>
```

### ScaleBar Widget (Core API)

```javascript
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

const scaleBar = new ScaleBar({
  view: view,
  unit: "dual" // "metric", "imperial", "dual", "non-metric"
});

view.ui.add(scaleBar, "bottom-left");
```

### ScaleBar Styles

```javascript
// Line style (default)
const scaleBar = new ScaleBar({
  view: view,
  unit: "dual",
  style: "line" // "line" or "ruler"
});

// Ruler style
const scaleBarRuler = new ScaleBar({
  view: view,
  unit: "metric",
  style: "ruler"
});
```

## Compass

Display a compass indicator showing the current orientation of the map. Automatically appears when the map is rotated and hides when north is up.

### Compass Component

```html
<arcgis-map basemap="streets-navigation-vector" center="-118.24, 34.05" zoom="12">
  <arcgis-compass slot="top-left"></arcgis-compass>
</arcgis-map>

<!-- Also works with 3D scenes -->
<arcgis-scene>
  <arcgis-compass slot="top-left"></arcgis-compass>
</arcgis-scene>
```

### Compass Widget (Core API)

```javascript
import Compass from "@arcgis/core/widgets/Compass.js";

const compass = new Compass({
  view: view
});

view.ui.add(compass, "top-left");
```

### Compass Behavior

```javascript
// Clicking the compass resets the view rotation to north (0 degrees)
// In 3D, it also resets the camera heading

// Programmatically reset rotation
view.rotation = 0; // 2D
// or
view.goTo({ heading: 0 }); // 3D
```

## NavigationToggle

Switch between pan and rotate navigation modes. Primarily useful in 3D SceneView.

### NavigationToggle Component

```html
<arcgis-scene>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
</arcgis-scene>
```

### NavigationToggle Widget (Core API)

```javascript
import NavigationToggle from "@arcgis/core/widgets/NavigationToggle.js";

const navigationToggle = new NavigationToggle({
  view: view
});

view.ui.add(navigationToggle, "top-left");
```

### NavigationToggle Layout

```javascript
// Horizontal layout (default)
const navigationToggle = new NavigationToggle({
  view: view,
  layout: "horizontal" // "horizontal" or "vertical"
});

// Vertical layout
const navigationToggleVertical = new NavigationToggle({
  view: view,
  layout: "vertical"
});
```

## HistogramRangeSlider

Display a histogram chart with adjustable range slider handles for filtering data. Commonly used with smart mapping to visualize data distribution and filter by value ranges.

### HistogramRangeSlider (Core API)

```javascript
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import * as histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

// Generate histogram bins from a layer field
const histogramResult = await histogram.histogram({
  layer: featureLayer,
  field: "population",
  numBins: 30
});

const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue],
  excludedBarColor: "#d7d7d7",
  rangeType: "between",
  container: "sliderDiv"
});
```

### HistogramRangeSlider with Layer Filtering

```javascript
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import * as histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

const fieldName = "median_income";

const histogramResult = await histogram.histogram({
  layer: featureLayer,
  field: fieldName,
  numBins: 50
});

const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue],
  excludedBarColor: "#d7d7d7",
  rangeType: "between",
  labelFormatFunction: (value) => {
    return "$" + Math.round(value).toLocaleString();
  },
  container: "sliderDiv"
});

// Filter layer when slider values change
slider.on(["thumb-change", "thumb-drag", "segment-drag"], () => {
  const [min, max] = slider.values;
  featureLayer.definitionExpression =
    `${fieldName} >= ${min} AND ${fieldName} <= ${max}`;
});
```

### HistogramRangeSlider with Smart Mapping

```javascript
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import * as histogram from "@arcgis/core/smartMapping/statistics/histogram.js";
import * as colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";

// Create color renderer and histogram together
const colorParams = {
  layer: featureLayer,
  field: "population",
  view: view
};

const [rendererResponse, histogramResult] = await Promise.all([
  colorRendererCreator.createContinuousRenderer(colorParams),
  histogram.histogram({
    layer: featureLayer,
    field: "population",
    numBins: 30
  })
]);

featureLayer.renderer = rendererResponse.renderer;

const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue],
  excludedBarColor: "#d7d7d7",
  rangeType: "between",
  container: "sliderDiv"
});

// Update renderer stops when slider changes
slider.on(["thumb-change", "thumb-drag", "segment-drag"], () => {
  const renderer = featureLayer.renderer.clone();
  const colorVariable = renderer.visualVariables[0];
  colorVariable.stops = [
    { value: slider.values[0], color: colorVariable.stops[0].color },
    { value: slider.values[1], color: colorVariable.stops[colorVariable.stops.length - 1].color }
  ];
  featureLayer.renderer = renderer;
});
```

### HistogramRangeSlider Configuration

```javascript
const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: 0,
  max: 100,
  values: [20, 80],

  // Range type: "between", "not-between", "at-least", "at-most", "equal", "not-equal"
  rangeType: "between",

  // Visual options
  barCreatedFunction: (index, element) => {
    // Customize individual bars
    element.setAttribute("fill", index % 2 === 0 ? "#007ac2" : "#005a8e");
  },
  excludedBarColor: "#d7d7d7",
  includedBarColor: "#007ac2",

  // Data line overlays
  dataLines: [
    { value: 50, label: "Average" }
  ],
  dataLineCreatedFunction: (element, label, index) => {
    element.setAttribute("stroke", "red");
  },

  // Precision for displayed values
  precision: 2,

  container: "sliderDiv"
});
```

## Combining Multiple Advanced Widgets

### Complete 3D Building Explorer App

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
  <calcite-shell>
    <calcite-navigation slot="header">
      <calcite-navigation-logo slot="logo" heading="Building Explorer"></calcite-navigation-logo>
    </calcite-navigation>

    <calcite-shell-panel slot="panel-start">
      <calcite-panel heading="Building">
        <arcgis-building-explorer reference-element="sceneView"></arcgis-building-explorer>
      </calcite-panel>
    </calcite-shell-panel>

    <arcgis-scene id="sceneView">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-compass slot="top-left"></arcgis-compass>
      <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
      <arcgis-scale-bar slot="bottom-left"></arcgis-scale-bar>
    </arcgis-scene>
  </calcite-shell>

  <script type="module">
    import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";
    import Map from "@arcgis/core/Map.js";

    const sceneElement = document.querySelector("arcgis-scene");
    await sceneElement.viewOnReady();

    const buildingLayer = new BuildingSceneLayer({
      url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__United_States__NewYork__702702_702_Main/SceneServer"
    });

    sceneElement.map.add(buildingLayer);
  </script>
</body>
</html>
```

### Indoor Mapping with Floor Filter and Track

```html
<arcgis-map item-id="YOUR_FLOOR_AWARE_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-floor-filter slot="top-left"></arcgis-floor-filter>
  <arcgis-locate slot="top-left"></arcgis-locate>
  <arcgis-track slot="top-left"></arcgis-track>
  <arcgis-scale-bar slot="bottom-left"></arcgis-scale-bar>
</arcgis-map>
```

### Navigation Widgets in 3D Scene

```html
<arcgis-scene basemap="satellite">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-compass slot="top-left"></arcgis-compass>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
  <arcgis-locate slot="top-left"></arcgis-locate>
  <arcgis-scale-bar slot="bottom-left"></arcgis-scale-bar>
</arcgis-scene>
```

## Reference Samples

- `building-explorer` - Exploring building scene layers
- `floor-filter` - Indoor floor filtering
- `oriented-imagery` - Oriented imagery viewer
- `track` - GPS tracking widget
- `widgets-compass` - Compass widget usage
- `widgets-scalebar` - ScaleBar widget configuration
- `histogram-range-slider` - Histogram range slider for filtering

## Common Pitfalls

1. **Track widget requires HTTPS**: The Track and Locate widgets use the Geolocation API, which only works on HTTPS origins (or localhost). They will fail silently on HTTP.

2. **FloorFilter needs floor-aware web map**: The FloorFilter widget requires a web map configured with floor-aware data including facility and level information. A standard web map without floor plan data will not display anything.

3. **BuildingExplorer only works with BuildingSceneLayer in SceneView**: BuildingExplorer requires both a 3D SceneView (not MapView) and at least one BuildingSceneLayer in the map. It will not work with other layer types or in 2D.

4. **HistogramRangeSlider needs properly configured bins array**: The `bins` property must be an array of objects with `minValue`, `maxValue`, and `count` properties. Use the `smartMapping/statistics/histogram` module to generate valid bins from layer data.

5. **Missing reference-element attribute on components**: When placing advanced widget components outside their parent map or scene element (e.g., in a Calcite side panel), you must set the `reference-element` attribute to the ID of the map/scene element. Without it, the widget cannot connect to the view.
