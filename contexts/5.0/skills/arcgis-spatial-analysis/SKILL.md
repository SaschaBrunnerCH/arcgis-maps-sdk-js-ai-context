---
name: arcgis-spatial-analysis
description: Perform spatial analysis using analysis objects, REST services for routing/geocoding/geoprocessing, and feature reduction with clustering/binning.
---

# ArcGIS Spatial Analysis

Use this skill for spatial analysis objects (3D analyses), feature queries with statistics, and feature reduction (clustering/binning).

> For geometry operators (buffer, union, intersect, clip, offset, etc.), see `arcgis-geometry-operations`.
> For routing, geocoding, and geoprocessing REST services, see `arcgis-rest-services`.

## Import Patterns

### Direct ESM Imports
```javascript
import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis.js";
import Viewshed from "@arcgis/core/analysis/Viewshed.js";
import LineOfSightAnalysis from "@arcgis/core/analysis/LineOfSightAnalysis.js";
import ElevationProfileAnalysis from "@arcgis/core/analysis/ElevationProfileAnalysis.js";
import SliceAnalysis from "@arcgis/core/analysis/SliceAnalysis.js";
import ShadowCastAnalysis from "@arcgis/core/analysis/ShadowCastAnalysis.js";
```

### Dynamic Imports (CDN)
```javascript
const [ViewshedAnalysis, Viewshed] = await $arcgis.import([
  "@arcgis/core/analysis/ViewshedAnalysis.js",
  "@arcgis/core/analysis/Viewshed.js"
]);
```

## Analysis Objects (3D)

Analysis objects are added to a SceneView's `analyses` collection. All analysis types require SceneView (not MapView).

### ElevationProfileAnalysis

```javascript
import ElevationProfileAnalysis from "@arcgis/core/analysis/ElevationProfileAnalysis.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

const analysis = new ElevationProfileAnalysis({
  profiles: [
    { type: "ground", color: "brown" },
    { type: "input", color: "blue" }
  ],
  displayUnits: {
    distance: "meters",
    elevation: "meters"
  }
});

view.analyses.add(analysis);
analysis.geometry = polyline;

// Get analysis view for results
const analysisView = await view.whenAnalysisView(analysis);

reactiveUtils.watch(
  () => analysisView.progress,
  (progress) => {
    if (progress === 1) {
      console.log("Results:", analysisView.results);
    }
  }
);
```

### Interactive Analysis Placement

Analysis views support interactive placement via the `place()` method:

```javascript
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

const analysisView = await view.whenAnalysisView(analysis);
const abortController = new AbortController();

try {
  await analysisView.place({ signal: abortController.signal });
} catch (error) {
  if (!promiseUtils.isAbortError(error)) throw error;
}

// To cancel placement
abortController.abort();
```

### ViewshedAnalysis

Uses a `viewsheds` collection of `Viewshed` objects (not direct observer property).

```javascript
import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis.js";
import Viewshed from "@arcgis/core/analysis/Viewshed.js";

const viewshed = new Viewshed({
  observer: {
    type: "point",
    x: -122.4, y: 37.8, z: 100,
    spatialReference: { wkid: 4326 }
  },
  farDistance: 1000,
  heading: 45,
  tilt: 90,
  horizontalFieldOfView: 120,
  verticalFieldOfView: 90
});

const analysis = new ViewshedAnalysis({
  viewsheds: [viewshed]
});

view.analyses.add(analysis);

// Add more viewsheds dynamically
analysis.viewsheds.add(new Viewshed({
  observer: { type: "point", x: -122.41, y: 37.79, z: 80, spatialReference: { wkid: 4326 } },
  farDistance: 500,
  heading: 0,
  tilt: 90,
  horizontalFieldOfView: 360,
  verticalFieldOfView: 90
}));

// Clear all viewsheds
analysis.clear();
```

### LineOfSightAnalysis

Uses `LineOfSightAnalysisObserver` and `LineOfSightAnalysisTarget` wrapper objects.

```javascript
import LineOfSightAnalysis from "@arcgis/core/analysis/LineOfSightAnalysis.js";
import LineOfSightAnalysisObserver from "@arcgis/core/analysis/LineOfSightAnalysisObserver.js";
import LineOfSightAnalysisTarget from "@arcgis/core/analysis/LineOfSightAnalysisTarget.js";

const analysis = new LineOfSightAnalysis({
  observer: new LineOfSightAnalysisObserver({
    position: {
      type: "point",
      x: -122.4, y: 37.8, z: 100,
      spatialReference: { wkid: 4326 }
    }
  }),
  targets: [
    new LineOfSightAnalysisTarget({
      position: { type: "point", x: -122.41, y: 37.81, z: 50, spatialReference: { wkid: 4326 } }
    }),
    new LineOfSightAnalysisTarget({
      position: { type: "point", x: -122.42, y: 37.79, z: 75, spatialReference: { wkid: 4326 } }
    })
  ]
});

view.analyses.add(analysis);
```

### ShadowCastAnalysis

Uses `date`, `startTimeOfDay`, `endTimeOfDay`, and `mode` properties.

```javascript
import ShadowCastAnalysis from "@arcgis/core/analysis/ShadowCastAnalysis.js";

const analysis = new ShadowCastAnalysis({
  date: new Date("2025-06-21"),
  startTimeOfDay: 21600000,  // 6:00 AM (milliseconds from midnight)
  endTimeOfDay: 57600000,    // 4:00 PM
  mode: "total-duration",    // "total-duration", "discrete", "min-duration"
  utcOffset: -7              // UTC offset in hours
});

view.analyses.add(analysis);
```

### SliceAnalysis

Uses a `shape` property of type `SlicePlane` (not `plane`).

```javascript
import SliceAnalysis from "@arcgis/core/analysis/SliceAnalysis.js";
import SlicePlane from "@arcgis/core/analysis/SlicePlane.js";

const analysis = new SliceAnalysis({
  shape: new SlicePlane({
    position: { type: "point", x: -122.4, y: 37.8, z: 50, spatialReference: { wkid: 4326 } },
    heading: 0,
    tilt: 0,
    width: 200,
    height: 200
  }),
  tiltEnabled: false,
  excludeGroundSurface: false
});

view.analyses.add(analysis);
```

### AreaMeasurementAnalysis

```javascript
import AreaMeasurementAnalysis from "@arcgis/core/analysis/AreaMeasurementAnalysis.js";

const analysis = new AreaMeasurementAnalysis();
view.analyses.add(analysis);

// Set geometry after user draws or programmatically
analysis.geometry = polygon;

// Watch for results
const analysisView = await view.whenAnalysisView(analysis);
reactiveUtils.watch(
  () => analysisView.result,
  (result) => {
    if (result) {
      console.log("Area:", result.area?.value, result.area?.unit);
      console.log("Perimeter:", result.perimeterLength?.value, result.perimeterLength?.unit);
    }
  },
  { initial: true }
);
```

### DistanceMeasurementAnalysis

Uses a `geometry` property (Polyline), not startPoint/endPoint.

```javascript
import DistanceMeasurementAnalysis from "@arcgis/core/analysis/DistanceMeasurementAnalysis.js";

const analysis = new DistanceMeasurementAnalysis({
  geometry: {
    type: "polyline",
    paths: [[
      [-122.4, 37.8, 0],
      [-122.41, 37.81, 0]
    ]],
    spatialReference: { wkid: 4326 }
  }
});

view.analyses.add(analysis);
```

### VolumeMeasurementAnalysis

```javascript
import VolumeMeasurementAnalysis from "@arcgis/core/analysis/VolumeMeasurementAnalysis.js";

const analysis = new VolumeMeasurementAnalysis();
view.analyses.add(analysis);

analysis.geometry = polygon;

// Watch for results
const analysisView = await view.whenAnalysisView(analysis);
reactiveUtils.watch(
  () => analysisView.result,
  (result) => {
    if (result) {
      console.log("Cut volume:", result.cutVolume?.value, result.cutVolume?.unit);
      console.log("Fill volume:", result.fillVolume?.value, result.fillVolume?.unit);
    }
  },
  { initial: true }
);
```

### DimensionAnalysis

```javascript
import DimensionAnalysis from "@arcgis/core/analysis/DimensionAnalysis.js";
import LengthDimension from "@arcgis/core/analysis/LengthDimension.js";

const dimension = new LengthDimension({
  startPoint: { type: "point", x: -122.4, y: 37.8, z: 0, spatialReference: { wkid: 4326 } },
  endPoint: { type: "point", x: -122.41, y: 37.81, z: 0, spatialReference: { wkid: 4326 } }
});

const analysis = new DimensionAnalysis({
  dimensions: [dimension]
});

view.analyses.add(analysis);
```

## Analysis Types Summary

| Analysis | Use Case | Constructor Key |
|----------|----------|-----------------|
| ViewshedAnalysis | Visible area from observer | `viewsheds` (Collection of Viewshed) |
| LineOfSightAnalysis | Visibility between points | `observer`, `targets` (wrapper objects) |
| ShadowCastAnalysis | Shadow visualization | `date`, `startTimeOfDay`, `endTimeOfDay`, `mode` |
| SliceAnalysis | Cross-section of 3D content | `shape` (SlicePlane) |
| ElevationProfileAnalysis | Terrain profile along a line | `profiles`, `geometry` (Polyline) |
| AreaMeasurementAnalysis | 3D area measurement | `geometry` (Polygon) |
| DistanceMeasurementAnalysis | 3D distance measurement | `geometry` (Polyline) |
| VolumeMeasurementAnalysis | Cut/fill volume | `geometry` (Polygon) |
| DimensionAnalysis | Length dimensions in 3D | `dimensions` (LengthDimension[]) |

## Feature Queries with Statistics

### Basic Statistics

```javascript
const query = featureLayer.createQuery();
query.outStatistics = [
  { statisticType: "sum", onStatisticField: "population", outStatisticFieldName: "totalPop" },
  { statisticType: "avg", onStatisticField: "population", outStatisticFieldName: "avgPop" },
  { statisticType: "max", onStatisticField: "population", outStatisticFieldName: "maxPop" },
  { statisticType: "min", onStatisticField: "population", outStatisticFieldName: "minPop" },
  { statisticType: "count", onStatisticField: "population", outStatisticFieldName: "count" },
  { statisticType: "stddev", onStatisticField: "population", outStatisticFieldName: "stdDev" }
];

const result = await featureLayer.queryFeatures(query);
console.log(result.features[0].attributes);
```

### Group By Statistics

```javascript
const query = featureLayer.createQuery();
query.groupByFieldsForStatistics = ["state"];
query.outStatistics = [{
  statisticType: "sum",
  onStatisticField: "population",
  outStatisticFieldName: "totalPop"
}];
query.orderByFields = ["totalPop DESC"];

const result = await featureLayer.queryFeatures(query);
// Returns one feature per state with total population
```

### Spatial Statistics

```javascript
const query = featureLayer.createQuery();
query.geometry = view.extent;
query.spatialRelationship = "intersects";
query.outStatistics = [{
  statisticType: "count",
  onStatisticField: "ObjectID",
  outStatisticFieldName: "featureCount"
}];

const result = await featureLayer.queryFeatures(query);
console.log("Features in view:", result.features[0].attributes.featureCount);
```

## Feature Reduction

### Clustering

```javascript
const clusterConfig = {
  type: "cluster",
  clusterRadius: "100px",
  clusterMinSize: "24px",
  clusterMaxSize: "60px",
  popupTemplate: {
    title: "Cluster summary",
    content: "This cluster represents {cluster_count} features.",
    fieldInfos: [{
      fieldName: "cluster_count",
      format: { digitSeparator: true, places: 0 }
    }]
  },
  labelingInfo: [{
    deconflictionStrategy: "none",
    labelExpressionInfo: {
      expression: "Text($feature.cluster_count, '#,###')"
    },
    symbol: {
      type: "text",
      color: "white",
      font: { size: "12px", weight: "bold" }
    },
    labelPlacement: "center-center"
  }]
};

featureLayer.featureReduction = clusterConfig;

// Toggle clustering
featureLayer.featureReduction = null;           // Disable
featureLayer.featureReduction = clusterConfig;  // Enable
```

### Cluster with Aggregated Fields

```javascript
const clusterConfig = {
  type: "cluster",
  clusterRadius: "100px",
  fields: [{
    name: "avg_magnitude",
    statisticType: "avg",
    onStatisticField: "magnitude"
  }, {
    name: "total_count",
    statisticType: "count",
    onStatisticField: "ObjectID"
  }],
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      style: "circle",
      color: "#69dcff"
    },
    visualVariables: [{
      type: "size",
      field: "total_count",
      stops: [
        { value: 1, size: 8 },
        { value: 100, size: 40 }
      ]
    }]
  }
};
```

### Binning

```javascript
const binConfig = {
  type: "binning",
  fixedBinLevel: 4,
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-fill",
      outline: { color: "white", width: 0.5 }
    },
    visualVariables: [{
      type: "color",
      field: "aggregateCount",
      stops: [
        { value: 1, color: "#feebe2" },
        { value: 50, color: "#fbb4b9" },
        { value: 100, color: "#f768a1" },
        { value: 500, color: "#c51b8a" },
        { value: 1000, color: "#7a0177" }
      ]
    }]
  },
  popupTemplate: {
    title: "Bin",
    content: "{aggregateCount} features in this bin"
  }
};

featureLayer.featureReduction = binConfig;
```

## Common Pitfalls

1. **Analysis objects are SceneView-only**: All analysis types (viewshed, line of sight, shadow cast, etc.) require 3D SceneView. They do not work in MapView.

2. **ViewshedAnalysis uses a viewsheds collection**: Do not set `observer` directly on ViewshedAnalysis. Create `Viewshed` objects and add them to the `viewsheds` collection:
   ```javascript
   // Anti-pattern
   new ViewshedAnalysis({ observer: point, farDistance: 1000 });

   // Correct
   new ViewshedAnalysis({
     viewsheds: [new Viewshed({ observer: point, farDistance: 1000 })]
   });
   ```

3. **Cluster field names**: Use `cluster_count` (not `clusterCount`) to access the feature count in cluster popups and labels.

4. **Statistics queries return features**: Statistics queries return features with calculated attributes, not raw numbers. Access results via `result.features[0].attributes`.

5. **Analysis progress**: Check `analysisView.progress === 1` or watch `analysisView.result` to know when analysis results are ready. Don't read results before they're computed.

6. **SliceAnalysis uses `shape` not `plane`**: The property is `shape` of type `SlicePlane`, not `plane`:
   ```javascript
   // Anti-pattern
   new SliceAnalysis({ plane: slicePlane });

   // Correct
   new SliceAnalysis({ shape: slicePlane });
   ```

## Reference Samples

- `analysis-viewshed` - Interactive viewshed analysis in 3D
- `analysis-objects` - Multiple analysis types in a single scene
- `analysis-elevation-profile` - Elevation profile along a line
- `analysis-shadow-cast` - Shadow cast duration visualization
- `analysis-area-measurement` - Area measurement on 3D surfaces
- `analysis-volume-measurement` - Cut/fill volume measurement
- `line-of-sight` - Line of sight visibility analysis
- `featurereduction-cluster` - Feature clustering
- `featurereduction-binning` - Feature binning for aggregation
- `featurereduction-cluster-aggregate-fields` - Clusters with aggregated statistics

## Related Skills

- See `arcgis-geometry-operations` for client-side geometry operations (buffer, union, intersect, etc.).
- See `arcgis-rest-services` for server-side REST services (routing, geocoding, geoprocessing).
- See `arcgis-coordinates-projection` for coordinate projection and formatting.
- See `arcgis-layers` for FeatureLayer queries and layer configuration.
