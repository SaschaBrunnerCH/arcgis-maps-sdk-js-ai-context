---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Widgets & UI

## Map Components (Recommended)

### Available Components

| Component | Purpose |
|-----------|---------|
| `arcgis-zoom` | Zoom buttons |
| `arcgis-compass` | Orientation indicator |
| `arcgis-home` | Return to initial extent |
| `arcgis-locate` | Find user location |
| `arcgis-fullscreen` | Toggle fullscreen |
| `arcgis-scale-bar` | Display scale |
| `arcgis-legend` | Layer symbology |
| `arcgis-layer-list` | Layer visibility |
| `arcgis-basemap-gallery` | Switch basemaps |
| `arcgis-search` | Location search |
| `arcgis-editor` | Feature editing |
| `arcgis-sketch` | Draw geometries |
| `arcgis-feature-table` | Tabular data |
| `arcgis-time-slider` | Temporal navigation |
| `arcgis-print` | Map printing |
| `arcgis-expand` | Collapsible container |

### Slot-Based Positioning

```html
<arcgis-map basemap="streets-vector">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-home slot="top-left"></arcgis-home>
  <arcgis-search slot="top-right"></arcgis-search>
  <arcgis-legend slot="bottom-left"></arcgis-legend>
  <arcgis-scale-bar slot="bottom-right"></arcgis-scale-bar>
  <arcgis-popup slot="popup"></arcgis-popup>
</arcgis-map>
```

Available slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `popup`, `manual`

### Expand Component

```html
<arcgis-expand slot="top-right" expand-tooltip="Show Legend" mode="floating">
  <arcgis-legend></arcgis-legend>
</arcgis-expand>
```

### Reference Element (External Components)

```html
<calcite-shell-panel slot="panel-start">
  <arcgis-legend reference-element="arcgis-map"></arcgis-legend>
</calcite-shell-panel>

<arcgis-map id="arcgis-map" basemap="topo-vector"></arcgis-map>
```

## Core API Widgets

### Adding Widgets

```javascript
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";

const legend = new Legend({ view: view });
view.ui.add(legend, "bottom-left");

// Add multiple widgets
view.ui.add([
  { component: legend, position: "bottom-left" },
  { component: search, position: "top-right" }
]);

// Remove widget
view.ui.remove(legend);
```

### Widget in Custom Container

```javascript
const legend = new Legend({
  view: view,
  container: "legendDiv"
});
```

## Common Widgets

### Legend

```javascript
import Legend from "@arcgis/core/widgets/Legend.js";

const legend = new Legend({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    title: "Custom Title"
  }]
});
```

### LayerList with Actions

```javascript
import LayerList from "@arcgis/core/widgets/LayerList.js";

const layerList = new LayerList({
  view: view,
  listItemCreatedFunction: (event) => {
    event.item.actionsSections = [[{
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
```

### Search with Custom Sources

```javascript
import Search from "@arcgis/core/widgets/Search.js";

const search = new Search({
  view: view,
  sources: [{
    layer: featureLayer,
    searchFields: ["name", "address"],
    displayField: "name",
    placeholder: "Search features"
  }]
});

search.on("select-result", (event) => {
  console.log("Selected:", event.result);
});
```

### FeatureTable

```javascript
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";

const table = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",
  visibleElements: {
    header: true,
    columnMenus: true,
    selectionColumn: true
  }
});

table.on("selection-change", (event) => {
  console.log("Selected:", event.added);
});
```

### TimeSlider

```javascript
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";

const timeSlider = new TimeSlider({
  view: view,
  mode: "time-window",
  fullTimeExtent: layer.timeInfo.fullTimeExtent,
  stops: { interval: { value: 1, unit: "hours" } },
  playRate: 1000,
  loop: true
});

timeSlider.watch("timeExtent", (timeExtent) => {
  console.log("Time:", timeExtent.start, timeExtent.end);
});
```

### Print

```javascript
import Print from "@arcgis/core/widgets/Print.js";

const print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});
```

## Calcite Design System

### Basic Layout

```html
<calcite-shell>
  <calcite-navigation slot="header">
    <calcite-navigation-logo slot="logo" heading="My App"></calcite-navigation-logo>
  </calcite-navigation>

  <calcite-shell-panel slot="panel-start">
    <calcite-panel heading="Layers">
      <arcgis-layer-list reference-element="map"></arcgis-layer-list>
    </calcite-panel>
  </calcite-shell-panel>

  <arcgis-map id="map" basemap="streets-vector">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
</calcite-shell>
```

### Action Bar

```html
<calcite-action-bar slot="action-bar">
  <calcite-action icon="layers" text="Layers"></calcite-action>
  <calcite-action icon="legend" text="Legend"></calcite-action>
  <calcite-action icon="bookmark" text="Bookmarks"></calcite-action>
</calcite-action-bar>
```

### Common Calcite Components

| Component | Purpose |
|-----------|---------|
| `calcite-shell` | App container |
| `calcite-shell-panel` | Side panels |
| `calcite-panel` | Content panel |
| `calcite-navigation` | Header/footer |
| `calcite-action-bar` | Icon button bar |
| `calcite-button` | Standard button |
| `calcite-input` | Text input |
| `calcite-modal` | Modal dialog |
| `calcite-alert` | Alert message |
| `calcite-loader` | Loading indicator |

### Theming

```html
<body class="calcite-mode-light">
<body class="calcite-mode-dark">

<style>
  :root {
    --calcite-color-brand: #007ac2;
  }
</style>
```

## Widget Events

```javascript
search.on("select-result", (event) => console.log(event.result));
layerList.on("trigger-action", (event) => console.log(event.action));
timeSlider.watch("timeExtent", (value) => console.log(value));
featureTable.on("selection-change", (event) => console.log(event.added));
```

## Common Pitfalls

1. **Missing reference-element** - Use when placing components outside the map
2. **Slot names exact** - Use `top-left`, not `topleft`
3. **Calcite CSS** - Ensure Calcite script is loaded first
4. **Dark/light mode** - Add `calcite-mode-light` or `calcite-mode-dark` to body
