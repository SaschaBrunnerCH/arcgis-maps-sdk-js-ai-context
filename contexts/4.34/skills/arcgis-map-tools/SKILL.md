---
name: arcgis-map-tools
description: Interactive map tools including swipe comparison, measurement, identify, and routing. Use for layer comparison, distance/area measurement, and navigation services.
---

# ArcGIS Map Tools

Use this skill for swipe comparison, measurement tools, identify operations, and routing services.

## Swipe Widget

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

### Swipe Widget (Core API) - Deprecated

> **DEPRECATED since 4.32:** Use the `arcgis-swipe` component shown above instead. For information on widget deprecation, see [Esri's move to web components](https://developers.arcgis.com/javascript/latest/components-transition-plan/).

```javascript
// DEPRECATED - Use arcgis-swipe component instead
import Swipe from "@arcgis/core/widgets/Swipe.js";

const swipe = new Swipe({
  view: view,
  leadingLayers: [layer1],
  trailingLayers: [layer2],
  position: 50,  // Percentage from left
  direction: "horizontal"  // or "vertical"
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

const measurement = new Measurement({
  view: view
});

view.ui.add(measurement, "bottom-right");

// Activate distance measurement
// For 2D: "distance", For 3D: "direct-line"
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

// Distance measurement
const distanceWidget = new DistanceMeasurement2D({
  view: view,
  unit: "kilometers"
});
view.ui.add(distanceWidget, "top-right");

// Area measurement
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

// Direct line measurement (3D)
const lineWidget = new DirectLineMeasurement3D({
  view: sceneView,
  unit: "meters"
});

// Area measurement (3D)
const areaWidget = new AreaMeasurement3D({
  view: sceneView,
  unit: "square-meters"
});
```

## Identify

### Identify on MapImageLayer
```javascript
import * as identify from "@arcgis/core/rest/identify.js";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters.js";

const identifyURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/MtBaldy_BaseMap/MapServer";

// Set up parameters
const params = new IdentifyParameters({
  tolerance: 3,
  layerIds: [0, 1, 2, 3, 4],
  layerOption: "top",  // "top", "visible", "all"
  width: view.width,
  height: view.height
});

// Execute on click
view.on("click", async (event) => {
  params.geometry = event.mapPoint;
  params.mapExtent = view.extent;

  const response = await identify.identify(identifyURL, params);

  const features = response.results.map(result => {
    const feature = result.feature;
    feature.attributes.layerName = result.layerName;

    // Set popup template based on layer
    if (result.layerName === "Roads") {
      feature.popupTemplate = {
        title: "Road",
        content: "<b>Length:</b> {Shape_Length}"
      };
    }
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

## Routing

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

  // Solve route when 2+ stops
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

### Route with Options
```javascript
const routeParams = new RouteParameters({
  apiKey: "YOUR_API_KEY",
  stops: new FeatureSet({ features: stopGraphics }),
  returnDirections: true,
  directionsLanguage: "en",
  returnRoutes: true,
  returnStops: true,
  impedanceAttribute: "TravelTime",  // or "Miles", "Kilometers"
  restrictionAttributes: ["Avoid Toll Roads"],
  outSpatialReference: { wkid: 4326 }
});

const result = await route.solve(routeUrl, routeParams);

// Get directions
const directions = result.routeResults[0].directions;
directions.features.forEach(feature => {
  console.log(feature.attributes.text);
});
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
  view: view,
  apiKey: "YOUR_API_KEY"
});

view.ui.add(directions, "top-right");
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

### Print Service
```javascript
import * as print from "@arcgis/core/rest/print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";

const printUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

const template = new PrintTemplate({
  format: "pdf",
  layout: "a4-landscape",
  layoutOptions: {
    titleText: "My Map",
    authorText: "Author Name"
  }
});

const params = new PrintParameters({
  view: view,
  template: template
});

const result = await print.execute(printUrl, params);
console.log("PDF URL:", result.url);
```

### PrintTemplate Configuration

```javascript
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";

const template = new PrintTemplate({
  // Output format
  format: "pdf",  // pdf, png32, png8, jpg, gif, eps, svg, svgz

  // Layout template name (from print service)
  layout: "a4-landscape",  // Or custom layout name

  // Export options for map-only output
  exportOptions: {
    width: 800,
    height: 600,
    dpi: 300
  },

  // Layout customization
  layoutOptions: {
    titleText: "Map Title",
    authorText: "Created by",
    copyrightText: "Copyright 2024",
    scalebarUnit: "Kilometers",  // Kilometers, Miles
    legendLayers: [],  // Layers to include in legend
    customTextElements: [
      { customText: "Custom field value" }
    ]
  },

  // Preserve scale or extent
  outScale: 50000,  // Fixed scale
  scalePreserved: true,  // Maintain current scale

  // Include attribution
  attributionVisible: true
});
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
  layout: "map-only",  // No layout template
  exportOptions: {
    width: 1920,
    height: 1080,
    dpi: 96
  }
});
```

### High-Resolution Export

```javascript
const template = new PrintTemplate({
  format: "pdf",
  layout: "a3-landscape",
  exportOptions: {
    dpi: 300  // High DPI for print quality
  },
  layoutOptions: {
    titleText: "High Resolution Map",
    scalebarUnit: "Miles"
  },
  scalePreserved: true
});
```

### Print with Custom Extent

```javascript
const template = new PrintTemplate({
  format: "pdf",
  layout: "letter-ansi-a-landscape",
  outScale: 24000  // 1:24000 scale
});

const params = new PrintParameters({
  view: view,
  template: template,
  extraParameters: {
    // Custom extent (optional)
    extent: {
      xmin: -117.2,
      ymin: 34.0,
      xmax: -117.1,
      ymax: 34.1,
      spatialReference: { wkid: 4326 }
    }
  }
});
```

### Print Widget (Core API)
```javascript
import Print from "@arcgis/core/widgets/Print.js";

const print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});

view.ui.add(print, "top-right");
```

### Print Widget Configuration (Core API)

```javascript
import Print from "@arcgis/core/widgets/Print.js";

const print = new Print({
  view: view,
  printServiceUrl: printUrl,

  // Allowed formats
  allowedFormats: ["pdf", "png32", "jpg"],

  // Allowed layouts
  allowedLayouts: ["a4-landscape", "a4-portrait", "letter-ansi-a-landscape"],

  // Default template settings
  templateOptions: {
    title: "Default Map Title",
    author: "Default Author",
    copyright: "Copyright 2024",
    scaleEnabled: true,
    attributionEnabled: true
  },

  // Include legend
  includeDefaultTemplates: true
});
```

### Print Widget State

```javascript
// Track print widget state
import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.watch(
  () => printWidget.viewModel.state,
  (state) => {
    console.log("Print state:", state);  // ready, printing, complete, error
  }
);
```

### Custom Print Workflow

```javascript
async function printMap(view, options = {}) {
  const {
    title = "Map Export",
    format = "pdf",
    layout = "a4-landscape",
    dpi = 150
  } = options;

  const template = new PrintTemplate({
    format,
    layout,
    exportOptions: { dpi },
    layoutOptions: {
      titleText: title,
      authorText: "Generated by Web App",
      copyrightText: `Exported: ${new Date().toLocaleDateString()}`
    }
  });

  const params = new PrintParameters({
    view,
    template
  });

  try {
    const result = await print.execute(printUrl, params);
    return result.url;
  } catch (error) {
    console.error("Print failed:", error);
    throw error;
  }
}

// Usage
const pdfUrl = await printMap(view, {
  title: "Project Area Map",
  format: "pdf",
  dpi: 300
});
window.open(pdfUrl, "_blank");
```

### Print with Legend Customization

```javascript
const template = new PrintTemplate({
  format: "pdf",
  layout: "a4-landscape",
  layoutOptions: {
    titleText: "Map with Custom Legend",
    // Specify which layers to include in legend
    legendLayers: [
      { layerId: featureLayer.id },
      { layerId: anotherLayer.id, sublayerIds: [0, 2] }  // Specific sublayers
    ]
  }
});
```

### Screenshot as Alternative

For quick exports without a print service:

```javascript
// Take screenshot of current view
const screenshot = await view.takeScreenshot({
  format: "png",
  width: 1920,
  height: 1080,
  quality: 90
});

// Use the data URL
const img = document.createElement("img");
img.src = screenshot.dataUrl;
document.body.appendChild(img);

// Or download
const link = document.createElement("a");
link.download = "map-screenshot.png";
link.href = screenshot.dataUrl;
link.click();
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

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
  <script src="https://js.arcgis.com/4.34/"></script>
  <script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
    #toolbar { position: absolute; top: 10px; right: 10px; }
  </style>
</head>
<body>
  <arcgis-map basemap="streets-navigation-vector" center="-117.195, 34.057" zoom="13">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
  <div id="toolbar">
    <calcite-button id="measureBtn">Measure</calcite-button>
    <calcite-button id="clearBtn">Clear</calcite-button>
  </div>

  <script type="module">
    import Measurement from "@arcgis/core/widgets/Measurement.js";

    const viewElement = document.querySelector("arcgis-map");
    await viewElement.viewOnReady();

    const measurement = new Measurement({ view: viewElement.view });
    viewElement.ui.add(measurement, "bottom-right");

    document.getElementById("measureBtn").onclick = () => {
      measurement.activeTool = "distance";
    };

    document.getElementById("clearBtn").onclick = () => {
      measurement.clear();
    };
  </script>
</body>
</html>
```

## Reference Samples

- `widgets-measurement` - Distance and area measurement tools
- `widgets-print` - Print widget for map export
- `widgets-directions` - Directions widget for routing
- `swipe` - Swipe widget for comparing layers
- `identify` - Identify features on the map

## Common Pitfalls

1. **API Key for routing**: Route service requires valid API key or authenticated user

2. **Identify tolerance**: Set appropriate tolerance based on zoom level

3. **Swipe layer order**: Leading/trailing layers must be in the map's layers collection

4. **Measurement units**: Set appropriate units for the measurement context

5. **3D vs 2D measurement**: Use different widgets/tools for 2D and 3D views

