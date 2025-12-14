---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Smart Mapping

Auto-generate renderers based on data, calculate statistics, and create data-driven visualizations.

## Renderer Creators

### Color Renderer (Continuous)
```javascript
import colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";

const { renderer } = await colorRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population",
  theme: "high-to-low"  // high-to-low, above, below, centered-on, extremes
});

featureLayer.renderer = renderer;
```

### Color Renderer (Class Breaks)
```javascript
const { renderer } = await colorRendererCreator.createClassBreaksRenderer({
  layer: featureLayer,
  view: view,
  field: "income",
  classificationMethod: "natural-breaks",  // equal-interval, quantile, standard-deviation
  numClasses: 5
});
```

### Size Renderer
```javascript
import sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";

const { renderer } = await sizeRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude"
});
```

### Type (Unique Values) Renderer
```javascript
import typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";

const { renderer } = await typeRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "landuse",
  numTypes: 10
});
```

### Heatmap Renderer
```javascript
import heatmapRendererCreator from "@arcgis/core/smartMapping/renderers/heatmap.js";

const { renderer } = await heatmapRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude"
});
```

### Dot Density Renderer
```javascript
import dotDensityRendererCreator from "@arcgis/core/smartMapping/renderers/dotDensity.js";

const { renderer } = await dotDensityRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  attributes: [
    { field: "dem_votes", color: "blue", label: "Democrat" },
    { field: "rep_votes", color: "red", label: "Republican" }
  ],
  dotValue: 1000
});
```

### Relationship Renderer
```javascript
import relationshipRendererCreator from "@arcgis/core/smartMapping/renderers/relationship.js";

const { renderer } = await relationshipRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field1: { field: "population" },
  field2: { field: "income" },
  numClasses: 3
});
```

### Pie Chart Renderer
```javascript
import pieChartRendererCreator from "@arcgis/core/smartMapping/renderers/pieChart.js";

const { renderer } = await pieChartRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  attributes: [
    { field: "asian", label: "Asian" },
    { field: "black", label: "Black" },
    { field: "white", label: "White" }
  ]
});
```

## Statistics Functions

### Class Breaks
```javascript
import classBreaksStats from "@arcgis/core/smartMapping/statistics/classBreaks.js";

const result = await classBreaksStats({
  layer: featureLayer,
  field: "population",
  classificationMethod: "natural-breaks",
  numClasses: 5
});
```

### Histogram
```javascript
import histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

const result = await histogram({
  layer: featureLayer,
  field: "income",
  numBins: 20
});

console.log(result.bins);
```

### Summary Statistics
```javascript
import summaryStatistics from "@arcgis/core/smartMapping/statistics/summaryStatistics.js";

const result = await summaryStatistics({
  layer: featureLayer,
  field: "temperature"
});

console.log(result.avg, result.min, result.max, result.stddev);
```

### Unique Values
```javascript
import uniqueValues from "@arcgis/core/smartMapping/statistics/uniqueValues.js";

const result = await uniqueValues({
  layer: featureLayer,
  field: "category"
});
```

## Color Schemes

```javascript
import symbologyColor from "@arcgis/core/smartMapping/symbology/color.js";

const schemes = symbologyColor.getSchemes({
  geometryType: "polygon",
  theme: "high-to-low"
});

const scheme = symbologyColor.getSchemeByName({
  geometryType: "polygon",
  name: "Blue 5",
  theme: "high-to-low"
});
```

## Common Pitfalls

1. **View required** - Most functions need view for scale calculations
2. **Async operations** - Always await results
3. **Layer must be loaded** - Load layer before using smart mapping
4. **Field type match** - Numeric fields for continuous, string for unique values
