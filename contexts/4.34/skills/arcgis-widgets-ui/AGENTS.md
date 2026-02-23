# Agent Guide: arcgis-widgets-ui

Quick-reference decisions, checklists, and tables for widgets and UI layout.

## Component vs Widget Decision

1. **Does a Map Component exist for this widget?**
   - Yes --> Use the component (e.g., `<arcgis-legend>` instead of `new Legend()`)
   - No (e.g., Histogram) --> Use the Core API widget

2. **Is the widget placed inside the map view?**
   - Yes --> Use slot-based positioning: `<arcgis-legend slot="bottom-left">`
   - No, in a side panel --> Use `reference-element` attribute on the component

3. **Do you need to customize widget behavior with `listItemCreatedFunction` or similar callbacks?**
   - Yes --> Core API widget gives more control
   - No --> Component is simpler

**Default:** Always prefer Map Components. Esri is transitioning away from Core API widgets, and some are already deprecated.

## Slot Reference Table

Slots available on `<arcgis-map>`, `<arcgis-scene>`, and `<arcgis-video>`:

| Slot | Position | Typical widgets |
|------|----------|----------------|
| `top-left` | Upper left corner | Zoom, Home, Compass, Locate |
| `top-right` | Upper right corner | Search, LayerList, BasemapGallery, Editor |
| `bottom-left` | Lower left corner | Legend, Attribution |
| `bottom-right` | Lower right corner | ScaleBar, TimeSlider |
| `top-start` | Upper left (LTR) / upper right (RTL) | Directional-aware placement |
| `top-end` | Upper right (LTR) / upper left (RTL) | Directional-aware placement |
| `bottom-start` | Lower left (LTR) / lower right (RTL) | Directional-aware placement |
| `bottom-end` | Lower right (LTR) / lower left (RTL) | Directional-aware placement |
| `popup` | Popup container | `<arcgis-popup>` only |

**Ordering:** Widgets in the same slot stack vertically in DOM order.

## Expand Pattern

Wrap any component in `<arcgis-expand>` for collapsible behavior:

```html
<arcgis-expand slot="top-right" expand-tooltip="Legend">
  <arcgis-legend></arcgis-legend>
</arcgis-expand>
```

Use `expanded` attribute to start open. Use `mode="floating"` for floating panel style.

## Calcite Integration Checklist

- [ ] Load Calcite: `import "@esri/calcite-components/dist/components/calcite-shell"` (and other needed components)
- [ ] Set asset path: `setAssetPath("https://js.arcgis.com/calcite-components/3.3.3/assets")`
- [ ] Add theme class to `<body>`: `calcite-mode-light` or `calcite-mode-dark`
- [ ] Use `<calcite-shell>` as root layout container
- [ ] Use `<calcite-shell-panel slot="panel-start">` for left sidebar
- [ ] Use `<calcite-shell-panel slot="panel-end">` for right sidebar
- [ ] Use `<calcite-navigation slot="header">` for app header
- [ ] Place `<arcgis-map>` directly inside `<calcite-shell>` (main content area)
- [ ] For widgets in panels, add `reference-element="mapId"` to link to the map
- [ ] Custom theme: override `--calcite-color-brand` CSS variable on `:root`

## Common Layout: Shell + Action Bar + Panels

```
calcite-shell
  +-- calcite-navigation [slot="header"]
  +-- calcite-shell-panel [slot="panel-start"]
  |     +-- calcite-action-bar [slot="action-bar"]
  |     +-- calcite-panel (one per action)
  +-- arcgis-map
  |     +-- arcgis-zoom [slot="top-left"]
  +-- calcite-shell-panel [slot="panel-end"]
        +-- calcite-panel
```

## Widget Placement Quick Reference

| Approach | When to use |
|----------|------------|
| Slot on `<arcgis-map>` | Widget is part of the map UI (most common) |
| `reference-element` attribute | Widget is in a Calcite panel outside the map |
| `view.ui.add(widget, position)` | Core API widgets added programmatically |
| `container` property on widget | Core API widget rendered in a specific DOM element |
| CSS absolute positioning | Fully custom positioning outside the ArcGIS UI system |
