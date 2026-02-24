# Agent Guide: arcgis-charts

Quick-reference for choosing chart types and configuring chart components.

## Chart Type Selection Guide

| Data Pattern | Recommended Chart | Why |
|-------------|-------------------|-----|
| Categories vs values | **Bar Chart** | Compare discrete categories |
| Trend over time | **Line Chart** | Show continuous change |
| Part of whole | **Pie Chart** | Show proportions (< 7 categories) |
| Value distribution | **Histogram** | Show frequency of value ranges |
| Two numeric variables | **Scatter Plot** | Show correlation or clusters |
| Statistical summary | **Box Plot** | Show median, quartiles, outliers |
| Single KPI value | **Gauge** | Show progress toward a target |
| Multi-axis comparison | **Radar Chart** | Compare multiple variables |
| Matrix / density | **Heat Chart** | Show density in two dimensions |
| Bars + trend line | **Combo Bar-Line** | Combine categorical and trend data |

## Setup Checklist

- [ ] Load charts-components package (CDN script or ESM import)
- [ ] Create `<arcgis-chart>` element
- [ ] Set `layer` property to a FeatureLayer or FeatureLayerView
- [ ] Set `view` property if using extent filtering or selection sync
- [ ] Create and assign a chart model (e.g., `new BarChartModel()`)
- [ ] Set `model.layer` to the same layer
- [ ] Assign model to `chartElement.model`
- [ ] Optionally add `<arcgis-charts-action-bar>` and connect via `chartElement`

## Interaction Modes

| Mode | Attribute Value | Behavior |
|------|----------------|----------|
| Multi-select + Ctrl | `"multiSelectionWithCtrlKey"` | Click selects one, Ctrl+click adds (default) |
| Multi-select | `"multiSelection"` | Every click adds to selection |
| Zoom | `"zoom"` | Drag to zoom into chart area |
| Pan | `"pan"` | Drag to pan the chart |

## Chart-Map Integration Options

| Feature | Property | Description |
|---------|----------|-------------|
| Sync selection | `syncSelection = true` | Selected chart elements highlight on map |
| Filter by extent | `filterByExtent = true` | Chart shows only features in current view |
| Filter by selection | `filterBySelection = true` | Chart shows only selected features |
