---
name: arcgis-spatial-analysis
description: Perform spatial analysis using analysis objects, REST services for routing/geocoding/geoprocessing, and feature reduction with clustering/binning.
---

# ArcGIS Spatial Analysis

Use this skill for spatial analysis objects, REST service queries, and feature reduction (clustering/binning).

> For geometry operators (buffer, union, intersect, clip, offset, etc.), see [arcgis-geometry-operations](../arcgis-geometry-operations/SKILL.md).

## Analysis Objects

### ElevationProfileAnalysis
```javascript
import ElevationProfileAnalysis from "@arcgis/core/analysis/ElevationProfileAnalysis.js";

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

// Add to SceneView
view.analyses.add(analysis);

// Set line geometry
analysis.geometry = polyline;

// Get analysis view for results
const analysisView = await view.whenAnalysisView(analysis);

// Watch progress and results
reactiveUtils.watch(
  () => analysisView.progress,
  (progress) => {
    if (progress === 1) {
      console.log("Results:", analysisView.results);
    }
  }
);
```

### LineOfSightAnalysis
```javascript
import LineOfSightAnalysis from "@arcgis/core/analysis/LineOfSightAnalysis.js";

const analysis = new LineOfSightAnalysis({
  observer: {
    type: "point",
    x: -122.4,
    y: 37.8,
    z: 100,
    spatialReference: { wkid: 4326 }
  },
  targets: [
    { type: "point", x: -122.41, y: 37.81, z: 50 },
    { type: "point", x: -122.42, y: 37.79, z: 75 }
  ]
});

view.analyses.add(analysis);
```

### ViewshedAnalysis
```javascript
import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis.js";

const analysis = new ViewshedAnalysis({
  observer: {
    type: "point",
    x: -122.4,
    y: 37.8,
    z: 100,
    spatialReference: { wkid: 4326 }
  },
  farDistance: 1000,
  heading: 45,
  tilt: 90,
  horizontalFieldOfView: 120,
  verticalFieldOfView: 90
});

view.analyses.add(analysis);
```

### ShadowCast Widget
```javascript
import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";

const shadowCast = new ShadowCast({ view: view });
view.ui.add(shadowCast, "top-right");

// Configure date/time for shadow calculation
view.environment.lighting.date = new Date("2024-06-21T12:00:00");
```

### SliceAnalysis
```javascript
import SliceAnalysis from "@arcgis/core/analysis/SliceAnalysis.js";

const analysis = new SliceAnalysis({
  shape: {
    position: { type: "point", x: -122.4, y: 37.8, z: 50 },
    heading: 0,
    tilt: 0
  }
});

view.analyses.add(analysis);
```

## REST Services

### Routing

```javascript
import route from "@arcgis/core/rest/route.js";

const routeParams = {
  stops: [
    { geometry: { x: -122.4, y: 37.8 } },
    { geometry: { x: -122.5, y: 37.7 } }
  ],
  outSpatialReference: { wkid: 4326 },
  returnDirections: true,
  returnRoutes: true
};

const result = await route.solve(
  "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
  routeParams
);

const routeGeometry = result.routeResults[0].route.geometry;
const directions = result.routeResults[0].directions;
```

### Geocoding (Address to Location)

```javascript
import locator from "@arcgis/core/rest/locator.js";

const results = await locator.addressToLocations(
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  {
    address: { SingleLine: "380 New York St, Redlands, CA" },
    outFields: ["*"],
    maxLocations: 5
  }
);

results.forEach(result => {
  console.log(result.address, result.location);
});
```

### Reverse Geocoding (Location to Address)

```javascript
import locator from "@arcgis/core/rest/locator.js";

const result = await locator.locationToAddress(
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  {
    location: { x: -117.195, y: 34.057 }
  }
);

console.log(result.address);
```

### Geoprocessing

```javascript
import geoprocessor from "@arcgis/core/rest/geoprocessor.js";

const params = {
  inputLayer: featureSet,
  distance: 1000,
  distanceUnits: "Meters"
};

const result = await geoprocessor.execute(
  "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Buffer/GPServer/Buffer",
  params
);

const outputFeatures = result.results[0].value;
```

### Print

```javascript
import print from "@arcgis/core/rest/print.js";

const params = {
  view: view,
  template: {
    format: "pdf",
    layout: "letter-ansi-a-landscape",
    layoutOptions: {
      titleText: "My Map"
    }
  }
};

const result = await print.execute(
  "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
  params
);

// Download the PDF
window.open(result.url);
```

### Places Service

```javascript
import places from "@arcgis/core/rest/places.js";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters.js";
import FetchPlaceParameters from "@arcgis/core/rest/support/FetchPlaceParameters.js";

// Query places near a point
const queryParams = new PlacesQueryParameters({
  categoryIds: ["4d4b7104d754a06370d81259"], // Arts and Entertainment
  radius: 500, // meters
  point: { type: "point", longitude: -87.626, latitude: 41.882 },
  icon: "png"
});

const results = await places.queryPlacesNearPoint(queryParams);

// Process results
results.results.forEach(place => {
  console.log(place.name, place.location, place.categories[0].label);
  console.log("Distance:", place.distance / 1000, "km");
});

// Fetch detailed information about a place
const fetchParams = new FetchPlaceParameters({
  placeId: results.results[0].placeId,
  requestedFields: ["all"]
});

const details = await places.fetchPlace(fetchParams);
const placeDetails = details.placeDetails;

console.log("Address:", placeDetails.address.streetAddress);
console.log("Phone:", placeDetails.contactInfo.telephone);
console.log("Website:", placeDetails.contactInfo.website);
```

### Places Category IDs

| Category | ID |
|----------|-----|
| Arts and Entertainment | `4d4b7104d754a06370d81259` |
| Business Services | `4d4b7105d754a06375d81259` |
| Community and Government | `63be6904847c3692a84b9b9a` |
| Dining and Drinking | `63be6904847c3692a84b9bb5` |
| Health and Medicine | `63be6904847c3692a84b9bb9` |
| Landmarks and Outdoors | `4d4b7105d754a06377d81259` |
| Retail | `4d4b7105d754a06378d81259` |
| Sports and Recreation | `4f4528bc4b90abdf24c9de85` |
| Travel and Transportation | `4d4b7105d754a06379d81259` |

## Feature Queries with Statistics

### Basic Statistics
```javascript
const query = featureLayer.createQuery();
query.outStatistics = [
  {
    statisticType: "sum",
    onStatisticField: "population",
    outStatisticFieldName: "totalPop"
  },
  {
    statisticType: "avg",
    onStatisticField: "population",
    outStatisticFieldName: "avgPop"
  },
  {
    statisticType: "max",
    onStatisticField: "population",
    outStatisticFieldName: "maxPop"
  },
  {
    statisticType: "min",
    onStatisticField: "population",
    outStatisticFieldName: "minPop"
  },
  {
    statisticType: "count",
    onStatisticField: "population",
    outStatisticFieldName: "count"
  },
  {
    statisticType: "stddev",
    onStatisticField: "population",
    outStatisticFieldName: "stdDev"
  }
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

### Spatial Statistics Query
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
featureLayer.featureReduction = null; // Disable
featureLayer.featureReduction = clusterConfig; // Enable
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
  fixedBinLevel: 4, // Level of detail
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

> For coordinate projection and transformation, see [arcgis-coordinates-projection](../arcgis-coordinates-projection/SKILL.md).

## TypeScript Usage

Feature reduction configurations use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety
const clusterConfig = {
  type: "cluster",
  clusterRadius: "100px",
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      color: "#69dcff"
    }
  } as const,
  labelingInfo: [{
    labelExpressionInfo: {
      expression: "Text($feature.cluster_count, '#,###')"
    },
    symbol: {
      type: "text",
      color: "white"
    } as const
  }]
} as const;

featureLayer.featureReduction = clusterConfig;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `analysis-viewshed` - Viewshed analysis
- `route` - Route finding and directions
- `featurereduction-cluster` - Feature clustering analysis
- `featurereduction-binning` - Feature binning for aggregation
- `places` - Places service for POI search

## Common Pitfalls

1. **Operator not loaded**: Most operators require `await operator.load()` before use

2. **API key required**: Some REST services (routing, geocoding) require an API key

3. **Analysis only in SceneView**: Some analyses (viewshed, line of sight) only work in 3D

4. **Cluster fields**: Use `cluster_count` to access feature count in clusters

5. **Statistics query returns features**: Statistics queries return features with calculated attributes, not raw numbers

