---
name: arcgis-coordinates-projection
description: Work with coordinate systems, projections, and coordinate conversion. Use for transforming coordinates and displaying position in multiple formats.
---

# ArcGIS Coordinates and Projection

Use this skill for coordinate conversion, projection transformations, and spatial reference handling.

> **Important:** The `projection` module is **deprecated** as of version 4.32 and `geodesicUtils` is **deprecated** as of version 4.33. Use the [projectOperator](#modern-projection-operator) and [geometry operators](#modern-geometry-operators) instead. See the [Deprecation Notice](#deprecated-apis) section for migration guidance.

## Coordinate Conversion Component

### Basic Coordinate Conversion
```html
<arcgis-map basemap="topo-vector" center="-117.049, 34.485" zoom="12">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-coordinate-conversion slot="bottom-left"></arcgis-coordinate-conversion>
</arcgis-map>
```

### Coordinate Conversion Widget (Core API)
```javascript
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";

const ccWidget = new CoordinateConversion({
  view: view
});

view.ui.add(ccWidget, "bottom-left");
```

### Custom Coordinate Formats
```javascript
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";
import Format from "@arcgis/core/widgets/CoordinateConversion/support/Format.js";

// Create custom format
const customFormat = new Format({
  name: "Custom XY",
  conversionInfo: {
    spatialReference: { wkid: 4326 },
    reverseConvert: (string) => {
      const parts = string.split(",");
      return [parseFloat(parts[0]), parseFloat(parts[1])];
    }
  },
  coordinateSegments: [
    { alias: "Lon", description: "Longitude", searchPattern: "X" },
    { alias: "Lat", description: "Latitude", searchPattern: "Y" }
  ],
  defaultPattern: "X°, Y°"
});

const ccWidget = new CoordinateConversion({
  view: view,
  formats: [customFormat]
});
```

## Spatial Reference

### Create Spatial Reference
```javascript
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

// By WKID
const wgs84 = new SpatialReference({ wkid: 4326 });
const webMercator = new SpatialReference({ wkid: 102100 });

// By WKT
const customSR = new SpatialReference({
  wkt: 'PROJCS["NAD_1983_StatePlane_California_VI_FIPS_0406_Feet"...'
});
```

### Common Spatial References
```javascript
// WGS 84 (Geographic)
const wgs84 = { wkid: 4326 };

// Web Mercator (Projected)
const webMercator = { wkid: 102100 };  // or 3857

// UTM Zone 11N
const utm11n = { wkid: 32611 };

// State Plane (example)
const statePlane = { wkid: 2230 };
```

## Modern Projection Operator

Use the `projectOperator` for client-side coordinate projection (recommended).

### Project Geometry
```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

// Load projection engine (required before use)
await projectOperator.load();

// Project geometry to WGS84
const projectedGeometry = projectOperator.execute(geometry, {
  outSpatialReference: { wkid: 4326 }
});
```

### Project with Geographic Transformation
```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

await projectOperator.load();

// Project with specific transformation (e.g., NAD83 to WGS84)
const projectedGeometry = projectOperator.execute(geometry, {
  outSpatialReference: { wkid: 4326 },
  geographicTransformation: {
    steps: [{ wkid: 108190 }]  // NAD_1983_To_WGS_1984_5
  }
});
```

### Check Available Transformations
```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

await projectOperator.load();

// Get available transformations between spatial references
const transformations = projectOperator.getTransformations(
  { wkid: 4269 },  // NAD83
  { wkid: 4326 }   // WGS84
);

console.log("Available transformations:", transformations);
```

## Modern Geometry Operators

Use geometry operators for geodesic calculations (recommended).

### Geodesic Distance
```javascript
import geodesicDistance from "@arcgis/core/geometry/operators/geodesicDistanceOperator.js";

// Calculate geodesic distance between two points
const distance = geodesicDistance.execute(point1, point2, {
  unit: "kilometers"
});
```

### Geodesic Area
```javascript
import geodesicArea from "@arcgis/core/geometry/operators/geodesicAreaOperator.js";

const area = geodesicArea.execute(polygon, {
  unit: "square-kilometers"
});
```

### Geodesic Length
```javascript
import geodesicLength from "@arcgis/core/geometry/operators/geodesicLengthOperator.js";

const length = geodesicLength.execute(polyline, {
  unit: "kilometers"
});
```

### Geodesic Buffer
```javascript
import geodesicBuffer from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";

const buffer = geodesicBuffer.execute(point, {
  distance: 100,
  unit: "kilometers"
});
```

### Geodesic Densify
```javascript
import geodesicDensify from "@arcgis/core/geometry/operators/geodesicDensifyOperator.js";

const densifiedLine = geodesicDensify.execute(polyline, {
  maxSegmentLength: 10000,  // meters
  unit: "meters"
});
```

## Geometry Service Projection

### Server-Side Projection
```javascript
import geometryService from "@arcgis/core/rest/geometryService.js";
import ProjectParameters from "@arcgis/core/rest/support/ProjectParameters.js";

const gsUrl = "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";

const params = new ProjectParameters({
  geometries: [geometry],
  outSpatialReference: { wkid: 4326 }
});

const results = await geometryService.project(gsUrl, params);
const projectedGeometry = results[0];
```

## Coordinate Conversion Utilities

### Convert Coordinates
```javascript
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";

// Web Mercator to Geographic
const geographicPoint = webMercatorUtils.webMercatorToGeographic(webMercatorPoint);

// Geographic to Web Mercator
const webMercatorPoint = webMercatorUtils.geographicToWebMercator(geographicPoint);

// Check if can project
const canProject = webMercatorUtils.canProject(fromSR, toSR);
```

## Display Coordinates

### Show Mouse Coordinates
```javascript
view.on("pointer-move", (event) => {
  const mapPoint = view.toMap({ x: event.x, y: event.y });

  if (mapPoint) {
    document.getElementById("coords").textContent =
      `Lat: ${mapPoint.latitude.toFixed(6)}, Lon: ${mapPoint.longitude.toFixed(6)}`;
  }
});
```

### Format Coordinates
```javascript
import coordinateFormatter from "@arcgis/core/geometry/coordinateFormatter.js";

await coordinateFormatter.load();

// To Degrees Minutes Seconds
const dms = coordinateFormatter.toLatitudeLongitude(
  point,
  "dms",  // or "dm", "dd"
  3       // decimal places
);
// Output: "34°29'06.000\"N 117°02'56.400\"W"

// To MGRS
const mgrs = coordinateFormatter.toMgrs(
  point,
  "automatic",  // conversion mode
  5,            // precision
  false         // add spaces
);
// Output: "11SNU1234567890"

// To UTM
const utm = coordinateFormatter.toUtm(
  point,
  "north-south-indicators",
  true  // add spaces
);
// Output: "11S 500000 3800000"

// From string to point
const pointFromDMS = coordinateFormatter.fromLatitudeLongitude(
  "34°29'06\"N 117°02'56\"W"
);
```

## USNG and MGRS

### USNG Conversion
```javascript
import coordinateFormatter from "@arcgis/core/geometry/coordinateFormatter.js";

await coordinateFormatter.load();

// To USNG
const usng = coordinateFormatter.toUsng(point, 5, false);

// From USNG
const point = coordinateFormatter.fromUsng("11SNU1234567890");
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
    #coordsPanel {
      position: absolute;
      bottom: 50px;
      right: 10px;
      background: white;
      padding: 10px;
    }
  </style>
</head>
<body>
  <arcgis-map basemap="topo-vector" center="-117.049, 34.485" zoom="12">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-coordinate-conversion slot="bottom-left"></arcgis-coordinate-conversion>
  </arcgis-map>

  <div id="coordsPanel" class="esri-widget">
    <div id="latlon">Move mouse to see coordinates</div>
    <div id="utm"></div>
    <div id="mgrs"></div>
  </div>

  <script type="module">
    import coordinateFormatter from "@arcgis/core/geometry/coordinateFormatter.js";

    await coordinateFormatter.load();

    const viewElement = document.querySelector("arcgis-map");
    await viewElement.viewOnReady();

    viewElement.addEventListener("arcgisViewPointerMove", (event) => {
      const point = viewElement.view.toMap({
        x: event.detail.x,
        y: event.detail.y
      });

      if (point) {
        document.getElementById("latlon").textContent =
          `Lat/Lon: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;

        document.getElementById("utm").textContent =
          `UTM: ${coordinateFormatter.toUtm(point, "north-south-indicators", true)}`;

        document.getElementById("mgrs").textContent =
          `MGRS: ${coordinateFormatter.toMgrs(point, "automatic", 5, true)}`;
      }
    });
  </script>
</body>
</html>
```

## Common Pitfalls

1. **Load projection engine**: Must call `projectOperator.load()` before using

2. **Coordinate order**: Geographic is (lon, lat), not (lat, lon)

3. **WKID vs WKT**: Use WKID when available, WKT for custom projections

4. **Datum transformations**: May be needed for accurate results between datums

5. **Client vs server**: Use client-side for speed, server for complex transformations

---

## Deprecated APIs

> **DEPRECATED:** The APIs below are deprecated. Use the modern alternatives shown above.

### Migration Guide

| Deprecated | Modern Replacement |
|------------|-------------------|
| `projection.project(geom, sr)` | `projectOperator.execute(geom, { outSpatialReference: sr })` |
| `projection.load()` | `projectOperator.load()` |
| `projection.getTransformations(from, to)` | `projectOperator.getTransformations(from, to)` |
| `geodesicUtils.geodesicDistance(p1, p2, unit)` | `geodesicDistanceOperator.execute(p1, p2, { unit })` |
| `geodesicUtils.geodesicArea(geom, unit)` | `geodesicAreaOperator.execute(geom, { unit })` |
| `geodesicUtils.geodesicLength(geom, unit)` | `geodesicLengthOperator.execute(geom, { unit })` |

### Legacy projection Module (Deprecated since 4.32)
```javascript
// DEPRECATED - Use projectOperator instead
import projection from "@arcgis/core/geometry/projection.js";

await projection.load();

const projectedGeometry = projection.project(
  geometry,
  new SpatialReference({ wkid: 4326 })
);
```

### Legacy geodesicUtils (Deprecated since 4.33)
```javascript
// DEPRECATED - Use geodesicDistanceOperator instead
import geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils.js";

const distance = geodesicUtils.geodesicDistance(
  point1,
  point2,
  "kilometers"
);
```

