---
name: arcgis-charts
description: Render interactive charts from ArcGIS layer data using the Charts Components package. Use for bar, line, pie, histogram, scatter, box plot, gauge, radar, and heat charts.
---

# ArcGIS Charts

Use this skill when visualizing layer data as charts (bar, line, pie, histogram, scatter, etc.) using the `@arcgis/charts-components` package. This is a **new component package in 5.0** with no 4.x equivalent.

## Import Patterns

### CDN (No Build Tools)
```html
<!-- Load ArcGIS Maps SDK -->
<script src="https://js.arcgis.com/5.0/"></script>
<!-- Load Charts Components -->
<script type="module" src="https://js.arcgis.com/5.0/charts-components/"></script>
```

### Direct ESM Imports (Build Tools)
```javascript
import "@arcgis/charts-components/components/arcgis-chart";
import "@arcgis/charts-components/components/arcgis-charts-action-bar";
```

### Chart Models (for programmatic configuration)
```javascript
import { BarChartModel } from "@arcgis/charts-components/model";
import { PieChartModel } from "@arcgis/charts-components/model";
import { LineChartModel } from "@arcgis/charts-components/model";
import { HistogramModel } from "@arcgis/charts-components/model";
import { ScatterplotModel } from "@arcgis/charts-components/model";
import { BoxPlotModel } from "@arcgis/charts-components/model";
import { GaugeModel } from "@arcgis/charts-components/model";
import { RadarChartModel } from "@arcgis/charts-components/model";
import { HeatChartModel } from "@arcgis/charts-components/model";
import { ComboBarLineChartModel } from "@arcgis/charts-components/model";
```

## Supported Chart Types

| Chart Type | Model Class | Description |
|------------|-------------|-------------|
| Bar | `BarChartModel` | Horizontal or vertical bar charts |
| Line | `LineChartModel` | Line charts with series |
| Pie | `PieChartModel` | Pie and donut charts |
| Histogram | `HistogramModel` | Frequency distribution histograms |
| Scatter | `ScatterplotModel` | Scatter and bubble plots |
| Box Plot | `BoxPlotModel` | Box and whisker plots |
| Gauge | `GaugeModel` | Gauge / speedometer charts |
| Radar | `RadarChartModel` | Radar / spider charts |
| Heat Chart | `HeatChartModel` | Heat / matrix charts |
| Combo | `ComboBarLineChartModel` | Combined bar and line charts |

## arcgis-chart Component

### Core Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `model` | - | `ChartModel \| WebChart` | - | Chart configuration model (set via JS) |
| `layer` | - | `FeatureLayerView \| SupportedLayer` | - | Data source layer (set via JS) |
| `view` | - | `MapView \| SceneView` | - | Map/scene view reference (set via JS) |
| `layerItemId` | `layer-item-id` | `string` | - | Layer portal item ID (alternative to `layer`) |
| `chartIndex` | `chart-index` | `number` | - | Index of chart to render when a layer has multiple charts |
| `actionMode` | `action-mode` | `string` | - | Interaction mode: `"zoom"`, `"multiSelection"`, `"multiSelectionWithCtrlKey"`, `"pan"` |

### Display Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disableInteractions` | `disable-interactions` | `boolean` | `false` | Disable all chart interactions |
| `enableConfiguration` | `enable-configuration` | `boolean` | `false` | Enable built-in chart configuration UI |
| `enableResponsiveFeatures` | `enable-responsive-features` | `boolean` | - | Enable responsive behavior |
| `useAnimatedCharts` | `use-animated-charts` | `boolean` | - | Enable chart animations |
| `hideEmptySeries` | `hide-empty-series` | `boolean` | - | Hide series with no data |
| `hideLicenseWatermark` | `hide-license-watermark` | `boolean` | - | Hide license watermark |
| `hideLoaderAnimation` | `hide-loader-animation` | `boolean` | - | Hide loading animation |
| `placeholder` | `placeholder` | `string` | - | Placeholder text when no data |
| `showUIMessages` | `show-ui-messages` | `boolean` | - | Show user-facing messages |
| `errorPolicy` | `error-policy` | `string` | `"throw"` | Error handling: `"throw"` or `"ignore"` |

### Data and Filtering Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `filterByExtent` | `filter-by-extent` | `boolean` | - | Filter chart data by current map extent |
| `filterBySelection` | `filter-by-selection` | `boolean` | - | Filter chart data by map selection |
| `syncSelection` | `sync-selection` | `boolean` | `false` | Sync selection between chart and map |
| `runtimeDataFilters` | - | `WebChartDataFilters` | - | Runtime data filters (set via JS) |
| `selectionData` | - | `SelectionData` | - | Current selection data |
| `nullAsValid` | `null-as-valid` | `boolean` | `false` | Treat null values as valid data points |
| `timeZone` | `time-zone` | `string` | - | Time zone for temporal data |

### Formatter Callbacks

| Property | Type | Description |
|----------|------|-------------|
| `dataLabelFormatter` | `function` | Custom formatting for data labels |
| `tooltipFormatter` | `function` | Custom formatting for tooltips |
| `xAxisLabelFormatter` | `function` | Custom formatting for X-axis labels |
| `yAxisLabelFormatter` | `function` | Custom formatting for Y-axis labels |
| `gaugeInnerLabelFormatter` | `function` | Custom formatting for gauge inner labels |
| `guideTooltipFormatter` | `function` | Custom formatting for guide tooltips |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `loadModel()` | `Promise<void>` | Load the chart model |
| `refresh(props?)` | `Promise<void>` | Refresh chart; optional `{ updateData, resetAxesBounds }` |
| `resetZoom()` | `Promise<void>` | Reset zoom to default view |
| `clearSelection()` | `Promise<void>` | Clear all selections |
| `switchSelection()` | `Promise<void>` | Switch selection state |
| `exportAsImage(format?)` | `Promise<void>` | Export chart as `"png"`, `"jpg"`, or `"svg"` |
| `exportAsCSV(options?)` | `Promise<void>` | Export chart data as CSV file |
| `errorAlert(message?)` | `Promise<void>` | Display an error alert |
| `notify(message?, heading?)` | `Promise<void>` | Show a notification |
| `componentOnReady()` | `Promise<this>` | Resolves when the component is fully loaded |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `arcgisSelectionChange` | - | Fired when the chart selection changes |
| `arcgisDataFetchComplete` | `WebChartDataTypes` | Fired when data has been fetched |
| `arcgisDataProcessComplete` | - | Fired when data processing is complete |
| `arcgisUpdateComplete` | `ValidationStatus` | Fired when chart updates are complete |
| `arcgisConfigChange` | `{ newConfig, oldConfig, functionCalled }` | Fired when chart configuration changes |
| `arcgisAxesMinMaxChange` | `AxesMinMaxChangePayload` | Fired when axes min/max are computed |
| `arcgisBadDataWarningRaise` | `DataWarningObject` | Fired when a data error is detected |
| `arcgisChartNotFoundWarning` | `string` | Fired when a referenced chart is not found |

## Basic Usage

### Chart from a FeatureLayer
```html
<arcgis-map id="map" item-id="YOUR_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>
<div id="chart-container" style="width: 500px; height: 400px;">
  <arcgis-chart id="my-chart"></arcgis-chart>
</div>

<script type="module">
  const mapElement = document.querySelector("arcgis-map");
  const chartElement = document.querySelector("#my-chart");

  await mapElement.viewOnReady();
  const view = mapElement.view;

  // Get the layer
  const layer = view.map.layers.find(l => l.title === "My Layer");
  await view.whenLayerView(layer);

  // Assign layer and view to chart
  chartElement.layer = layer;
  chartElement.view = view;

  // Create a bar chart model
  const { BarChartModel } = await $arcgis.import(
    "@arcgis/charts-components/model"
  );

  const model = new BarChartModel();
  model.layer = layer;

  chartElement.model = model;
</script>
```

### Chart with WebChart Spec (JSON Configuration)
```javascript
const chartElement = document.querySelector("arcgis-chart");
chartElement.layer = layer;
chartElement.view = view;

// WebChart JSON specification
chartElement.model = {
  type: "bar",
  title: { visible: true, text: "Population by State" },
  series: [{
    type: "bar",
    query: {
      orderByFields: ["Population DESC"],
      groupByFieldsForStatistics: ["State"],
      outStatistics: [{
        statisticType: "sum",
        onStatisticField: "Population",
        outStatisticFieldName: "TotalPop"
      }]
    },
    x: "State",
    y: "TotalPop"
  }]
};
```

### Pie Chart
```javascript
const { PieChartModel } = await $arcgis.import(
  "@arcgis/charts-components/model"
);

const model = new PieChartModel();
model.layer = layer;

const chartElement = document.querySelector("arcgis-chart");
chartElement.layer = layer;
chartElement.view = view;
chartElement.model = model;
```

### Line Chart
```javascript
const { LineChartModel } = await $arcgis.import(
  "@arcgis/charts-components/model"
);

const model = new LineChartModel();
model.layer = layer;

const chartElement = document.querySelector("arcgis-chart");
chartElement.layer = layer;
chartElement.view = view;
chartElement.model = model;
```

## arcgis-charts-action-bar Component

Provides a toolbar for chart interactions (export, selection, filtering, zoom).

### Setup
```html
<div style="position: relative; width: 600px; height: 400px;">
  <arcgis-chart id="my-chart"></arcgis-chart>
  <arcgis-charts-action-bar id="my-action-bar"></arcgis-charts-action-bar>
</div>

<script type="module">
  const chart = document.querySelector("#my-chart");
  const actionBar = document.querySelector("#my-action-bar");

  // Connect action bar to chart
  actionBar.chartElement = chart;
</script>
```

### Key Action Bar Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `chartElement` | `chart-element` | `ArcgisChart` | - | Reference to the chart component |
| `expanded` | `expanded` | `boolean` | `false` | Whether the action bar is expanded |
| `exportAsImageState` | `export-as-image-state` | `string` | `"enabled"` | Image export button state |
| `exportAsCSVState` | `export-as-csv-state` | `string` | `"enabled"` | CSV export button state |
| `filterByExtentState` | `filter-by-extent-state` | `string` | `"enabled"` | Filter by extent button state |
| `filterBySelectionState` | `filter-by-selection-state` | `string` | `"enabled"` | Filter by selection button state |
| `zoomState` | `zoom-state` | `string` | `"enabled"` | Zoom button state |
| `forceDisableActions` | `force-disable-actions` | `boolean` | `false` | Disable all actions at once |
| `hiddenActions` | - | `DefaultChartActions[]` | - | Array of actions to hide |

Action states can be `"enabled"`, `"disabled"`, or `"hidden"`.

## Selection and Filtering

### Sync Selection Between Chart and Map
```javascript
const chart = document.querySelector("arcgis-chart");
chart.syncSelection = true;
chart.layer = layer;
chart.view = view;

// Listen for selection changes
chart.addEventListener("arcgisSelectionChange", () => {
  console.log("Selection changed:", chart.selectionData);
});
```

### Filter Chart by Map Extent
```javascript
const chart = document.querySelector("arcgis-chart");
chart.filterByExtent = true;
chart.view = view;
chart.layer = layer;
```

### Runtime Data Filters
```javascript
const chart = document.querySelector("arcgis-chart");
chart.runtimeDataFilters = {
  where: "Population > 100000",
  orderByFields: ["Population DESC"]
};
```

## Export

### Export as Image
```javascript
const chart = document.querySelector("arcgis-chart");
await chart.exportAsImage("png"); // "png", "jpg", or "svg"
```

### Export as CSV
```javascript
const chart = document.querySelector("arcgis-chart");
await chart.exportAsCSV();
```

## Custom Formatters

### Data Label Formatter
```javascript
const chart = document.querySelector("arcgis-chart");
chart.dataLabelFormatter = (value, field) => {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }
  return String(value);
};
```

### Tooltip Formatter
```javascript
chart.tooltipFormatter = (tooltipData) => {
  return `<b>${tooltipData.category}</b>: ${tooltipData.value.toLocaleString()}`;
};
```

### Axis Label Formatter
```javascript
chart.xAxisLabelFormatter = (value) => {
  // Truncate long labels
  return String(value).length > 15 ? String(value).slice(0, 12) + "..." : String(value);
};
```

## CDN Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chart from Feature Layer</title>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/charts-components/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; display: flex; }
    arcgis-map { flex: 1; }
    #chart-panel { width: 400px; height: 100%; }
  </style>
</head>
<body>
  <arcgis-map id="map" item-id="YOUR_WEBMAP_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
  <div id="chart-panel">
    <arcgis-chart id="chart"></arcgis-chart>
    <arcgis-charts-action-bar id="action-bar"></arcgis-charts-action-bar>
  </div>

  <script type="module">
    const mapElement = document.querySelector("#map");
    const chartElement = document.querySelector("#chart");
    const actionBar = document.querySelector("#action-bar");

    await mapElement.viewOnReady();
    const view = mapElement.view;
    const layer = view.map.layers.getItemAt(0);
    await view.whenLayerView(layer);

    const { BarChartModel } = await $arcgis.import(
      "@arcgis/charts-components/model"
    );

    const model = new BarChartModel();
    model.layer = layer;

    chartElement.layer = layer;
    chartElement.view = view;
    chartElement.model = model;
    chartElement.syncSelection = true;

    actionBar.chartElement = chartElement;
  </script>
</body>
</html>
```

## Common Pitfalls

1. **Missing `layer` property**: The chart requires a layer data source. Setting only `model` without `layer` produces an empty chart.

   ```javascript
   // Anti-pattern: model without layer
   chartElement.model = new BarChartModel();
   ```

   ```javascript
   // Correct: set both layer and model
   const model = new BarChartModel();
   model.layer = layer;
   chartElement.layer = layer;
   chartElement.model = model;
   ```

   **Impact:** The chart renders its frame and axes but shows no data.

2. **Chart component not loaded**: The charts package must be explicitly loaded via CDN or imported.

   ```html
   <!-- Anti-pattern: missing charts-components script -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <arcgis-chart></arcgis-chart>
   ```

   ```html
   <!-- Correct: include charts-components -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <script type="module" src="https://js.arcgis.com/5.0/charts-components/"></script>
   <arcgis-chart></arcgis-chart>
   ```

   **Impact:** The `arcgis-chart` element is not defined and renders as an empty inline element.

3. **Setting `model` as an HTML attribute**: The `model` property accepts complex objects and must be set via JavaScript, not as an HTML attribute.

   **Impact:** The attribute value is ignored; the chart shows no data.

4. **Using `filterByExtent` without `view`**: Extent filtering requires the `view` property to track the current map extent.

   ```javascript
   // Anti-pattern: filterByExtent without view
   chart.filterByExtent = true;
   chart.layer = layer;
   ```

   ```javascript
   // Correct: set view for extent filtering
   chart.filterByExtent = true;
   chart.layer = layer;
   chart.view = view;
   ```

   **Impact:** The filter has no extent to reference and may throw errors or show all data.

5. **Action bar not connected**: The action bar needs a reference to the chart element.

   ```javascript
   // Anti-pattern: action bar without chart reference
   const actionBar = document.querySelector("arcgis-charts-action-bar");
   // Missing: actionBar.chartElement = chartElement;
   ```

   **Impact:** Action bar buttons are visible but do nothing when clicked.

## Reference Samples

- `arcade-execute-chart` - Execute Arcade expressions and build charts from results
- `featurereduction-cluster-popup-chart` - Charts inside cluster popups
- `featurereduction-cluster-pie-charts` - Pie chart cluster representations
- `visualization-pie-chart` - Pie chart visualization

## Related Skills

- See `arcgis-layers` for configuring FeatureLayers that supply chart data.
- See `arcgis-core-maps` for setting up the MapView referenced by charts.
- See `arcgis-arcade` for Arcade expressions used with chart data computation.
- See `arcgis-widgets-ui` for layout components to host chart panels.
