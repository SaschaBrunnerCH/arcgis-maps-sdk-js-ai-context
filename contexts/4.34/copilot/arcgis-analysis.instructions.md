---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Analysis & Utilities

## Coordinate Conversion

```javascript
import CoordinateFormatter from "@arcgis/core/geometry/coordinateFormatter.js";

await CoordinateFormatter.load();

// To DMS
const dms = CoordinateFormatter.toLatitudeLongitude(point, "dms", 2);

// To MGRS
const mgrs = CoordinateFormatter.toMgrs(point, "automatic", 5, false);

// To UTM
const utm = CoordinateFormatter.toUtm(point, "latitude-band-indicators", true);

// From string
const point = CoordinateFormatter.fromLatitudeLongitude("34.05N, 118.24W");
```

## esriRequest (HTTP)

```javascript
import esriRequest from "@arcgis/core/request.js";

const response = await esriRequest(url, {
  query: { f: "json" },
  responseType: "json"
});
console.log(response.data);

// POST request
const response = await esriRequest(url, {
  method: "post",
  body: formData,
  responseType: "json"
});
```

## Print Task

```javascript
import PrintTask from "@arcgis/core/tasks/PrintTask.js";
import PrintTemplate from "@arcgis/core/tasks/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/tasks/support/PrintParameters.js";

const printTask = new PrintTask({
  url: "https://utility.arcgisonline.com/.../PrintingTools/GPServer/Export%20Web%20Map%20Task"
});

const template = new PrintTemplate({
  format: "pdf",
  layout: "letter-ansi-a-landscape",
  exportOptions: { dpi: 150 }
});

const params = new PrintParameters({
  view: view,
  template: template
});

const result = await printTask.execute(params);
console.log("PDF URL:", result.url);
```

## Route Task

```javascript
import RouteTask from "@arcgis/core/tasks/RouteTask.js";
import RouteParameters from "@arcgis/core/tasks/support/RouteParameters.js";
import Stop from "@arcgis/core/tasks/support/Stop.js";

const routeTask = new RouteTask({
  url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
});

const params = new RouteParameters({
  stops: new FeatureSet({
    features: [
      new Graphic({ geometry: startPoint }),
      new Graphic({ geometry: endPoint })
    ]
  }),
  returnDirections: true
});

const result = await routeTask.solve(params);
const route = result.routeResults[0].route;
```

## Geocoding

```javascript
import Locator from "@arcgis/core/tasks/Locator.js";

const locator = new Locator({
  url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
});

// Address to location
const results = await locator.addressToLocations({
  address: { SingleLine: "380 New York St, Redlands, CA" }
});

// Location to address
const result = await locator.locationToAddress({ location: point });
```

## Feature Clustering

```javascript
layer.featureReduction = {
  type: "cluster",
  clusterRadius: 80,
  clusterMinSize: 16,
  clusterMaxSize: 60,
  popupTemplate: {
    title: "Cluster of {cluster_count}",
    content: [{ type: "fields", fieldInfos: [{ fieldName: "cluster_count" }] }]
  },
  fields: [{
    name: "cluster_avg_value",
    alias: "Average",
    onStatisticField: "value",
    statisticType: "avg"
  }]
};
```

## Measurement

```html
<arcgis-distance-measurement-2d slot="top-right"></arcgis-distance-measurement-2d>
<arcgis-area-measurement-2d slot="top-right"></arcgis-area-measurement-2d>
```

```javascript
import Measurement from "@arcgis/core/widgets/Measurement.js";

const measurement = new Measurement({
  view: view,
  activeTool: "distance"  // distance, area
});

view.ui.add(measurement, "top-right");
```

## Swipe

```html
<arcgis-map basemap="streets-vector">
  <arcgis-swipe slot="top-right" position="50"></arcgis-swipe>
</arcgis-map>
```

```javascript
import Swipe from "@arcgis/core/widgets/Swipe.js";

const swipe = new Swipe({
  view: view,
  leadingLayers: [layer1],
  trailingLayers: [layer2],
  position: 50
});
```

## Bookmarks

```html
<arcgis-bookmarks slot="top-right"></arcgis-bookmarks>
```

```javascript
import Bookmarks from "@arcgis/core/widgets/Bookmarks.js";

const bookmarks = new Bookmarks({
  view: view,
  bookmarks: [
    {
      name: "Los Angeles",
      viewpoint: { targetGeometry: extent1 }
    },
    {
      name: "New York",
      viewpoint: { targetGeometry: extent2 }
    }
  ]
});
```

## Portal Operations

### Save WebMap

```javascript
import WebMap from "@arcgis/core/WebMap.js";

const webmap = new WebMap({ basemap: "topo-vector" });
webmap.add(layer);

await webmap.save({
  folder: portal.user.username + "/My Maps",
  title: "My WebMap",
  description: "Description",
  tags: ["tag1", "tag2"]
});
```

### Load and Update WebMap

```javascript
const webmap = new WebMap({
  portalItem: { id: "EXISTING_WEBMAP_ID" }
});

await webmap.load();
webmap.add(newLayer);
await webmap.save();
```

## Time-Aware Layers

```javascript
// TimeSlider
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";

const timeSlider = new TimeSlider({
  view: view,
  fullTimeExtent: layer.timeInfo.fullTimeExtent,
  mode: "time-window",
  stops: { interval: { value: 1, unit: "hours" } }
});
```

```html
<arcgis-time-slider slot="bottom" mode="time-window" loop></arcgis-time-slider>
```

## Statistics

```javascript
const query = layer.createQuery();
query.outStatistics = [
  { statisticType: "sum", onStatisticField: "population", outStatisticFieldName: "total" },
  { statisticType: "avg", onStatisticField: "population", outStatisticFieldName: "average" },
  { statisticType: "min", onStatisticField: "population", outStatisticFieldName: "minimum" },
  { statisticType: "max", onStatisticField: "population", outStatisticFieldName: "maximum" },
  { statisticType: "count", onStatisticField: "population", outStatisticFieldName: "count" }
];

query.groupByFieldsForStatistics = ["category"];

const result = await layer.queryFeatures(query);
```

## Hit Test

```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event);

  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked:", graphic.attributes);
  }
});
```

## Screenshot

```javascript
const screenshot = await view.takeScreenshot({
  format: "png",
  quality: 100,
  width: 1920,
  height: 1080
});

const image = document.createElement("img");
image.src = screenshot.dataUrl;
```

## Common Pitfalls

1. **API key required** - Many services need API key or OAuth
2. **Async operations** - Always await async methods
3. **CORS** - Configure proxy for cross-origin services
4. **Rate limits** - Be aware of service rate limits
