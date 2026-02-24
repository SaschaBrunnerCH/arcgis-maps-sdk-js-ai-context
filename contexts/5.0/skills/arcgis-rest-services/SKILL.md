---
name: arcgis-rest-services
description: Call ArcGIS REST service endpoints for routing, geocoding, printing, places, geoprocessing, and other server-side operations.
---

# ArcGIS REST Services

Use this skill when calling ArcGIS Server REST endpoints through the `@arcgis/core/rest/*` namespace. Covers routing, geocoding, spatial queries, geoprocessing, printing, places, and other server-side operations.

## Import Patterns

### Direct ESM Imports
```javascript
import * as route from "@arcgis/core/rest/route.js";
import * as locator from "@arcgis/core/rest/locator.js";
import * as query from "@arcgis/core/rest/query.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Query from "@arcgis/core/rest/support/Query.js";
```

### Dynamic Imports (CDN)
```javascript
const route = await $arcgis.import("@arcgis/core/rest/route.js");
const locator = await $arcgis.import("@arcgis/core/rest/locator.js");
const [query, Query] = await $arcgis.import([
  "@arcgis/core/rest/query.js",
  "@arcgis/core/rest/support/Query.js"
]);
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
import Graphic from "@arcgis/core/Graphic.js";

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
  stops,
  outSpatialReference: { wkid: 4326 },
  returnDirections: true,
  returnRoutes: true,
  directionsLanguage: "en"
});

const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
const result = await route.solve(routeUrl, routeParams);

const routeResult = result.routeResults[0];
const routeGeometry = routeResult.route.geometry;

// Display directions
routeResult.directions.features.forEach((feature) => {
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
  stops,
  pointBarriers,
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
    new Graphic({ geometry: { type: "point", longitude: -117.3, latitude: 34.1 } })
  ]
});

const incidents = new FeatureSet({
  features: [
    new Graphic({ geometry: { type: "point", longitude: -117.19, latitude: 34.05 } })
  ]
});

const params = new ClosestFacilityParameters({
  facilities,
  incidents,
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

const params = new ServiceAreaParameters({
  facilities: facilitiesFeatureSet,
  defaultBreaks: [5, 10, 15], // minutes
  trimOuterPolygon: true,
  outSpatialReference: { wkid: 4326 }
});

const saUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
const result = await serviceArea.solve(saUrl, params);

result.serviceAreaPolygons.forEach((polygon) => {
  console.log("Break:", polygon.attributes.FromBreak, "-", polygon.attributes.ToBreak, "min");
});
```

## Locator (Geocoding)

### Address to Location

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
});
```

### Location to Address (Reverse Geocoding)

```javascript
const result = await locator.locationToAddress(geocodeUrl, {
  location: { type: "point", longitude: -117.195, latitude: 34.057 }
});

console.log(result.address);
console.log(result.attributes);
```

### Suggest Locations (Autocomplete)

```javascript
const suggestions = await locator.suggestLocations(geocodeUrl, {
  text: "380 New York",
  location: { type: "point", longitude: -117.195, latitude: 34.057 }
});

suggestions.forEach((suggestion) => {
  console.log(suggestion.text);
  console.log(suggestion.magicKey);
});

// Use magicKey to get the full result
const results = await locator.addressToLocations(geocodeUrl, {
  address: { SingleLine: suggestions[0].text },
  magicKey: suggestions[0].magicKey,
  outFields: ["*"]
});
```

## Query (REST)

Query features directly against a feature service endpoint without a FeatureLayer.

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

// JSON result
const result = await query.executeQueryJSON(featureServiceUrl, queryParams);
console.log("Features found:", result.features.length);

// Count only
const count = await query.executeForCount(featureServiceUrl, queryParams);

// Extent only
const extentResult = await query.executeForExtent(featureServiceUrl, queryParams);

// Object IDs only
const ids = await query.executeForIds(featureServiceUrl, queryParams);
```

### Query Methods

| Method | Returns | Use Case |
|--------|---------|----------|
| `executeQueryJSON(url, query)` | FeatureSet | Full feature data |
| `executeQueryPBF(url, query)` | FeatureSet | Smaller payload (PBF format) |
| `executeForCount(url, query)` | number | Feature count only |
| `executeForExtent(url, query)` | `{ count, extent }` | Bounding box + count |
| `executeForIds(url, query)` | number[] | Object IDs only |

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
  console.log("Layer:", findResult.layerId, "Value:", findResult.value);
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
  layerOption: "all",
  returnGeometry: true,
  spatialReference: view.spatialReference
});

const mapServiceUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
const result = await identify.identify(mapServiceUrl, params);

result.results.forEach((identifyResult) => {
  console.log("Layer:", identifyResult.layerName);
  console.log("Attributes:", identifyResult.feature.attributes);
});
```

## Print

Export a map to PDF, PNG, or other formats via a server-side print service.

```javascript
import * as print from "@arcgis/core/rest/print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";

const template = new PrintTemplate({
  format: "pdf",
  layout: "letter-ansi-a-landscape",
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
  view,
  template
});

const printUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
const result = await print.execute(printUrl, params);

window.open(result.url);
```

## Places

Search for points of interest (POI) using the ArcGIS Places service.

### Query Places Near a Point

```javascript
import * as places from "@arcgis/core/rest/places.js";
import PlacesQueryParameters from "@arcgis/core/rest/support/PlacesQueryParameters.js";

const queryParams = new PlacesQueryParameters({
  categoryIds: ["13065"],     // Restaurants
  radius: 500,                // meters
  point: { type: "point", longitude: -87.626, latitude: 41.882 },
  pageSize: 20
});

const results = await places.queryPlacesNearPoint(queryParams);

results.results.forEach((place) => {
  console.log(place.name, place.categories[0].label);
  console.log("Distance:", place.distance, "m");
});

// Pagination
if (results.nextPage) {
  const nextResults = await results.nextPage();
}
```

### Query Places Within Extent

```javascript
const queryParams = new PlacesQueryParameters({
  categoryIds: ["16000"],     // Landmarks and Outdoors
  xmin: -87.65,
  ymin: 41.87,
  xmax: -87.60,
  ymax: 41.90
});

const results = await places.queryPlacesWithinExtent(queryParams);
```

### Fetch Place Details

```javascript
import FetchPlaceParameters from "@arcgis/core/rest/support/FetchPlaceParameters.js";

const fetchParams = new FetchPlaceParameters({
  placeId: results.results[0].placeId,
  requestedFields: ["all"]
});

const details = await places.fetchPlace(fetchParams);
const placeDetails = details.placeDetails;

console.log("Name:", placeDetails.name);
console.log("Address:", placeDetails.address.streetAddress);
console.log("Phone:", placeDetails.contactInfo?.telephone);
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
  graphicsLayer.add(new Graphic({ geometry: feature.geometry, symbol: fillSymbol }));
});
```

### Asynchronous Execution (Long-running)

```javascript
const jobInfo = await geoprocessor.submitJob(gpUrl, params);

// Wait for completion
const completedJobInfo = await jobInfo.waitForJobCompletion({
  interval: 2000,
  statusCallback: (info) => {
    console.log("Status:", info.jobStatus);
  }
});

// Fetch results
const resultData = await completedJobInfo.fetchResultData("Result_Layer");
```

## Geometry Service

Perform server-side geometry operations.

```javascript
import * as geometryService from "@arcgis/core/rest/geometryService.js";

const geomServiceUrl = "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";

// Project geometries
const projected = await geometryService.project(geomServiceUrl, {
  geometries: [point1, point2],
  inSpatialReference: { wkid: 4326 },
  outSpatialReference: { wkid: 3857 }
});

// Buffer geometries
const buffered = await geometryService.buffer(geomServiceUrl, {
  geometries: [point],
  distances: [1000],
  unit: "meters",
  outSpatialReference: { wkid: 4326 }
});

// Areas and lengths
const result = await geometryService.areasAndLengths(geomServiceUrl, {
  polygons: [polygon],
  lengthUnit: "meters",
  areaUnit: "square-meters"
});
```

## Image Service

```javascript
import * as imageService from "@arcgis/core/rest/imageService.js";
import ImageIdentifyParameters from "@arcgis/core/rest/support/ImageIdentifyParameters.js";

const params = new ImageIdentifyParameters({
  geometry: clickPoint,
  returnGeometry: true,
  returnCatalogItems: true
});

const result = await imageService.identify(imageServiceUrl, params);
console.log("Pixel value:", result.value);
```

## Authentication for REST Services

Premium services (routing, geocoding, places) require authentication.

```javascript
import esriConfig from "@arcgis/core/config.js";

// Set API key globally
esriConfig.apiKey = "YOUR_API_KEY";

// Or register a token for a specific server
import esriId from "@arcgis/core/identity/IdentityManager.js";

esriId.registerToken({
  server: "https://route-api.arcgis.com",
  token: "YOUR_TOKEN"
});
```

## Common Pitfalls

1. **Missing authentication for premium services**: Route, places, and geocoding services require an API key or OAuth token. Set `esriConfig.apiKey` before making requests.

2. **Using the wrong parameter class**: Each REST service has its own parameters class (e.g., `RouteParameters` for route, `ClosestFacilityParameters` for closestFacility). Using the wrong class causes silent failures.

3. **Forgetting outSpatialReference**: Results default to the service's spatial reference. Always set `outSpatialReference` on parameters to match your view:
   ```javascript
   const params = new RouteParameters({
     stops,
     outSpatialReference: view.spatialReference
   });
   ```

4. **Not handling service errors**: Always wrap REST calls in try/catch:
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

5. **Using legacy task pattern**: The `esri/tasks/*` pattern was removed. Use `@arcgis/core/rest/*` modules with static function calls.

## Last Mile Delivery

Solve vehicle routing problems with pickup/delivery constraints.

```javascript
import * as lastMileDelivery from "@arcgis/core/rest/lastMileDelivery.js";

// Get service description
const serviceDescription = await lastMileDelivery.getServiceDescription(serviceUrl);

// Solve a vehicle routing problem
const result = await lastMileDelivery.solve(serviceUrl, params);
```

## Reference Samples

- `route` - Route finding between stops
- `directions-routelayer` - Route layer with directions
- `basemap-places` - Places service for POI discovery
- `places` - Places query and detail fetch
- `geoprocessing-viewshed` - Geoprocessing with viewshed analysis
- `geoprocessing-hotspot` - Hotspot analysis via geoprocessing
- `widgets-print` - Server-side map printing
- `tasks-route` - Routing tasks
- `tasks-find` - Find features in map service
- `tasks-identify` - Identify features at location
- `tasks-query` - Query features from service
- `find` - Find features by attribute
- `identify` - Identify features at location
- `query` - REST query against feature service

## Related Skills

- See `arcgis-authentication` for OAuth and API key setup.
- See `arcgis-layers` for FeatureLayer queries (server and client-side).
- See `arcgis-geometry-operations` for client-side geometry operations.
- See `arcgis-spatial-analysis` for analysis objects and feature reduction.
