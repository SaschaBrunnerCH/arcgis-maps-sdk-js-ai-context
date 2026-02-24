---
name: arcgis-widgets-advanced
description: Add specialized widgets including BuildingExplorer, FloorFilter, Track, Locate, HistogramRangeSlider, ScaleBar, Compass, NavigationToggle, and media viewers. Use for building exploration, indoor mapping, GPS tracking, and data histograms.
---

# ArcGIS Advanced Widgets

Use this skill for specialized and advanced widgets including building exploration, indoor mapping, device GPS tracking, navigation aids, histograms, and media viewing.

> **Related skills:** See `arcgis-widgets-ui` for basic widgets (Legend, LayerList, Search, etc.) and `arcgis-map-tools` for measurement, print, directions, and swipe tools.

## Import Patterns

### Direct ESM Imports
```javascript
import Track from "@arcgis/core/widgets/Track.js";
import Locate from "@arcgis/core/widgets/Locate.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";
import Compass from "@arcgis/core/widgets/Compass.js";
import NavigationToggle from "@arcgis/core/widgets/NavigationToggle.js";
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import BuildingExplorer from "@arcgis/core/widgets/BuildingExplorer.js";
import FloorFilter from "@arcgis/core/widgets/FloorFilter.js";
```

### Dynamic Imports (CDN)
```javascript
const Track = await $arcgis.import("@arcgis/core/widgets/Track.js");
const Locate = await $arcgis.import("@arcgis/core/widgets/Locate.js");
const ScaleBar = await $arcgis.import("@arcgis/core/widgets/ScaleBar.js");
```

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
| — | HistogramRangeSlider | Histogram with range selection (Core API only) |

## BuildingExplorer

Explore and filter BuildingSceneLayer data by disciplines and categories. Works only in 3D SceneView.

### BuildingExplorer Component

```html
<arcgis-scene>
  <arcgis-building-explorer slot="top-right"></arcgis-building-explorer>
</arcgis-scene>

<script type="module">
  import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";

  const sceneElement = document.querySelector("arcgis-scene");
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

Filter floor-aware web maps by facility and floor level. Requires a floor-aware web map.

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
  portalItem: { id: "YOUR_FLOOR_AWARE_WEBMAP_ID" }
});

const view = new MapView({
  container: "viewDiv",
  map: webMap
});

await view.when();

const floorFilter = new FloorFilter({ view: view });
view.ui.add(floorFilter, "top-left");
```

### FloorFilter Events

```javascript
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => floorFilter.level,
  (level) => console.log("Selected level:", level)
);

reactiveUtils.watch(
  () => floorFilter.facility,
  (facility) => console.log("Selected facility:", facility)
);
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

## VideoPlayer

Play video feeds from a VideoLayer service. Requires a VideoLayer.

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

## Track

Track the user's device GPS location in real time. Requires HTTPS and user permission.

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
track.start();
```

### Track Events

```javascript
track.on("track", (event) => {
  const { position } = event;
  console.log("Lat:", position.coords.latitude);
  console.log("Lon:", position.coords.longitude);
  console.log("Accuracy:", position.coords.accuracy);
});

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
      outline: { color: "white", width: 2 }
    }
  })
});

view.ui.add(track, "top-left");
```

## Locate

Zoom to the user's current location. Single-action widget for finding device location.

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
locate.on("locate", (event) => {
  console.log("Located at:", event.position.coords.latitude, event.position.coords.longitude);
});

locate.on("locate-error", (event) => {
  console.error("Location error:", event.error);
});
```

## ScaleBar

Display a scale bar indicator showing map scale.

### ScaleBar Component

```html
<arcgis-map basemap="streets-navigation-vector">
  <arcgis-scale-bar slot="bottom-left"></arcgis-scale-bar>
</arcgis-map>
```

### ScaleBar Widget (Core API)

```javascript
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

const scaleBar = new ScaleBar({
  view: view,
  unit: "dual", // "metric", "imperial", "dual", "non-metric"
  style: "line" // "line" or "ruler"
});

view.ui.add(scaleBar, "bottom-left");
```

## Compass

Display a compass indicator showing the current orientation.

### Compass Component

```html
<arcgis-map basemap="streets-navigation-vector">
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

const compass = new Compass({ view: view });
view.ui.add(compass, "top-left");

// Clicking the compass resets rotation to north
// Programmatically reset:
view.rotation = 0; // 2D
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
  view: view,
  layout: "horizontal" // "horizontal" or "vertical"
});

view.ui.add(navigationToggle, "top-left");
```

## HistogramRangeSlider

Display a histogram with adjustable range slider handles for filtering data. Core API only.

### Basic HistogramRangeSlider

```javascript
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import * as histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

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
  labelFormatFunction: (value) => "$" + Math.round(value).toLocaleString(),
  container: "sliderDiv"
});

// Filter layer when slider values change
slider.on(["thumb-change", "thumb-drag", "segment-drag"], () => {
  const [min, max] = slider.values;
  featureLayer.definitionExpression = `${fieldName} >= ${min} AND ${fieldName} <= ${max}`;
});
```

### HistogramRangeSlider Configuration

```javascript
const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: 0,
  max: 100,
  values: [20, 80],
  rangeType: "between", // "between", "not-between", "at-least", "at-most", "equal", "not-equal"
  excludedBarColor: "#d7d7d7",
  includedBarColor: "#007ac2",
  dataLines: [{ value: 50, label: "Average" }],
  precision: 2,
  container: "sliderDiv"
});
```

## Combining Multiple Widgets

### Complete 3D Building Explorer App

```html
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

  const sceneElement = document.querySelector("arcgis-scene");
  await sceneElement.viewOnReady();

  const buildingLayer = new BuildingSceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__United_States__NewYork__702702_702_Main/SceneServer"
  });

  sceneElement.map.add(buildingLayer);
</script>
```

### Indoor Mapping with Floor Filter

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

- `building-scene-layer-explorer` - Exploring building scene layers
- `widgets-floorfilter` - Indoor floor filtering
- `layers-orientedimagerylayer` - Oriented imagery viewer
- `widgets-track` - GPS tracking widget
- `widgets-locate` - Locate widget
- `widgets-scalebar` - ScaleBar widget configuration
- `histogram-range-slider` - Histogram range slider for filtering

## Common Pitfalls

1. **Track widget requires HTTPS**: Track and Locate use the Geolocation API, which only works on HTTPS origins (or localhost). They fail silently on HTTP.

2. **FloorFilter needs floor-aware web map**: Requires a web map configured with floor-aware data including facility and level information. A standard web map will not display anything.

3. **BuildingExplorer only works with BuildingSceneLayer in SceneView**: Requires both a 3D SceneView (not MapView) and at least one BuildingSceneLayer. It will not work with other layer types or in 2D.

4. **HistogramRangeSlider needs valid bins**: The `bins` property must be an array of objects with `minValue`, `maxValue`, and `count` properties. Use `smartMapping/statistics/histogram` to generate valid bins from layer data.

5. **Missing reference-element on external components**: When placing widget components outside the map/scene element (e.g., in a Calcite panel), set the `reference-element` attribute to the map/scene element ID.

## Related Skills

- See `arcgis-widgets-ui` for basic UI widgets and Calcite integration
- See `arcgis-map-tools` for measurement, print, and routing tools
- See `arcgis-smart-mapping` for smart mapping statistics and histograms
