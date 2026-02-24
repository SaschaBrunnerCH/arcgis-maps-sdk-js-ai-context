---
name: arcgis-smart-mapping
description: Auto-generate renderers, calculate statistics, and create data-driven visualizations. Use for class breaks, unique values, heatmaps, dot density, relationship maps, and getting histogram/summary statistics.
---

# ArcGIS Smart Mapping

Use this skill to auto-generate renderers based on data, calculate statistics, and create intelligent visualizations.

## Import Patterns

### Direct ESM Imports
```javascript
import * as colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";
import * as sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";
import * as typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";
import summaryStatistics from "@arcgis/core/smartMapping/statistics/summaryStatistics.js";
import histogram from "@arcgis/core/smartMapping/statistics/histogram.js";
```

### CDN Dynamic Imports
```javascript
const colorRendererCreator = await $arcgis.import("@arcgis/core/smartMapping/renderers/color.js");
const summaryStatistics = await $arcgis.import("@arcgis/core/smartMapping/statistics/summaryStatistics.js");
```

> **Note:** Examples below use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Smart Mapping Module Overview

| Module | Import Path | Purpose |
|--------|-------------|---------|
| `renderers/color` | `@arcgis/core/smartMapping/renderers/color.js` | Color-based renderers |
| `renderers/size` | `@arcgis/core/smartMapping/renderers/size.js` | Size-based renderers |
| `renderers/type` | `@arcgis/core/smartMapping/renderers/type.js` | Unique value renderers |
| `renderers/heatmap` | `@arcgis/core/smartMapping/renderers/heatmap.js` | Heatmap renderers |
| `renderers/dotDensity` | `@arcgis/core/smartMapping/renderers/dotDensity.js` | Dot density renderers |
| `renderers/opacity` | `@arcgis/core/smartMapping/renderers/opacity.js` | Opacity renderers |
| `renderers/relationship` | `@arcgis/core/smartMapping/renderers/relationship.js` | Bivariate renderers |
| `renderers/predominance` | `@arcgis/core/smartMapping/renderers/predominance.js` | Predominance renderers |
| `renderers/pieChart` | `@arcgis/core/smartMapping/renderers/pieChart.js` | Pie chart renderers |
| `renderers/univariateColorSize` | `@arcgis/core/smartMapping/renderers/univariateColorSize.js` | Combined color+size |
| `renderers/location` | `@arcgis/core/smartMapping/renderers/location.js` | Simple location renderers |
| `statistics/classBreaks` | `@arcgis/core/smartMapping/statistics/classBreaks.js` | Class break values |
| `statistics/histogram` | `@arcgis/core/smartMapping/statistics/histogram.js` | Histogram bins |
| `statistics/summaryStatistics` | `@arcgis/core/smartMapping/statistics/summaryStatistics.js` | Min/max/avg/stddev |
| `statistics/uniqueValues` | `@arcgis/core/smartMapping/statistics/uniqueValues.js` | Unique field values |
| `statistics/predominantCategories` | `@arcgis/core/smartMapping/statistics/predominantCategories.js` | Dominant categories |
| `statistics/heatmapStatistics` | `@arcgis/core/smartMapping/statistics/heatmapStatistics.js` | Heatmap density stats |
| `statistics/summaryStatisticsForAge` | `@arcgis/core/smartMapping/statistics/summaryStatisticsForAge.js` | Age from date fields |
| `symbology/color` | `@arcgis/core/smartMapping/symbology/color.js` | Color schemes |
| `symbology/support/colorRamps` | `@arcgis/core/smartMapping/symbology/support/colorRamps.js` | Color ramp library |
| `heuristics/sizeRange` | `@arcgis/core/smartMapping/heuristics/sizeRange.js` | Optimal size range |
| `heuristics/scaleRange` | `@arcgis/core/smartMapping/heuristics/scaleRange.js` | Optimal scale range |
| `labels/clusters` | `@arcgis/core/smartMapping/labels/clusters.js` | Cluster labels |
| `labels/bins` | `@arcgis/core/smartMapping/labels/bins.js` | Bin labels |
| `popup/clusters` | `@arcgis/core/smartMapping/popup/clusters.js` | Cluster popups |
| `popup/templates` | `@arcgis/core/smartMapping/popup/templates.js` | Popup templates |

## Renderer Creators

### Color Renderer (Continuous)

Creates a renderer with color gradient based on numeric values.

```javascript
import * as colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";

const { renderer, visualVariable, colorScheme } = await colorRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population",
  theme: "high-to-low" // high-to-low, above, below, centered-on, extremes
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
  classificationMethod: "natural-breaks", // equal-interval, quantile, standard-deviation
  numClasses: 5,
  colorScheme: {
    id: "esri-orange-9"
  }
});

featureLayer.renderer = renderer;
```

### Size Renderer (Continuous)

```javascript
import * as sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";

const { renderer, visualVariable } = await sizeRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude"
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

```javascript
import * as typeRendererCreator from "@arcgis/core/smartMapping/renderers/type.js";

const { renderer, uniqueValueInfos } = await typeRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "landuse",
  numTypes: 10, // Maximum categories before "Other"
  sortBy: "count" // value, count
});

featureLayer.renderer = renderer;
```

### Heatmap Renderer

```javascript
import * as heatmapRendererCreator from "@arcgis/core/smartMapping/renderers/heatmap.js";

const { renderer } = await heatmapRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field: "magnitude", // Optional: weight by field
  radius: 18,
  minDensity: 0,
  maxDensity: 0.05
});

featureLayer.renderer = renderer;
```

### Dot Density Renderer

```javascript
import * as dotDensityRendererCreator from "@arcgis/core/smartMapping/renderers/dotDensity.js";

const { renderer } = await dotDensityRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  attributes: [
    { field: "dem_votes", color: "blue", label: "Democrat" },
    { field: "rep_votes", color: "red", label: "Republican" }
  ],
  dotValue: 1000,
  dotBlendingEnabled: true
});

featureLayer.renderer = renderer;
```

### Relationship Renderer

Shows relationship between two variables in a bivariate map.

```javascript
import * as relationshipRendererCreator from "@arcgis/core/smartMapping/renderers/relationship.js";

const { renderer } = await relationshipRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  field1: { field: "population" },
  field2: { field: "income" },
  numClasses: 3, // 2, 3, or 4
  focus: "HH"    // HH, HL, LH, LL
});
```

### Predominance Renderer

Shows which category has the highest value per feature.

```javascript
import * as predominanceRendererCreator from "@arcgis/core/smartMapping/renderers/predominance.js";

const { renderer } = await predominanceRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  fields: [
    { name: "dem_votes", label: "Democrat" },
    { name: "rep_votes", label: "Republican" },
    { name: "ind_votes", label: "Independent" }
  ],
  includeSizeVariable: true,
  includeOpacityVariable: true
});
```

### Pie Chart Renderer

```javascript
import * as pieChartRendererCreator from "@arcgis/core/smartMapping/renderers/pieChart.js";

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

Combines color and size to emphasize a single variable.

```javascript
import * as univariateRendererCreator from "@arcgis/core/smartMapping/renderers/univariateColorSize.js";

const { renderer } = await univariateRendererCreator.createContinuousRenderer({
  layer: featureLayer,
  view: view,
  field: "population",
  theme: "above-and-below"
});
```

### Location Renderer

Simple location-based visualization (no data-driven styling).

```javascript
import * as locationRendererCreator from "@arcgis/core/smartMapping/renderers/location.js";

const { renderer } = await locationRendererCreator.createRenderer({
  layer: featureLayer,
  view: view,
  color: [0, 112, 255]
});
```

## Statistics Functions

### Summary Statistics

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

### Class Breaks

```javascript
import classBreaks from "@arcgis/core/smartMapping/statistics/classBreaks.js";

const result = await classBreaks({
  layer: featureLayer,
  field: "population",
  classificationMethod: "natural-breaks", // equal-interval, quantile, standard-deviation
  numClasses: 5,
  normalizationField: "area" // Optional
});

console.log(result.classBreakInfos);
// [{ minValue: 0, maxValue: 1000, count: 50 }, ...]
```

### Histogram

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
```

### Unique Values

```javascript
import uniqueValues from "@arcgis/core/smartMapping/statistics/uniqueValues.js";

const result = await uniqueValues({
  layer: featureLayer,
  field: "category"
});

console.log(result.uniqueValueInfos);
// [{ value: "Type A", count: 100 }, ...]
```

### Summary Statistics for Age

```javascript
import summaryStatisticsForAge from "@arcgis/core/smartMapping/statistics/summaryStatisticsForAge.js";

const result = await summaryStatisticsForAge({
  layer: featureLayer,
  field: "construction_date",
  unit: "years" // years, months, days, hours, minutes, seconds
});

console.log(result.avg); // Average age in years
```

### Predominant Categories

```javascript
import predominantCategories from "@arcgis/core/smartMapping/statistics/predominantCategories.js";

const result = await predominantCategories({
  layer: featureLayer,
  fields: ["typeA_count", "typeB_count", "typeC_count"]
});

console.log(result.predominantCategoryInfos);
```

### Heatmap Statistics

```javascript
import heatmapStatistics from "@arcgis/core/smartMapping/statistics/heatmapStatistics.js";

const result = await heatmapStatistics({
  layer: featureLayer,
  view: view,
  field: "magnitude"
});

console.log(result.maxDensity);
console.log(result.minDensity);
```

## Symbology (Color Schemes)

### Get Color Schemes

```javascript
import * as symbologyColor from "@arcgis/core/smartMapping/symbology/color.js";

const schemes = symbologyColor.getSchemes({
  geometryType: "polygon",
  theme: "high-to-low"
});

console.log(schemes.primaryScheme);    // Best match
console.log(schemes.secondarySchemes); // Alternatives
```

### Color Scheme Themes

| Theme | Description |
|-------|-------------|
| `high-to-low` | Sequential (low to high values) |
| `above-and-below` | Diverging (center point) |
| `centered-on` | Centered on specific value |
| `extremes` | Emphasize high and low values |

### Get Color Ramps

```javascript
import * as colorRamps from "@arcgis/core/smartMapping/symbology/support/colorRamps.js";

const allRamps = colorRamps.all();
const byName = colorRamps.byName("Green-Brown");
```

## Heuristics

### Size Range

```javascript
import sizeRange from "@arcgis/core/smartMapping/heuristics/sizeRange.js";

const result = await sizeRange({
  layer: featureLayer,
  view: view,
  field: "population"
});

console.log(result.minSize); // Suggested minimum
console.log(result.maxSize); // Suggested maximum
```

### Scale Range

```javascript
import scaleRange from "@arcgis/core/smartMapping/heuristics/scaleRange.js";

const result = await scaleRange({
  layer: featureLayer,
  view: view
});

console.log(result.minScale);
console.log(result.maxScale);
```

## Cluster & Bin Labels

### Cluster Labels

```javascript
import * as clusterLabels from "@arcgis/core/smartMapping/labels/clusters.js";

const { labelingInfo } = await clusterLabels.getLabelSchemes({
  layer: featureLayer,
  view: view
});
```

### Bin Labels

```javascript
import * as binLabels from "@arcgis/core/smartMapping/labels/bins.js";

const { labelingInfo } = await binLabels.getLabelSchemes({
  layer: featureLayer,
  view: view
});
```

## Raster Smart Mapping

### Class Breaks Raster Renderer

```javascript
import * as rasterClassBreaks from "@arcgis/core/smartMapping/raster/renderers/classBreaks.js";

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
import * as rasterStretch from "@arcgis/core/smartMapping/raster/renderers/stretch.js";

const { renderer } = await rasterStretch.createRenderer({
  layer: imageryLayer,
  view: view,
  stretchType: "standard-deviation", // min-max, standard-deviation, histogram-equalization
  numberOfStandardDeviations: 2
});
```

### RGB Raster Renderer

```javascript
import * as rasterRGB from "@arcgis/core/smartMapping/raster/renderers/rgb.js";

const { renderer } = await rasterRGB.createRenderer({
  layer: imageryLayer,
  view: view,
  bandIds: [4, 3, 2] // NIR, Red, Green (false color)
});
```

### Flow Renderer

```javascript
import * as rasterFlow from "@arcgis/core/smartMapping/raster/renderers/flow.js";

const { renderer } = await rasterFlow.createRenderer({
  layer: imageryLayer,
  view: view
});
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

// 2. Get histogram for slider widget
const histogramResult = await histogram({
  layer: featureLayer,
  field: "population",
  numBins: 50
});

// 3. Apply renderer
featureLayer.renderer = renderer;

// 4. Create histogram range slider
const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue]
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

const sizeResult = await sizeRendererCreator.createVisualVariables({
  layer: featureLayer,
  view: view,
  field: "population"
});

colorResult.renderer.visualVariables.push(sizeResult.visualVariable);
featureLayer.renderer = colorResult.renderer;
```

### Create Visual Variable Only

```javascript
const { visualVariable } = await colorRendererCreator.createVisualVariable({
  layer: featureLayer,
  view: view,
  field: "temperature",
  theme: "high-to-low"
});

// Add to existing renderer
renderer.visualVariables = [visualVariable];
```

## Reference Samples

- `visualization-sm-color` - Smart mapping with color renderers
- `visualization-sm-size` - Smart mapping with size renderers
- `visualization-sm-types` - Smart mapping for unique value types
- `visualization-sm-relationship` - Relationship smart mapping
- `visualization-sm-predominance` - Predominance visualization
- `visualization-sm-dotdensity` - Smart mapping dot density
- `visualization-sm-uni-colorsize` - Univariate color-size
- `visualization-sm-multivariate` - Multi-variable smart mapping
- `visualization-sm-classbreaks` - Smart mapping class breaks
- `visualization-histogram-color` - Histogram-driven color visualization

## Common Pitfalls

1. **View required**: Most smart mapping functions require a `view` parameter for scale-dependent calculations.

   ```javascript
   // Anti-pattern: missing view
   const { renderer } = await colorRendererCreator.createContinuousRenderer({
     layer: featureLayer,
     field: "population"
   });
   ```

   ```javascript
   // Correct: include view
   const { renderer } = await colorRendererCreator.createContinuousRenderer({
     layer: featureLayer,
     view: view,
     field: "population"
   });
   ```

2. **Async operations**: All smart mapping functions return promises. Always `await` results.

3. **Field type mismatch**: Numeric fields for color/size continuous renderers. String/coded-value fields for type/unique value renderers.

4. **Layer must be loaded**: The layer needs to be loaded and have the specified field.
   ```javascript
   await featureLayer.load();
   const { renderer } = await colorRendererCreator.createContinuousRenderer({...});
   ```

5. **Color scheme geometry**: Color schemes are geometry-type specific.
   ```javascript
   const schemes = symbologyColor.getSchemes({
     geometryType: featureLayer.geometryType, // point, polyline, polygon
     theme: "high-to-low"
   });
   ```

## Related Skills

- `arcgis-visualization` - Manual renderer and symbol configuration
- `arcgis-feature-effects` - Visual effects and filters
- `arcgis-layers` - Layer types and configuration
- `arcgis-core-maps` - Map and view setup
