# Agent Guide: arcgis-coding-components

Quick-reference for configuring the Arcade editor component.

## Editor Configuration Decision

| Scenario | Configuration |
|----------|--------------|
| Full authoring experience | Default (all panels visible) |
| Inline expression input | `hide-side-bar` for minimal UI |
| Popup expression editor | Set `profile` with popup variables |
| Renderer expression editor | Set `profile` with renderer variables |
| Label expression editor | Set `profile` with labeling variables |

## Setup Checklist

- [ ] Load coding-components package (CDN script or ESM import)
- [ ] Create `<arcgis-arcade-editor>` element with explicit width and height
- [ ] Set `script` property with initial expression (or empty string)
- [ ] Set `profile` property to define available variables and context
- [ ] Optionally set `testData` for expression validation
- [ ] Optionally set `snippets` for reusable code templates
- [ ] Listen for `arcgisScriptChange` to capture expression updates
- [ ] Listen for `arcgisDiagnosticsChange` to display errors/warnings

## Common Arcade Profile Variables

| Variable | Type | Available In |
|----------|------|-------------|
| `$feature` | Feature | Popups, Renderers, Labels |
| `$layer` | FeatureSet | Popups, Renderers |
| `$map` | Map | Popups |
| `$datapoint` | Object | Charts, Dashboards |
| `$view` | Object | Dashboards |
