---
name: arcgis-widgets-ui
description: Build map user interfaces with ArcGIS widgets, Map Components, and Calcite Design System. Use for adding legends, layer lists, search, tables, time sliders, and custom UI layouts.
---

# ArcGIS Widgets & UI

Use this skill when building user interfaces with widgets, Map Components, and Calcite.

> **Best Practice:** Prefer Map Components (web components like `arcgis-legend`, `arcgis-search`) over Core API widgets. Esri has transitioned to web components as the primary approach.

## Import Patterns

### Map Components (ESM)
```javascript
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-legend";
import "@arcgis/map-components/dist/components/arcgis-search";
import "@arcgis/map-components/dist/components/arcgis-layer-list";
import "@arcgis/map-components/dist/components/arcgis-expand";
```

### Core API Widgets (ESM)
```javascript
import Legend from "@arcgis/core/widgets/Legend.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Search from "@arcgis/core/widgets/Search.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
```

### Dynamic Imports (CDN)
```javascript
const Legend = await $arcgis.import("@arcgis/core/widgets/Legend.js");
const Search = await $arcgis.import("@arcgis/core/widgets/Search.js");
```

> **Note:** CSS for Map Components loads automatically via npm. Core API widgets require: `@import "@arcgis/core/assets/esri/themes/light/main.css";`

## Map Components Overview

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
| `arcgis-scale-bar` | Display map scale |
| `arcgis-legend` | Layer symbology legend |
| `arcgis-layer-list` | Layer visibility control |
| `arcgis-basemap-gallery` | Switch basemaps |
| `arcgis-basemap-layer-list` | Layer list for basemap layers |
| `arcgis-basemap-toggle` | Toggle two basemaps |
| `arcgis-catalog-layer-list` | Browse CatalogLayer sublayers |
| `arcgis-search` | Location search |
| `arcgis-placement` | Control widget placement |
| `arcgis-popup` | Feature popups |
| `arcgis-editor` | Feature editing |
| `arcgis-feature` | Display feature info without popup |
| `arcgis-feature-form` | Form-based attribute editing |
| `arcgis-features` | Display multiple features info |
| `arcgis-sketch` | Draw geometries |
| `arcgis-feature-table` | Tabular data view |
| `arcgis-time-slider` | Temporal navigation |
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
| `arcgis-elevation-profile` | Elevation profile along a path |
| `arcgis-line-of-sight` | Line of sight analysis (3D) |
| `arcgis-slice` | Slice through 3D data |
| `arcgis-shadow-cast` | Shadow cast analysis (3D) |
| `arcgis-oriented-imagery-viewer` | View oriented imagery |
| `arcgis-video-player` | Play video feeds |
| `arcgis-link-chart` | Link chart visualization |
| `arcgis-utility-network-trace` | Utility network tracing |
| `arcgis-version-management` | Manage geodatabase versions |

## Slot-Based Positioning

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

Widgets in the same slot stack vertically in DOM order.

## Expand Component

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

## Reference Element (External Components)

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

const basemapGallery = new BasemapGallery({ view: view });
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
  const mapEl = document.querySelector("arcgis-map");
  await mapEl.viewOnReady();

  await layer.load();
  timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent;
  timeSlider.stops = { interval: layer.timeInfo.interval };
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
    interval: { value: 1, unit: "hours" }
  },
  playRate: 1000,
  loop: true
});

view.ui.add(timeSlider, "bottom-right");

// Events
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => timeSlider.timeExtent,
  (timeExtent) => {
    console.log("Time changed:", timeExtent.start, timeExtent.end);
  }
);
```

## Core Widget Approach

### Adding Widgets to View

```javascript
import Legend from "@arcgis/core/widgets/Legend.js";

const legend = new Legend({ view: view });

// Add to view UI
view.ui.add(legend, "bottom-left");

// Add multiple widgets
view.ui.add([
  { component: legend, position: "bottom-left" },
  { component: search, position: "top-right" }
]);

// Add at specific index (order in position)
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
  container: "legendDiv"
});
</script>
```

## Calcite Design System Integration

### Basic Layout with Calcite

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://js.arcgis.com/5.0/@arcgis/core/assets/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/map-components/5.0/arcgis-map-components.esm.js"></script>
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

// FeatureTable selection
featureTable.highlightIds.on("change", (event) => {
  console.log(event.added, event.removed);
});
```

## Reference Samples

- `legend` - Legend widget for layer symbology
- `widgets-layerlist` - LayerList widget for layer management
- `widgets-search-multiplesource` - Search widget with multiple sources
- `widgets-featuretable` - FeatureTable widget integration
- `basemap-gallery` - BasemapGallery for switching basemaps
- `widgets-timeslider` - TimeSlider widget for temporal data

## Common Pitfalls

1. **Missing reference-element**: Components placed outside the `<arcgis-map>` tag cannot find the view without an explicit reference.

   ```html
   <!-- Anti-pattern: component outside arcgis-map with no reference -->
   <arcgis-map id="myMap" basemap="topo-vector"></arcgis-map>
   <arcgis-search></arcgis-search> <!-- Cannot find the view -->
   ```

   ```html
   <!-- Correct: use reference-element to link to the map -->
   <arcgis-map id="myMap" basemap="topo-vector"></arcgis-map>
   <arcgis-search reference-element="myMap"></arcgis-search>
   ```

   **Impact:** The component cannot discover the associated view. It either does not render or throws an error.

2. **Slot names are specific**: Use exact slot names (`top-left`, not `topleft`).

3. **Calcite CSS not loading**: Ensure Calcite script is loaded before using Calcite components.

4. **Widget container conflicts**: Do not add the same widget to both a DOM container and `view.ui`.

   ```javascript
   // Anti-pattern: widget in both container and view.ui
   const legend = new Legend({ view: view, container: "legendDiv" });
   view.ui.add(legend, "bottom-right"); // Conflicts
   ```

   ```javascript
   // Correct: pick one placement strategy
   const legend = new Legend({ view: view });
   view.ui.add(legend, "bottom-right");
   ```

   **Impact:** The widget renders twice or the layout breaks.

5. **Dark/light mode mismatch**: Add `calcite-mode-light` or `calcite-mode-dark` class to body.

6. **Core API widgets missing CSS**: When using Core API widgets (not Map Components), you must import `@arcgis/core/assets/esri/themes/light/main.css`. Map Components handle CSS automatically.

## Related Skills

- See `arcgis-widgets-advanced` for specialized widgets (BuildingExplorer, FloorFilter, Track, Locate, etc.)
- See `arcgis-map-tools` for measurement, print, directions, and swipe tools
- See `arcgis-editing` for Editor and Sketch widgets
- See `arcgis-tables-forms` for FeatureTable and FeatureForm details
