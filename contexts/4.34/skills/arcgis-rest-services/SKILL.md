---
name: arcgis-rest-services
description: REST service wrappers for routing, geocoding, printing, places, geoprocessing, and other server-side operations in ArcGIS Maps SDK for JavaScript
---

# ArcGIS REST Services

Use this skill when calling ArcGIS Server REST endpoints through the `@arcgis/core/rest/*` namespace. Covers routing, geocoding, spatial analysis, geoprocessing, printing, places, and other server-side operations.

## Import Pattern

REST service modules follow a consistent pattern: import the service module and its corresponding parameters class from `rest/support/`.

```javascript
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
```

All REST service functions accept a service URL as the first argument and a parameters object as the second:

```javascript
const result = await serviceName.methodName(serviceUrl, params);
```

## Route

Solve routes between stops with optional barriers and directions.

```javascript
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Stop from "@arcgis/core/rest/support/Stop.js";

const stops = new FeatureSet({
  features: [
    new Graphic({
      geometry: { type: "point", longitude: -117.195, latitude: 34.057 },
      attributes: { Name: "Start" }
    }),
    new Graphic({
      geometry: { type: "point", longitude: -117.918, latitude: 33.812 },
      attributes: { Name: "End" }
    })
  ]
});

const routeParams = new RouteParameters({
  stops: stops,
  outSpatialReference: { wkid: 4326 },
  returnDirections: true,
  returnRoutes: true,
  directionsLanguage: "en"
});

const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
const result = await route.solve(routeUrl, routeParams);

const routeResult = result.routeResults[0];
const routeGeometry = routeResult.route.geometry;
const directions = routeResult.directions;

// Display directions
directions.features.forEach((feature) => {
  console.log(feature.attributes.text, feature.attributes.length.toFixed(2), "miles");
});
```

### Route with Barriers

```javascript
const pointBarriers = new FeatureSet({
  features: [
    new Graphic({
      geometry: { type: "point", longitude: -117.5, latitude: 33.9 }
    })
  ]
});

const routeParams = new RouteParameters({
  stops: stops,
  pointBarriers: pointBarriers,
  outSpatialReference: { wkid: 4326 },
  returnDirections: true
});

const result = await route.solve(routeUrl, routeParams);
```

## Closest Facility

Find the nearest facilities to a set of incidents.

```javascript
import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";

const facilities = new FeatureSet({
  features: [
    new Graphic({ geometry: { type: "point", longitude: -117.2, latitude: 34.06 } }),
    new Graphic({ geometry: { type: "point", longitude: -117.3, latitude: 34.1 } }),
    new Graphic({ geometry: { type: "point", longitude: -117.15, latitude: 34.0 } })
  ]
});

const incidents = new FeatureSet({
  features: [
    new Graphic({ geometry: { type: "point", longitude: -117.19, latitude: 34.05 } })
  ]
});

const params = new ClosestFacilityParameters({
  facilities: facilities,
  incidents: incidents,
  defaultTargetFacilityCount: 1,
  returnRoutes: true,
  returnDirections: true,
  outSpatialReference: { wkid: 4326 }
});

const cfUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";
const result = await closestFacility.solve(cfUrl, params);

const closestRoute = result.routes[0];
console.log("Distance:", closestRoute.attributes.Total_Kilometers, "km");
```

## Service Area

Generate service area polygons around facilities based on travel time or distance.

```javascript
import * as serviceArea from "@arcgis/core/rest/serviceArea.js";
import ServiceAreaParameters from "@arcgis/core/rest/support/ServiceAreaParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";

const facilitiesFeatureSet = new FeatureSet({
  features: [
    new Graphic({
      geometry: { type: "point", longitude: -117.195, latitude: 34.057 }
    })
  ]
});

const params = new ServiceAreaParameters({
  facilities: facilitiesFeatureSet,
  defaultBreaks: [5, 10, 15], // minutes
  travelMode: { name: "Driving" },
  trimOuterPolygon: true,
  outSpatialReference: { wkid: 4326 }
});

const saUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
const result = await serviceArea.solve(saUrl, params);

// Each break value produces a polygon
result.serviceAreaPolygons.forEach((polygon) => {
  console.log("Break:", polygon.attributes.FromBreak, "-", polygon.attributes.ToBreak, "min");
  graphicsLayer.add(new Graphic({ geometry: polygon.geometry, symbol: fillSymbol }));
});
```

## Locator (Geocoding)

### Address to Location (Geocoding)

```javascript
import * as locator from "@arcgis/core/rest/locator.js";

const geocodeUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const results = await locator.addressToLocations(geocodeUrl, {
  address: { SingleLine: "380 New York St, Redlands, CA" },
  outFields: ["Addr_type", "Match_addr", "StAddr", "City"],
  maxLocations: 5
});

results.forEach((result) => {
  console.log(result.address);       // Matched address
  console.log(result.location);      // Point geometry
  console.log(result.score);         // Match score (0-100)
  console.log(result.attributes);    // Returned fields
});
```

### Location to Address (Reverse Geocoding)

```javascript
import * as locator from "@arcgis/core/rest/locator.js";

const geocodeUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const result = await locator.locationToAddress(geocodeUrl, {
  location: { type: "point", longitude: -117.195, latitude: 34.057 }
});

console.log(result.address);        // Full address string
console.log(result.attributes);     // Address components
```

### Suggest Locations (Autocomplete)

```javascript
import * as locator from "@arcgis/core/rest/locator.js";

const geocodeUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const suggestions = await locator.suggestLocations(geocodeUrl, {
  text: "380 New York",
  location: { type: "point", longitude: -117.195, latitude: 34.057 }
});

suggestions.forEach((suggestion) => {
  console.log(suggestion.text);      // Display text
  console.log(suggestion.magicKey);  // Use with addressToLocations
});

// Use magicKey to get the full result
const results = await locator.addressToLocations(geocodeUrl, {
  address: { SingleLine: suggestions[0].text },
  magicKey: suggestions[0].magicKey,
  outFields: ["*"]
});
```

## Find

Find features in a map service by attribute values.

```javascript
import * as find from "@arcgis/core/rest/find.js";
import FindParameters from "@arcgis/core/rest/support/FindParameters.js";

const params = new FindParameters({
  searchText: "Los Angeles",
  layerIds: [0, 1, 2],
  searchFields: ["Name", "City"],
  returnGeometry: true,
  outSpatialReference: { wkid: 4326 }
});

const mapServiceUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
const result = await find.find(mapServiceUrl, params);

result.results.forEach((findResult) => {
  console.log("Layer:", findResult.layerId);
  console.log("Value:", findResult.value);
  console.log("Feature:", findResult.feature);
});
```

## Identify

Identify features at a specific location on a map service.

```javascript
import * as identify from "@arcgis/core/rest/identify.js";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters.js";

const params = new IdentifyParameters({
  geometry: view.toMap(screenPoint),
  mapExtent: view.extent,
  tolerance: 3,
  width: view.width,
  height: view.height,
  layerOption: "all",                // "top", "visible", "all"
  returnGeometry: true,
  spatialReference: view.spatialReference
});

const mapServiceUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
const result = await identify.identify(mapServiceUrl, params);

result.results.forEach((identifyResult) => {
  console.log("Layer:", identifyResult.layerName);
  console.log("Feature:", identifyResult.feature);
  console.log("Attributes:", identifyResult.feature.attributes);
});
```

## Print

Export a map to PDF, PNG, or other formats using a server-side print service.

```javascript
import * as print from "@arcgis/core/rest/print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";

const template = new PrintTemplate({
  format: "pdf",                             // "pdf", "png32", "png8", "jpg", "gif", "eps", "svg", "svgz"
  layout: "letter-ansi-a-landscape",         // Layout name from print service
  layoutOptions: {
    titleText: "My Map Export",
    authorText: "Map Author",
    scalebarUnit: "Miles"
  },
  exportOptions: {
    dpi: 300,
    width: 800,
    height: 1100
  }
});

const params = new PrintParameters({
  view: view,
  template: template
});

const printUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
const result = await print.execute(printUrl, params);

// Open the exported file
window.open(result.url);
```

## Places

Search for points of interest (POI) using the ArcGIS Places service.

### Query Places Near a Point

```javascript
import * as places from "@arcgis/core/rest/places.js";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters.js";

const queryParams = new PlacesQueryParameters({
  categoryIds: ["13065"],                    // Restaurants
  radius: 500,                               // meters
  point: { type: "point", longitude: -87.626, latitude: 41.882 },
  pageSize: 20
});

const results = await places.queryPlacesNearPoint(queryParams);

results.results.forEach((place) => {
  console.log(place.name);
  console.log(place.categories[0].label);
  console.log(place.location);
  console.log("Distance:", place.distance, "m");
});

// Pagination - get next page
if (results.nextPage) {
  const nextResults = await results.nextPage();
}
```

### Query Places Within Extent

```javascript
import * as places from "@arcgis/core/rest/places.js";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters.js";

const queryParams = new PlacesQueryParameters({
  categoryIds: ["16000"],                    // Landmarks and Outdoors
  xmin: -87.65,
  ymin: 41.87,
  xmax: -87.60,
  ymax: 41.90
});

const results = await places.queryPlacesWithinExtent(queryParams);
```

### Fetch Place Details

```javascript
import * as places from "@arcgis/core/rest/places.js";
import FetchPlaceParameters from "@arcgis/core/rest/support/FetchPlaceParameters.js";

const fetchParams = new FetchPlaceParameters({
  placeId: results.results[0].placeId,
  requestedFields: ["all"]                   // or specific: ["name", "address", "contactInfo", "hours"]
});

const details = await places.fetchPlace(fetchParams);
const placeDetails = details.placeDetails;

console.log("Name:", placeDetails.name);
console.log("Address:", placeDetails.address.streetAddress);
console.log("City:", placeDetails.address.locality);
console.log("Phone:", placeDetails.contactInfo?.telephone);
console.log("Website:", placeDetails.contactInfo?.website);
console.log("Hours:", placeDetails.hours?.opening);
console.log("Rating:", placeDetails.rating?.user);
```

### Places Category IDs

| Category | ID |
|----------|-----|
| Arts and Entertainment | `10000` |
| Business and Professional Services | `11000` |
| Community and Government | `12000` |
| Dining and Drinking | `13000` |
| Health and Medicine | `15000` |
| Landmarks and Outdoors | `16000` |
| Retail | `17000` |
| Sports and Recreation | `18000` |
| Travel and Transportation | `19000` |

## Geoprocessor

Run custom geoprocessing tasks on ArcGIS Server.

### Synchronous Execution

```javascript
import * as geoprocessor from "@arcgis/core/rest/geoprocessor.js";

const gpUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed";

const params = {
  Input_Observation_Point: new FeatureSet({ features: [pointGraphic] }),
  Viewshed_Distance: 15000
};

const result = await geoprocessor.execute(gpUrl, params);

const outputFeatures = result.results[0].value;
outputFeatures.features.forEach((feature) => {
  graphicsLayer.add(new Graphic({
    geometry: feature.geometry,
    symbol: fillSymbol
  }));
});
```

### Asynchronous Execution (Long-running tasks)

```javascript
import * as geoprocessor from "@arcgis/core/rest/geoprocessor.js";

const gpUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911CallsHotspot";

const params = {
  Query: "I911 > 0"
};

// Submit job
const jobInfo = await geoprocessor.submitJob(gpUrl, params);

// Wait for job to complete
const completedJobInfo = await jobInfo.waitForJobCompletion();

console.log("Job status:", completedJobInfo.jobStatus);

// Fetch results
const resultData = await completedJobInfo.fetchResultData("Result_Layer");
const resultMapImage = await completedJobInfo.fetchResultMapImageLayer("Result_Layer");
```

### Monitor Job Progress

```javascript
const jobInfo = await geoprocessor.submitJob(gpUrl, params);

// Poll for status updates
const completedJobInfo = await jobInfo.waitForJobCompletion({
  interval: 2000,  // Check every 2 seconds
  statusCallback: (info) => {
    console.log("Status:", info.jobStatus);
    console.log("Messages:", info.messages);
  }
});
```

## Geometry Service

Perform server-side geometry operations.

```javascript
import * as geometryService from "@arcgis/core/rest/geometryService.js";

const geomServiceUrl = "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";

// Project geometries
const projectedGeometries = await geometryService.project(geomServiceUrl, {
  geometries: [point1, point2],
  inSpatialReference: { wkid: 4326 },
  outSpatialReference: { wkid: 3857 }
});

// Buffer geometries
const bufferedGeometries = await geometryService.buffer(geomServiceUrl, {
  geometries: [point],
  distances: [1000],
  unit: "meters",
  outSpatialReference: { wkid: 4326 }
});

// Lengths and areas
const result = await geometryService.areasAndLengths(geomServiceUrl, {
  polygons: [polygon],
  lengthUnit: "meters",
  areaUnit: "square-meters"
});

console.log("Area:", result.areas[0]);
console.log("Perimeter:", result.lengths[0]);
```

## Image Service

Query and identify imagery from an image service.

```javascript
import * as imageService from "@arcgis/core/rest/imageService.js";
import ImageIdentifyParameters from "@arcgis/core/rest/support/ImageIdentifyParameters.js";

const imageServiceUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NLCDLandCover2001/ImageServer";

const params = new ImageIdentifyParameters({
  geometry: clickPoint,
  returnGeometry: true,
  returnCatalogItems: true
});

const result = await imageService.identify(imageServiceUrl, params);

console.log("Pixel value:", result.value);
console.log("Catalog items:", result.catalogItems);
```

## Feature Service

Perform operations directly against a feature service endpoint.

### Query Features

```javascript
import * as query from "@arcgis/core/rest/query.js";
import Query from "@arcgis/core/rest/support/Query.js";

const featureServiceUrl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";

const queryParams = new Query({
  where: "Height > 50",
  outFields: ["*"],
  returnGeometry: true,
  outSpatialReference: { wkid: 4326 }
});

const result = await query.executeQueryJSON(featureServiceUrl, queryParams);

console.log("Features found:", result.features.length);
result.features.forEach((feature) => {
  console.log(feature.attributes);
});
```

### Apply Edits

```javascript
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
});

// Add features
const addResult = await featureLayer.applyEdits({
  addFeatures: [
    new Graphic({
      geometry: { type: "point", longitude: -117.19, latitude: 34.05 },
      attributes: { Name: "New Feature", Value: 100 }
    })
  ]
});

// Update features
const updateResult = await featureLayer.applyEdits({
  updateFeatures: [
    new Graphic({
      attributes: { ObjectID: 1, Name: "Updated Name" },
      geometry: { type: "point", longitude: -117.2, latitude: 34.06 }
    })
  ]
});

// Delete features
const deleteResult = await featureLayer.applyEdits({
  deleteFeatures: [
    { objectId: 1 },
    { objectId: 2 }
  ]
});

// Check results
addResult.addFeatureResults.forEach((result) => {
  console.log("Added ObjectID:", result.objectId, "Success:", !result.error);
});
```

## Authentication for REST Services

Premium services (routing, geocoding, places) require authentication via API key or OAuth.

### API Key

```javascript
import esriConfig from "@arcgis/core/config.js";

// Set API key globally
esriConfig.apiKey = "YOUR_API_KEY";

// Now all premium REST calls will use this key
const results = await locator.addressToLocations(geocodeUrl, params);
```

### Per-Request Authentication

```javascript
import esriId from "@arcgis/core/identity/IdentityManager.js";

// Register a token for a specific server
esriId.registerToken({
  server: "https://route-api.arcgis.com",
  token: "YOUR_TOKEN"
});
```

## Migration from Legacy Patterns

| Legacy Pattern | Modern Pattern |
|---------------|----------------|
| `require("esri/tasks/RouteTask")` | `import * as route from "@arcgis/core/rest/route.js"` |
| `new RouteTask({ url })` | `route.solve(url, params)` |
| `require("esri/tasks/Locator")` | `import * as locator from "@arcgis/core/rest/locator.js"` |
| `new Locator({ url })` | `locator.addressToLocations(url, params)` |
| `require("esri/tasks/Geoprocessor")` | `import * as geoprocessor from "@arcgis/core/rest/geoprocessor.js"` |
| `new Geoprocessor({ url })` | `geoprocessor.submitJob(url, params)` |
| `require("esri/tasks/PrintTask")` | `import * as print from "@arcgis/core/rest/print.js"` |
| `new PrintTask({ url })` | `print.execute(url, params)` |
| `require("esri/tasks/IdentifyTask")` | `import * as identify from "@arcgis/core/rest/identify.js"` |
| `new IdentifyTask({ url })` | `identify.identify(url, params)` |
| `require("esri/tasks/FindTask")` | `import * as find from "@arcgis/core/rest/find.js"` |
| `new FindTask({ url })` | `find.find(url, params)` |
| `require("esri/tasks/ClosestFacilityTask")` | `import * as closestFacility from "@arcgis/core/rest/closestFacility.js"` |
| `new ClosestFacilityTask({ url })` | `closestFacility.solve(url, params)` |
| `require("esri/tasks/ServiceAreaTask")` | `import * as serviceArea from "@arcgis/core/rest/serviceArea.js"` |
| `new ServiceAreaTask({ url })` | `serviceArea.solve(url, params)` |

## Reference Samples

- `route` - Route finding between stops
- `closest-facility` - Finding nearest facilities
- `service-area` - Generating service area polygons
- `search` - Geocoding with the Search widget and locator
- `places` - Places service for POI discovery
- `geoprocessor` - Running geoprocessing tasks
- `print` - Server-side map printing

## Common Pitfalls

1. **Not providing authentication for premium services**: Route, places, and geocoding services require an API key or OAuth token. Set `esriConfig.apiKey` before making requests.

2. **Using wrong parameter class**: Each service has its own parameters class (e.g., `RouteParameters` for route, `ClosestFacilityParameters` for closestFacility). Using the wrong class causes silent failures or unexpected results.

3. **Forgetting to set outSpatialReference**: Results default to the service's spatial reference. Always set `outSpatialReference` on parameter objects to match your view's spatial reference:
   ```javascript
   const params = new RouteParameters({
     stops: stops,
     outSpatialReference: view.spatialReference  // Match the view
   });
   ```

4. **Using legacy task pattern instead of modern rest/* imports**: The `esri/tasks/*` pattern is deprecated. Use `@arcgis/core/rest/*` modules with static function calls instead of class instantiation.

5. **Not handling service errors**: REST service calls can fail due to network issues, insufficient credits, or invalid parameters. Always wrap calls in try/catch:
   ```javascript
   try {
     const result = await route.solve(routeUrl, routeParams);
   } catch (error) {
     if (error.name === "AbortError") {
       console.log("Request was cancelled");
     } else {
       console.error("Service error:", error.message);
     }
   }
   ```
