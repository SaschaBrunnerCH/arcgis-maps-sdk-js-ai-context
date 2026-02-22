---
name: arcgis-widgets-ui
description: Build map user interfaces with ArcGIS widgets, Map Components, and Calcite Design System. Use for adding legends, layer lists, search, tables, time sliders, and custom UI layouts.
---

# ArcGIS Widgets & UI

Use this skill when building user interfaces with widgets, Map Components, and Calcite.

> **Best Practice:** Prefer Map Components (web components like `arcgis-legend`, `arcgis-search`) over Core API widgets when possible. Esri is transitioning to web components, and some widgets are already deprecated. See [Esri's component transition plan](https://developers.arcgis.com/javascript/latest/components-transition-plan/).

## Map Components Approach

### Available Map Components

| Component | Purpose |
|-----------|---------|
| `arcgis-map` | 2D map container |
| `arcgis-scene` | 3D scene container |
| `arcgis-zoom` | Zoom in/out buttons |
| `arcgis-compass` | Orientation indicator |
| `arcgis-home` | Return to initial extent |
| `arcgis-locate` | Find user location |
| `arcgis-track` | Track user location |
| `arcgis-navigation-toggle` | Pan/rotate mode (3D) |
| `arcgis-floor-filter` | Filter indoor map by floor level |
| `arcgis-fullscreen` | Toggle fullscreen |
| `arcgis-grid-controls` | Grid controls for feature tables |
| `arcgis-scale-bar` | Display map scale |
| `arcgis-scale-range-slider` | Set visible scale range for layers |
| `arcgis-legend` | Layer symbology legend |
| `arcgis-layer-list` | Layer visibility control |
| `arcgis-basemap-gallery` | Switch basemaps |
| `arcgis-basemap-layer-list` | Layer list for basemap layers |
| `arcgis-basemap-toggle` | Toggle two basemaps |
| `arcgis-catalog-layer-list` | Browse and toggle CatalogLayer sublayers |
| `arcgis-search` | Location search |
| `arcgis-placement` | Control widget placement on the view |
| `arcgis-popup` | Feature popups |
| `arcgis-editor` | Feature editing |
| `arcgis-feature` | Display feature information without a popup |
| `arcgis-feature-form` | Form-based attribute editing |
| `arcgis-features` | Display multiple features information |
| `arcgis-sketch` | Draw geometries |
| `arcgis-feature-table` | Tabular data view |
| `arcgis-time-slider` | Temporal navigation |
| `arcgis-time-zone-label` | Display time zone |
| `arcgis-expand` | Collapsible container |
| `arcgis-print` | Map printing |
| `arcgis-table-list` | List and manage feature tables |
| `arcgis-bookmarks` | Navigate to bookmarks |
| `arcgis-directions` | Turn-by-turn routing |
| `arcgis-swipe` | Compare layers |
| `arcgis-coordinate-conversion` | Coordinate formats |
| `arcgis-daylight` | 3D lighting control |
| `arcgis-weather` | 3D weather effects |
| `arcgis-distance-measurement-2d` | 2D distance measurement |
| `arcgis-area-measurement-2d` | 2D area measurement |
| `arcgis-direct-line-measurement-3d` | 3D line measurement |
| `arcgis-area-measurement-3d` | 3D area measurement |
| `arcgis-utility-network-trace` | Utility network tracing |
| `arcgis-utility-network-associations` | Utility associations |

> **Note:** Not all widgets have component equivalents yet. Histogram and some specialized widgets only have Core API versions. FeatureForm has the `arcgis-feature-form` component.

### Slot-Based Positioning

```html
<arcgis-map basemap="streets-vector">
  <!-- Position widgets using slots -->
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-home slot="top-left"></arcgis-home>
  <arcgis-compass slot="top-left"></arcgis-compass>

  <arcgis-search slot="top-right"></arcgis-search>
  <arcgis-layer-list slot="top-right"></arcgis-layer-list>

  <arcgis-legend slot="bottom-left"></arcgis-legend>
  <arcgis-scale-bar slot="bottom-right"></arcgis-scale-bar>

  <!-- Popup must use popup slot -->
  <arcgis-popup slot="popup"></arcgis-popup>
</arcgis-map>
```

Available slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `top-start`, `top-end`, `bottom-start`, `bottom-end`, `popup`

### Expand Component

Wrap widgets in `arcgis-expand` for collapsible behavior:

```html
<arcgis-map basemap="streets-vector">
  <arcgis-expand slot="top-right" expand-tooltip="Show Legend" mode="floating">
    <arcgis-legend></arcgis-legend>
  </arcgis-expand>

  <arcgis-expand slot="top-left" expanded>
    <arcgis-layer-list></arcgis-layer-list>
  </arcgis-expand>
</arcgis-map>
```

### Reference Element (External Components)

Place components outside the map and reference them:

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start">
    <arcgis-legend reference-element="arcgis-map"></arcgis-legend>
  </calcite-shell-panel>

  <arcgis-map id="arcgis-map" basemap="topo-vector">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
</calcite-shell>
```

## Core Widget Approach

### Adding Widgets to View

```javascript
import Legend from "@arcgis/core/widgets/Legend.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Search from "@arcgis/core/widgets/Search.js";

// Create widget
const legend = new Legend({ view: view });

// Add to view UI
view.ui.add(legend, "bottom-left");

// Add multiple widgets
view.ui.add([
  { component: legend, position: "bottom-left" },
  { component: search, position: "top-right" }
]);

// Add to specific index (order in position)
view.ui.add(legend, { position: "bottom-left", index: 0 });

// Remove widget
view.ui.remove(legend);
```

### Widget in Custom Container

```html
<div id="legendDiv"></div>

<script type="module">
import Legend from "@arcgis/core/widgets/Legend.js";

const legend = new Legend({
  view: view,
  container: "legendDiv" // Or document.getElementById("legendDiv")
});
</script>
```

## Common Widgets

### Legend

```html
<!-- Map Component -->
<arcgis-legend slot="bottom-left"></arcgis-legend>
```

```javascript
// Core API
import Legend from "@arcgis/core/widgets/Legend.js";

const legend = new Legend({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    title: "Custom Title"
  }]
});

view.ui.add(legend, "bottom-left");
```

### LayerList

```html
<!-- Map Component -->
<arcgis-layer-list slot="top-right"></arcgis-layer-list>
```

```javascript
// Core API with actions
import LayerList from "@arcgis/core/widgets/LayerList.js";

const layerList = new LayerList({
  view: view,
  listItemCreatedFunction: (event) => {
    const item = event.item;
    item.actionsSections = [[{
      title: "Zoom to layer",
      icon: "zoom-to-object",
      id: "zoom-to"
    }]];
  }
});

layerList.on("trigger-action", (event) => {
  if (event.action.id === "zoom-to") {
    view.goTo(event.item.layer.fullExtent);
  }
});

view.ui.add(layerList, "top-right");
```

### BasemapGallery

```html
<!-- Map Component -->
<arcgis-basemap-gallery slot="top-right"></arcgis-basemap-gallery>
```

```javascript
// Core API
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";

const basemapGallery = new BasemapGallery({
  view: view
});

view.ui.add(basemapGallery, "top-right");
```

### Search

```html
<!-- Map Component -->
<arcgis-search slot="top-right"></arcgis-search>
```

```javascript
// Core API with custom sources
import Search from "@arcgis/core/widgets/Search.js";

const search = new Search({
  view: view,
  sources: [{
    layer: featureLayer,
    searchFields: ["name", "address"],
    displayField: "name",
    exactMatch: false,
    outFields: ["*"],
    name: "My Layer",
    placeholder: "Search features"
  }]
});

view.ui.add(search, "top-right");

// Events
search.on("select-result", (event) => {
  console.log("Selected:", event.result);
});
```

### FeatureTable

```html
<!-- Map Component -->
<arcgis-feature-table reference-element="arcgis-map"></arcgis-feature-table>
```

```javascript
// Core API
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",
  visibleElements: {
    header: true,
    columnMenus: true,
    selectionColumn: true
  },
  tableTemplate: {
    columnTemplates: [
      { fieldName: "name", label: "Name" },
      { fieldName: "population", label: "Population" }
    ]
  }
});

// Watch selection via highlightIds
featureTable.highlightIds.on("change", (event) => {
  console.log("Selected IDs:", featureTable.highlightIds.toArray());
});
```

### TimeSlider

```html
<!-- Map Component -->
<arcgis-time-slider
  slot="bottom-right"
  layout="auto"
  mode="time-window"
  time-visible
  loop>
</arcgis-time-slider>

<script type="module">
  const timeSlider = document.querySelector("arcgis-time-slider");
  await layer.load();

  timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent;
  timeSlider.stops = {
    interval: layer.timeInfo.interval
  };
</script>
```

```javascript
// Core API
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";

const timeSlider = new TimeSlider({
  view: view,
  mode: "time-window", // instant, time-window, cumulative-from-start, cumulative-from-end
  fullTimeExtent: layer.timeInfo.fullTimeExtent,
  stops: {
    interval: {
      value: 1,
      unit: "hours"
    }
  },
  playRate: 1000, // ms between stops
  loop: true
});

view.ui.add(timeSlider, "bottom-right");

// Events
timeSlider.watch("timeExtent", (timeExtent) => {
  console.log("Time changed:", timeExtent.start, timeExtent.end);
});
```

### Print

```html
<!-- Map Component -->
<arcgis-print slot="top-right"></arcgis-print>
```

```javascript
// Core API
import Print from "@arcgis/core/widgets/Print.js";

const print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});

view.ui.add(print, "top-right");
```

## Calcite Design System Integration

### Basic Layout with Calcite

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
<body class="calcite-mode-light">
  <calcite-shell>
    <!-- Header -->
    <calcite-navigation slot="header">
      <calcite-navigation-logo slot="logo" heading="My Map App"></calcite-navigation-logo>
    </calcite-navigation>

    <!-- Side Panel -->
    <calcite-shell-panel slot="panel-start">
      <calcite-panel heading="Layers">
        <arcgis-layer-list reference-element="map"></arcgis-layer-list>
      </calcite-panel>
    </calcite-shell-panel>

    <!-- Map -->
    <arcgis-map id="map" basemap="streets-vector">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
    </arcgis-map>

    <!-- End Panel -->
    <calcite-shell-panel slot="panel-end">
      <calcite-panel heading="Legend">
        <arcgis-legend reference-element="map"></arcgis-legend>
      </calcite-panel>
    </calcite-shell-panel>
  </calcite-shell>
</body>
</html>
```

### Calcite Action Bar

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start">
    <calcite-action-bar slot="action-bar">
      <calcite-action icon="layers" text="Layers" data-panel="layers"></calcite-action>
      <calcite-action icon="legend" text="Legend" data-panel="legend"></calcite-action>
      <calcite-action icon="bookmark" text="Bookmarks" data-panel="bookmarks"></calcite-action>
    </calcite-action-bar>

    <calcite-panel id="layers" heading="Layers">
      <arcgis-layer-list reference-element="map"></arcgis-layer-list>
    </calcite-panel>

    <calcite-panel id="legend" heading="Legend" hidden>
      <arcgis-legend reference-element="map"></arcgis-legend>
    </calcite-panel>
  </calcite-shell-panel>

  <arcgis-map id="map" basemap="topo-vector"></arcgis-map>
</calcite-shell>

<script>
  // Toggle panels on action click
  document.querySelectorAll("calcite-action").forEach(action => {
    action.addEventListener("click", () => {
      const panelId = action.dataset.panel;
      document.querySelectorAll("calcite-panel").forEach(panel => {
        panel.hidden = panel.id !== panelId;
      });
    });
  });
</script>
```

### Common Calcite Components

| Component | Purpose |
|-----------|---------|
| `calcite-shell` | App layout container |
| `calcite-shell-panel` | Side panels |
| `calcite-panel` | Content panel |
| `calcite-navigation` | Header/footer |
| `calcite-action-bar` | Icon button bar |
| `calcite-action` | Icon button |
| `calcite-button` | Standard button |
| `calcite-input` | Text input |
| `calcite-list` | List container |
| `calcite-list-item` | List item |
| `calcite-card` | Card container |
| `calcite-modal` | Modal dialog |
| `calcite-alert` | Alert message |
| `calcite-loader` | Loading indicator |

### Theming

```html
<!-- Light mode -->
<body class="calcite-mode-light">

<!-- Dark mode -->
<body class="calcite-mode-dark">

<!-- Custom theme colors -->
<style>
  :root {
    --calcite-color-brand: #007ac2;
    --calcite-color-brand-hover: #005a8e;
    --calcite-color-text-1: #323232;
  }
</style>
```

## Custom Widget Placement

### Manual Positioning

```javascript
// Add widget at specific position
view.ui.add(widget, {
  position: "manual",
  index: 0
});

// Position with CSS
document.getElementById("myWidget").style.cssText = `
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
`;
```

### DOM Container

```html
<div id="mapDiv" style="position: relative;">
  <div id="customWidget" style="position: absolute; top: 10px; right: 10px; z-index: 1;">
    <!-- Custom content -->
  </div>
</div>
```

## Widget Events

```javascript
// Search select
search.on("select-result", (event) => {
  console.log(event.result);
});

// LayerList trigger action
layerList.on("trigger-action", (event) => {
  console.log(event.action, event.item);
});

// TimeSlider time change
timeSlider.watch("timeExtent", (value) => {
  console.log(value.start, value.end);
});

// FeatureTable selection
featureTable.highlightIds.on("change", (event) => {
  console.log(event.added, event.removed);
});
```

## TypeScript Usage

Widget configurations use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for widget configurations
const layerList = new LayerList({
  view: view,
  listItemCreatedFunction: (event) => {
    const item = event.item;
    item.actionsSections = [[{
      title: "Zoom to layer",
      icon: "zoom-to-object",
      id: "zoom-to"
    }]];
  }
});

// For layer configurations in widgets
const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  tableTemplate: {
    columnTemplates: [
      { fieldName: "name", label: "Name" },
      { fieldName: "population", label: "Population" }
    ]
  }
});
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `legend` - Legend widget for layer symbology
- `widgets-layerlist` - LayerList widget for layer management
- `widgets-search-multiplesource` - Search widget with multiple sources
- `widgets-featuretable` - FeatureTable widget integration
- `basemap-gallery` - BasemapGallery for switching basemaps

## Common Pitfalls

1. **Missing reference-element**: When placing components outside the map, use `reference-element` attribute

2. **Slot names are specific**: Use exact slot names (`top-left`, not `topleft`)

3. **Calcite CSS not loading**: Ensure Calcite script is loaded before using Calcite components

4. **Widget container conflicts**: Don't add the same widget to both a container and view.ui

5. **Dark/light mode mismatch**: Add `calcite-mode-light` or `calcite-mode-dark` class to body

