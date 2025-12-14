---
name: arcgis-smart-mapping
description: Auto-generate renderers, calculate statistics, and create data-driven visualizations. Use for class breaks, unique values, heatmaps, dot density, relationship maps, and getting histogram/summary statistics.
---

# ArcGIS Smart Mapping

Use this skill to auto-generate renderers based on data, calculate statistics, and create intelligent visualizations.

## Smart Mapping Overview

| Module | Purpose |
|--------|---------|
| `smartMapping/renderers/*` | Generate renderers automatically |
| `smartMapping/statistics/*` | Calculate data statistics |
| `smartMapping/symbology/*` | Get color schemes and symbols |
| `smartMapping/heuristics/*` | Determine optimal visualization settings |
| `smartMapping/raster/*` | Generate raster-specific renderers |

## Renderer Creators

### Color Renderer (Continuous)

Creates a renderer with color gradient based on numeric values.

```javascript
import colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";

const { renderer, visualVariable, colorScheme } = await colorRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population",
  theme: "high-to-low",  // high-to-low, above, below, centered-on, extremes
  colorScheme: {
    id: "esri-blue-5"  // Optional: specify color scheme
  }
});

featureLayer.renderer = renderer;
```

### Color Renderer (Class Breaks)

Creates a renderer with distinct color classes.

```javascript
const { renderer, classBreakInfos } = await colorRendererCreator.createClassBreaksRenderer({
  layer: featureLayer,
  view: view,
  field: "income",
  classificationMethod: "natural-breaks",  // equal-interval, quantile, standard-deviation
  numClasses: 5,
  colorScheme: {
    id: "esri-orange-9"
  }
});

featureLayer.renderer = renderer;
```

### Size Renderer (Continuous)

Varies symbol size based on data values.

```javascript
import sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";

const { renderer, visualVariable } = await sizeRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude",
  sizeScheme: {
    minSize: 4,
    maxSize: 40
  }
});

featureLayer.renderer = renderer;
```

### Size Renderer (Class Breaks)

```javascript
const { renderer } = await sizeRendererCreator.createClassBreaksRenderer({
  layer: featureLayer,
  view: view,
  field: "sales",
  classificationMethod: "quantile",
  numClasses: 4
});
```

### Type (Unique Values) Renderer

Creates a renderer for categorical data.

```javascript
import typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";

const { renderer, uniqueValueInfos } = await typeRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "landuse",
  numTypes: 10,  // Maximum categories before "Other"
  sortBy: "count"  // value, count
});

featureLayer.renderer = renderer;
```

### Heatmap Renderer

Creates a heatmap for point density visualization.

```javascript
import heatmapRendererCreator from "@arcgis/core/smartMapping/renderers/heatmap.js";

const { renderer } = await heatmapRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude",  // Optional: weight by field
  colorScheme: {
    id: "esri-fire"
  },
  radius: 18,
  minDensity: 0,
  maxDensity: 0.05
});

featureLayer.renderer = renderer;
```

### Dot Density Renderer

Shows density using dots within polygons.

```javascript
import dotDensityRendererCreator from "@arcgis/core/smartMapping/renderers/dotDensity.js";

const { renderer } = await dotDensityRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  attributes: [
    { field: "dem_votes", color: "blue", label: "Democrat" },
    { field: "rep_votes", color: "red", label: "Republican" }
  ],
  dotValue: 1000,  // Each dot represents 1000 votes
  dotBlendingEnabled: true
});

featureLayer.renderer = renderer;
```

### Opacity Renderer

Varies opacity based on data values.

```javascript
import opacityRendererCreator from "@arcgis/core/smartMapping/renderers/opacity.js";

const { renderer, visualVariable } = await opacityRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "confidence",
  minOpacity: 0.1,
  maxOpacity: 1
});
```

### Relationship Renderer

Shows relationship between two variables.

```javascript
import relationshipRendererCreator from "@arcgis/core/smartMapping/renderers/relationship.js";

const { renderer } = await relationshipRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field1: {
    field: "population"
  },
  field2: {
    field: "income"
  },
  numClasses: 3,  // 2, 3, or 4
  focus: "HH"  // HH, HL, LH, LL
});
```

### Predominance Renderer

Shows which category has the highest value.

```javascript
import predominanceRendererCreator from "@arcgis/core/smartMapping/renderers/predominance.js";

const { renderer } = await predominanceRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  fields: [
    { name: "dem_votes", label: "Democrat" },
    { name: "rep_votes", label: "Republican" },
    { name: "ind_votes", label: "Independent" }
  ],
  includeSizeVariable: true,  // Size by margin
  includeOpacityVariable: true  // Opacity by strength
});
```

### Pie Chart Renderer

Creates pie charts for each feature.

```javascript
import pieChartRendererCreator from "@arcgis/core/smartMapping/renderers/pieChart.js";

const { renderer } = await pieChartRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  attributes: [
    { field: "asian", label: "Asian" },
    { field: "black", label: "Black" },
    { field: "white", label: "White" },
    { field: "other", label: "Other" }
  ],
  sizeOptimizationEnabled: true
});
```

### Univariate Color-Size Renderer

Combines color and size for a single variable.

```javascript
import univariateRendererCreator from "@arcgis/core/smartMapping/renderers/univariateColorSize.js";

const { renderer } = await univariateRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population",
  theme: "above-and-below"
});
```

### Location Renderer

Simple location-based visualization (no data driven).

```javascript
import locationRendererCreator from "@arcgis/core/smartMapping/renderers/location.js";

const { renderer } = await locationRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  color: [0, 112, 255]
});
```

## Statistics Functions

### Class Breaks

Calculate optimal class break values.

```javascript
import classBreaksStats from "@arcgis/core/smartMapping/statistics/classBreaks.js";

const result = await classBreaksStats({
  layer: featureLayer,
  field: "population",
  classificationMethod: "natural-breaks",  // equal-interval, quantile, standard-deviation
  numClasses: 5,
  normalizationField: "area"  // Optional
});

console.log(result.classBreakInfos);
// [{ minValue: 0, maxValue: 1000, count: 50 }, ...]
```

### Histogram

Get histogram data for a field.

```javascript
import histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

const result = await histogram({
  layer: featureLayer,
  field: "income",
  numBins: 20,
  minValue: 0,
  maxValue: 200000
});

console.log(result.bins);
// [{ minValue: 0, maxValue: 10000, count: 150 }, ...]
console.log(result.source);  // min, max, avg, stddev
```

### Summary Statistics

Get statistical summary for a field.

```javascript
import summaryStatistics from "@arcgis/core/smartMapping/statistics/summaryStatistics.js";

const result = await summaryStatistics({
  layer: featureLayer,
  field: "temperature"
});

console.log(result.avg);      // Mean
console.log(result.count);    // Feature count
console.log(result.max);      // Maximum
console.log(result.min);      // Minimum
console.log(result.stddev);   // Standard deviation
console.log(result.sum);      // Sum
console.log(result.variance); // Variance
```

### Summary Statistics for Age

Calculate age-based statistics from date field.

```javascript
import summaryStatisticsForAge from "@arcgis/core/smartMapping/statistics/summaryStatisticsForAge.js";

const result = await summaryStatisticsForAge({
  layer: featureLayer,
  field: "construction_date",
  unit: "years"  // years, months, days, hours, minutes, seconds
});

console.log(result.avg);  // Average age in years
```

### Unique Values

Get all unique values for a field.

```javascript
import uniqueValues from "@arcgis/core/smartMapping/statistics/uniqueValues.js";

const result = await uniqueValues({
  layer: featureLayer,
  field: "category"
});

console.log(result.uniqueValueInfos);
// [{ value: "Type A", count: 100, symbol: ... }, ...]
```

### Predominant Categories

Find which category is most common.

```javascript
import predominantCategories from "@arcgis/core/smartMapping/statistics/predominantCategories.js";

const result = await predominantCategories({
  layer: featureLayer,
  fields: ["typeA_count", "typeB_count", "typeC_count"]
});

console.log(result.predominantCategoryInfos);
// [{ value: "typeA_count", count: 500 }, ...]
```

### Heatmap Statistics

Get statistics for heatmap configuration.

```javascript
import heatmapStatistics from "@arcgis/core/smartMapping/statistics/heatmapStatistics.js";

const result = await heatmapStatistics({
  layer: featureLayer,
  view: view,
  field: "magnitude"
});

console.log(result.avgDensity);
console.log(result.maxDensity);
console.log(result.minDensity);
```

## Symbology (Color Schemes)

### Get Color Schemes

```javascript
import symbologyColor from "@arcgis/core/smartMapping/symbology/color.js";

// Get schemes for sequential data
const schemes = symbologyColor.getSchemes({
  geometryType: "polygon",
  theme: "high-to-low"
});

console.log(schemes.primaryScheme);    // Best match
console.log(schemes.secondarySchemes); // Alternatives

// Get scheme by name
const scheme = symbologyColor.getSchemeByName({
  geometryType: "polygon",
  name: "Blue 5",
  theme: "high-to-low"
});
```

### Color Scheme Themes

- `high-to-low` - Sequential (low to high values)
- `above-and-below` - Diverging (center point)
- `centered-on` - Centered on specific value
- `extremes` - Emphasize high and low

### Get Color Ramps

```javascript
import colorRamps from "@arcgis/core/smartMapping/symbology/colorRamps.js";

const allRamps = colorRamps.all();
// Returns array of color ramp objects

const byName = colorRamps.byName("Green-Brown");
// Returns specific color ramp
```

## Heuristics

### Size Range

Calculate optimal size range for data.

```javascript
import sizeRange from "@arcgis/core/smartMapping/heuristics/sizeRange.js";

const result = await sizeRange({
  layer: featureLayer,
  view: view,
  field: "population"
});

console.log(result.minSize);  // Suggested minimum symbol size
console.log(result.maxSize);  // Suggested maximum symbol size
```

### Scale Range

Determine appropriate scale range for visualization.

```javascript
import scaleRange from "@arcgis/core/smartMapping/heuristics/scaleRange.js";

const result = await scaleRange({
  layer: featureLayer,
  view: view
});

console.log(result.minScale);
console.log(result.maxScale);
```

## Raster Smart Mapping

### Class Breaks Raster Renderer

```javascript
import rasterClassBreaks from "@arcgis/core/smartMapping/raster/renderers/classBreaks.js";

const { renderer } = await rasterClassBreaks.createRenderer({
  layer: imageryLayer,
  view: view,
  classificationMethod: "natural-breaks",
  numClasses: 5
});

imageryLayer.renderer = renderer;
```

### Stretch Raster Renderer

```javascript
import rasterStretch from "@arcgis/core/smartMapping/raster/renderers/stretch.js";

const { renderer } = await rasterStretch.createRenderer({
  layer: imageryLayer,
  view: view,
  stretchType: "standard-deviation",  // min-max, standard-deviation, histogram-equalization
  numberOfStandardDeviations: 2
});
```

### Colormap Raster Renderer

```javascript
import rasterColormap from "@arcgis/core/smartMapping/raster/renderers/colormap.js";

const { renderer } = await rasterColormap.createRenderer({
  layer: imageryLayer,
  view: view
});
```

### RGB Raster Renderer

```javascript
import rasterRGB from "@arcgis/core/smartMapping/raster/renderers/rgb.js";

const { renderer } = await rasterRGB.createRenderer({
  layer: imageryLayer,
  view: view,
  bandIds: [4, 3, 2]  // NIR, Red, Green (false color)
});
```

### Vector Field Renderer

For wind, current, or flow data.

```javascript
import rasterVectorField from "@arcgis/core/smartMapping/raster/renderers/vectorField.js";

const { renderer } = await rasterVectorField.createRenderer({
  layer: imageryLayer,
  view: view,
  style: "beaufort-wind"  // single-arrow, wind-barb, beaufort-wind, classified-arrow
});
```

### Flow Renderer

Animated flow visualization.

```javascript
import rasterFlow from "@arcgis/core/smartMapping/raster/renderers/flow.js";

const { renderer } = await rasterFlow.createRenderer({
  layer: imageryLayer,
  view: view
});
```

## Visual Variables

### Create Visual Variable

```javascript
import colorVV from "@arcgis/core/smartMapping/renderers/color.js";

const { visualVariable } = await colorVV.createVisualVariable({
  layer: featureLayer,
  view: view,
  field: "temperature",
  theme: "high-to-low"
});

// Add to existing renderer
renderer.visualVariables = [visualVariable];
```

### Update Renderer with Statistics

```javascript
// Get existing renderer's visual variable
const colorVV = renderer.visualVariables.find(vv => vv.type === "color");

// Get new statistics
const stats = await summaryStatistics({
  layer: featureLayer,
  field: colorVV.field
});

// Update stops based on new statistics
colorVV.stops = [
  { value: stats.min, color: [255, 255, 178] },
  { value: stats.avg, color: [253, 141, 60] },
  { value: stats.max, color: [189, 0, 38] }
];
```

## Common Patterns

### Complete Smart Mapping Workflow

```javascript
// 1. Create renderer
const { renderer } = await colorRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population"
});

// 2. Get histogram for legend/slider
const histogramResult = await histogram({
  layer: featureLayer,
  field: "population",
  numBins: 50
});

// 3. Apply renderer
featureLayer.renderer = renderer;

// 4. Create histogram slider widget
const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue]
});
```

### Dynamic Renderer Updates

```javascript
// Listen for extent changes and update renderer
view.watch("extent", async () => {
  const stats = await summaryStatistics({
    layer: featureLayer,
    field: "population",
    view: view  // Limit to current extent
  });

  // Update visual variable stops
  updateRendererStops(featureLayer.renderer, stats);
});
```

### Multi-Variable Visualization

```javascript
// Color by one variable, size by another
const colorResult = await colorRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "income"
});

const sizeResult = await sizeRendererCreator.createVisualVariable({
  layer: featureLayer,
  view: view,
  field: "population"
});

colorResult.renderer.visualVariables.push(sizeResult.visualVariable);
featureLayer.renderer = colorResult.renderer;
```

## Common Pitfalls

1. **View Required**: Most smart mapping functions require a view for scale-dependent calculations
   ```javascript
   // Always pass the view
   const { renderer } = await colorRendererCreator.createContinuousRenderer({
     layer: featureLayer,
     view: view,  // Required!
     field: "population"
   });
   ```

2. **Async Operations**: All smart mapping functions are asynchronous
   ```javascript
   // Always await results
   const { renderer } = await colorRendererCreator.createContinuousRenderer({...});
   ```

3. **Field Type**: Ensure field type matches renderer type
   - Numeric fields for color/size continuous
   - String/coded value fields for type/unique values

4. **Layer Requirements**: Layer must be loaded and have the field
   ```javascript
   await featureLayer.load();
   const { renderer } = await colorRendererCreator.createContinuousRenderer({...});
   ```

5. **Color Scheme Geometry**: Color schemes are geometry-specific
   ```javascript
   const schemes = symbologyColor.getSchemes({
     geometryType: featureLayer.geometryType,  // point, polyline, polygon
     theme: "high-to-low"
   });
   ```

