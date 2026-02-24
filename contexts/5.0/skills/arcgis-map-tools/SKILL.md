---
name: arcgis-map-tools
description: Add interactive map tools including swipe comparison, measurement, coordinate conversion, bookmarks, print, and routing. Use for layer comparison, distance/area measurement, and navigation services.
---

# ArcGIS Map Tools

Use this skill for swipe comparison, measurement tools, coordinate conversion, bookmarks, print, routing, and identify operations.

## Import Patterns

### Direct ESM Imports
```javascript
import Measurement from "@arcgis/core/widgets/Measurement.js";
import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D.js";
import AreaMeasurement2D from "@arcgis/core/widgets/AreaMeasurement2D.js";
import Print from "@arcgis/core/widgets/Print.js";
import Directions from "@arcgis/core/widgets/Directions.js";
import * as route from "@arcgis/core/rest/route.js";
import * as identify from "@arcgis/core/rest/identify.js";
import * as print from "@arcgis/core/rest/print.js";
```

### Dynamic Imports (CDN)
```javascript
const Measurement = await $arcgis.import("@arcgis/core/widgets/Measurement.js");
const Print = await $arcgis.import("@arcgis/core/widgets/Print.js");
const [route, RouteParameters] = await $arcgis.import([
  "@arcgis/core/rest/route.js",
  "@arcgis/core/rest/support/RouteParameters.js"
]);
```

## Swipe Widget

Compare layers by swiping between them.

### Swipe Component

```html
<arcgis-map zoom="15" center="-154.88, 19.46">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-swipe swipe-position="32"></arcgis-swipe>
</arcgis-map>

<script type="module">
  import Map from "@arcgis/core/Map.js";
  import TileLayer from "@arcgis/core/layers/TileLayer.js";

  const viewElement = document.querySelector("arcgis-map");
  const arcgisSwipe = document.querySelector("arcgis-swipe");

  const layer1 = new TileLayer({ url: "..." });
  const layer2 = new TileLayer({ url: "..." });

  viewElement.map = new Map({
    basemap: "satellite",
    layers: [layer1, layer2]
  });

  // Configure swipe when ready
  arcgisSwipe.addEventListener("arcgisPropertyChange", (e) => {
    if (e.detail.name === "state" && arcgisSwipe.state === "ready") {
      arcgisSwipe.leadingLayers.add(layer1);
      arcgisSwipe.trailingLayers.add(layer2);
    }
  });
</script>
```

### Swipe Widget (Core API)

```javascript
import Swipe from "@arcgis/core/widgets/Swipe.js";

const swipe = new Swipe({
  view: view,
  leadingLayers: [layer1],
  trailingLayers: [layer2],
  position: 50,
  direction: "horizontal" // or "vertical"
});

view.ui.add(swipe);
```

## Measurement

### Measurement Components

```html
<!-- 2D Measurement -->
<arcgis-map>
  <arcgis-distance-measurement-2d slot="top-right"></arcgis-distance-measurement-2d>
  <arcgis-area-measurement-2d slot="top-right"></arcgis-area-measurement-2d>
</arcgis-map>

<!-- 3D Measurement -->
<arcgis-scene>
  <arcgis-direct-line-measurement-3d slot="top-right"></arcgis-direct-line-measurement-3d>
  <arcgis-area-measurement-3d slot="top-right"></arcgis-area-measurement-3d>
</arcgis-scene>
```

### Measurement Widget (Core API)

```javascript
import Measurement from "@arcgis/core/widgets/Measurement.js";

const measurement = new Measurement({ view: view });
view.ui.add(measurement, "bottom-right");

// Activate distance measurement
measurement.activeTool = view.type === "2d" ? "distance" : "direct-line";

// Activate area measurement
measurement.activeTool = "area";

// Clear measurements
measurement.clear();
```

### 2D Measurement Widgets (Core API)

```javascript
import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D.js";
import AreaMeasurement2D from "@arcgis/core/widgets/AreaMeasurement2D.js";

const distanceWidget = new DistanceMeasurement2D({
  view: view,
  unit: "kilometers"
});
view.ui.add(distanceWidget, "top-right");

const areaWidget = new AreaMeasurement2D({
  view: view,
  unit: "square-kilometers"
});
view.ui.add(areaWidget, "top-right");
```

### 3D Measurement Widgets (Core API)

```javascript
import DirectLineMeasurement3D from "@arcgis/core/widgets/DirectLineMeasurement3D.js";
import AreaMeasurement3D from "@arcgis/core/widgets/AreaMeasurement3D.js";

const lineWidget = new DirectLineMeasurement3D({
  view: sceneView,
  unit: "meters"
});

const areaWidget = new AreaMeasurement3D({
  view: sceneView,
  unit: "square-meters"
});
```

## Coordinate Conversion

### Coordinate Conversion Component

```html
<arcgis-map basemap="satellite" center="-117.195, 34.057" zoom="13">
  <arcgis-coordinate-conversion slot="bottom-left"></arcgis-coordinate-conversion>
</arcgis-map>
```

### Coordinate Conversion Widget (Core API)

```javascript
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";

const ccWidget = new CoordinateConversion({ view: view });
view.ui.add(ccWidget, "bottom-left");
```

## Bookmarks

### Bookmarks Component

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-expand slot="top-right" expand-tooltip="Bookmarks">
    <arcgis-bookmarks></arcgis-bookmarks>
  </arcgis-expand>
</arcgis-map>
```

### Bookmarks Widget (Core API)

```javascript
import Bookmarks from "@arcgis/core/widgets/Bookmarks.js";

const bookmarks = new Bookmarks({
  view: view,
  editingEnabled: true,
  visibleElements: {
    addBookmarkButton: true,
    editBookmarkButton: true
  }
});

view.ui.add(bookmarks, "top-right");
```

## Directions Widget

### Directions Component

```html
<arcgis-map>
  <arcgis-directions slot="top-right"></arcgis-directions>
</arcgis-map>
```

### Directions Widget (Core API)

```javascript
import Directions from "@arcgis/core/widgets/Directions.js";

const directions = new Directions({
  view: view
});

view.ui.add(directions, "top-right");
```

## Routing (Programmatic)

### Basic Route

```javascript
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

const routeLayer = new GraphicsLayer();
map.add(routeLayer);

const routeParams = new RouteParameters({
  apiKey: "YOUR_API_KEY",
  stops: new FeatureSet(),
  outSpatialReference: { wkid: 3857 }
});

// Add stop on click
view.on("click", async (event) => {
  const stop = new Graphic({
    geometry: event.mapPoint,
    symbol: {
      type: "simple-marker",
      style: "cross",
      size: 15
    }
  });
  routeLayer.add(stop);
  routeParams.stops.features.push(stop);

  if (routeParams.stops.features.length >= 2) {
    const result = await route.solve(routeUrl, routeParams);
    const routeResult = result.routeResults[0].route;
    routeResult.symbol = {
      type: "simple-line",
      color: [0, 0, 255, 0.5],
      width: 5
    };
    routeLayer.add(routeResult);
  }
});
```

### Route with Directions

```javascript
const routeParams = new RouteParameters({
  apiKey: "YOUR_API_KEY",
  stops: new FeatureSet({ features: stopGraphics }),
  returnDirections: true,
  directionsLanguage: "en",
  returnRoutes: true,
  returnStops: true,
  impedanceAttribute: "TravelTime",
  outSpatialReference: { wkid: 4326 }
});

const result = await route.solve(routeUrl, routeParams);

const directions = result.routeResults[0].directions;
directions.features.forEach(feature => {
  console.log(feature.attributes.text);
});
```

## Print

### Print Component

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-expand slot="top-right" expand-tooltip="Print">
    <arcgis-print></arcgis-print>
  </arcgis-expand>
</arcgis-map>
```

### Print Widget (Core API)

```javascript
import Print from "@arcgis/core/widgets/Print.js";

const print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
  allowedFormats: ["pdf", "png32", "jpg"],
  allowedLayouts: ["a4-landscape", "a4-portrait", "letter-ansi-a-landscape"],
  templateOptions: {
    title: "Default Map Title",
    author: "Default Author"
  }
});

view.ui.add(print, "top-right");
```

### Print Service (Programmatic)

```javascript
import * as print from "@arcgis/core/rest/print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";

const printUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

const template = new PrintTemplate({
  format: "pdf",          // pdf, png32, png8, jpg, gif, eps, svg, svgz
  layout: "a4-landscape", // Or custom layout name
  exportOptions: { dpi: 300 },
  layoutOptions: {
    titleText: "My Map",
    authorText: "Author Name",
    copyrightText: "Copyright 2025",
    scalebarUnit: "Kilometers"
  }
});

const params = new PrintParameters({
  view: view,
  template: template
});

const result = await print.execute(printUrl, params);
console.log("PDF URL:", result.url);
```

### Print Formats

| Format | Description |
|--------|-------------|
| `pdf` | Adobe PDF |
| `png32` | PNG with transparency (32-bit) |
| `png8` | PNG 8-bit |
| `jpg` | JPEG |
| `gif` | GIF |
| `eps` | Encapsulated PostScript |
| `svg` | Scalable Vector Graphics |
| `svgz` | Compressed SVG |

### Map-Only Export (No Layout)

```javascript
const template = new PrintTemplate({
  format: "png32",
  layout: "map-only",
  exportOptions: {
    width: 1920,
    height: 1080,
    dpi: 96
  }
});
```

### Screenshot as Alternative

For quick exports without a print service:

```javascript
const screenshot = await view.takeScreenshot({
  format: "png",
  width: 1920,
  height: 1080,
  quality: 90
});

// Download
const link = document.createElement("a");
link.download = "map-screenshot.png";
link.href = screenshot.dataUrl;
link.click();
```

## Elevation Profile

### Elevation Profile Component

```html
<arcgis-scene>
  <arcgis-elevation-profile slot="top-right"></arcgis-elevation-profile>
</arcgis-scene>
```

### Elevation Profile Widget (Core API)

```javascript
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile.js";

const elevationProfile = new ElevationProfile({
  view: view,
  profiles: [
    { type: "ground" },
    { type: "view" }
  ]
});

view.ui.add(elevationProfile, "top-right");
```

## Identify

### Identify on MapImageLayer

```javascript
import * as identify from "@arcgis/core/rest/identify.js";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters.js";

const identifyURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/MtBaldy_BaseMap/MapServer";

const params = new IdentifyParameters({
  tolerance: 3,
  layerIds: [0, 1, 2, 3, 4],
  layerOption: "top", // "top", "visible", "all"
  width: view.width,
  height: view.height
});

view.on("click", async (event) => {
  params.geometry = event.mapPoint;
  params.mapExtent = view.extent;

  const response = await identify.identify(identifyURL, params);

  const features = response.results.map(result => {
    const feature = result.feature;
    feature.attributes.layerName = result.layerName;
    feature.popupTemplate = {
      title: result.layerName,
      content: "{*}"
    };
    return feature;
  });

  if (features.length > 0) {
    view.openPopup({
      features: features,
      location: event.mapPoint
    });
  }
});
```

## Find

### Find Service

```javascript
import * as find from "@arcgis/core/rest/find.js";
import FindParameters from "@arcgis/core/rest/support/FindParameters.js";

const findUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";

const params = new FindParameters({
  searchText: "California",
  layerIds: [0, 1, 2],
  searchFields: ["STATE_NAME", "NAME"],
  returnGeometry: true
});

const result = await find.find(findUrl, params);

result.results.forEach(r => {
  console.log(r.feature.attributes);
});
```

## Reference Samples

- `widgets-measurement` - Distance and area measurement tools
- `widgets-measurement-3d` - 3D measurement tools
- `widgets-print` - Print widget for map export
- `widgets-directions` - Directions widget for routing
- `swipe` - Swipe widget for comparing layers
- `coordinate-conversion` - Coordinate conversion utility
- `bookmarks` - Bookmarks navigation
- `elevation-profile` - Elevation profile widget

## Common Pitfalls

1. **API Key for routing**: Route service requires a valid API key or authenticated user.

2. **Identify tolerance**: Set appropriate tolerance based on zoom level. Low tolerance at high zoom levels may miss features.

3. **Swipe layer order**: Leading/trailing layers must be in the map's layers collection before assigning them to the swipe widget.

4. **Measurement units**: Use different measurement widgets for 2D and 3D views. The unified `Measurement` widget auto-selects based on `view.type`.

5. **Print service URL**: The default Esri print service URL may require authentication. Custom print services need their own URLs configured.

6. **Coordinate Conversion inside map**: Must be placed as a child of `<arcgis-map>` with a slot, or use `reference-element` when outside.

## Related Skills

- See `arcgis-widgets-ui` for basic UI widgets and Calcite layout
- See `arcgis-widgets-advanced` for specialized widgets
- See `arcgis-rest-services` for REST API query and analysis tools
- See `arcgis-spatial-analysis` for server-side analysis operations
