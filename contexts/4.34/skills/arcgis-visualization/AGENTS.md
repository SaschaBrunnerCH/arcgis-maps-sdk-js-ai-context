# Agent Guide: arcgis-visualization

Quick-reference decisions, checklists, and tables for renderers, symbols, and visual variables.

## Renderer Type Decision Tree

1. **Do all features look the same?**
   - Yes --> `SimpleRenderer`

2. **Do features differ by a categorical field (e.g., type, status)?**
   - Yes --> `UniqueValueRenderer`
   - Need grouped headings in the legend? --> Use `uniqueValueGroups` property

3. **Do features differ by a numeric field (e.g., population, temperature)?**
   - Want discrete ranges (choropleth)? --> `ClassBreaksRenderer`
   - Want continuous variation? --> `SimpleRenderer` + color/size `visualVariables`

4. **Do you want a density heatmap (points only)?**
   - Yes --> `HeatmapRenderer`

5. **Do you want dot density (polygons only)?**
   - Yes --> `DotDensityRenderer`

6. **Do you need military symbology (MIL-STD-2525)?**
   - Yes --> `DictionaryRenderer`

7. **Want the SDK to generate a renderer from data automatically?**
   - Yes --> See `arcgis-smart-mapping` skill

## Symbol Type Table by Geometry

| Geometry | 2D Symbol Types | 3D Symbol Types |
|----------|----------------|-----------------|
| Point | `simple-marker`, `picture-marker`, `text` | `point-3d` (icon, object layers), `web-style` |
| Polyline | `simple-line` | `line-3d` (line, path layers) |
| Polygon | `simple-fill`, `picture-fill` | `polygon-3d` (fill, extrude layers) |
| Mesh (3D) | N/A | `mesh-3d` |

### 2D Marker Styles
`circle`, `square`, `cross`, `x`, `diamond`, `triangle`

### 3D Object Primitives
`cylinder`, `cone`, `cube`, `sphere`, `diamond`

## Visual Variable Reference

| Variable | Controls | Field Type | Example Use |
|----------|----------|------------|-------------|
| `size` | Symbol size | Numeric | Proportional symbols by population |
| `color` | Symbol color | Numeric | Temperature gradient |
| `opacity` | Symbol transparency | Numeric | Confidence/certainty fading |
| `rotation` | Symbol rotation angle | Numeric | Wind direction arrows |

All visual variables use `stops` to map data values to visual properties:

```
stops: [
  { value: <low>,  size/color/opacity: <min> },
  { value: <high>, size/color/opacity: <max> }
]
```

Rotation uses `field` directly (no stops needed) with `rotationType: "geographic"` or `"arithmetic"`.

## Renderer Construction Checklist

- [ ] Set `type` on the renderer (e.g., `"simple"`, `"unique-value"`, `"class-breaks"`)
- [ ] Set `type` on every symbol (e.g., `"simple-marker"`, `"simple-fill"`)
- [ ] For `UniqueValueRenderer`: set `field`, `uniqueValueInfos` (or `uniqueValueGroups`), and `defaultSymbol`
- [ ] For `ClassBreaksRenderer`: set `field`, `classBreakInfos` with `minValue`/`maxValue`, and `defaultSymbol`
- [ ] For visual variables: add `visualVariables` array to any renderer
- [ ] For labels: set `layer.labelingInfo` array and `layer.labelsVisible = true`
- [ ] For TypeScript: use `as const` or `satisfies __esri.*Properties` on autocast objects

## Color Formats

All of these are valid color values:
- Named: `"red"`, `"blue"`, `"transparent"`
- Hex: `"#FF0000"`, `"#f00"`
- RGB array: `[255, 0, 0]`
- RGBA array: `[255, 0, 0, 0.5]` (0.5 = 50% opacity)

## Labeling Quick Reference

| Geometry | Common labelPlacement values |
|----------|------------------------------|
| Point | `above-center`, `below-center`, `center-center`, `above-left`, `above-right` |
| Polyline | `above-along`, `below-along`, `center-along` |
| Polygon | `always-horizontal` |

Label expressions use Arcade syntax (`$feature.fieldName`), not JavaScript.
