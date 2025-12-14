---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Geometry Operations

## Geometry Classes

| Class | Use Case |
|-------|----------|
| Point | Single location |
| Polyline | Lines and paths |
| Polygon | Areas with rings |
| Multipoint | Collection of points |
| Extent | Bounding box |
| Circle | Circular geometry |
| Mesh | 3D mesh |

## Creating Geometries

### Point
```javascript
const point = {
  type: "point",
  longitude: -118.80657,
  latitude: 34.02749,
  spatialReference: { wkid: 4326 }
};
```

### Polyline
```javascript
const polyline = {
  type: "polyline",
  paths: [
    [[-118.821527, 34.0139576], [-118.814893, 34.0137161]]
  ],
  spatialReference: { wkid: 4326 }
};
```

### Polygon
```javascript
const polygon = {
  type: "polygon",
  rings: [
    // Outer ring (clockwise)
    [[-118.818984, 34.01991], [-118.806796, 34.01991],
     [-118.806796, 34.02937], [-118.818984, 34.02937],
     [-118.818984, 34.01991]]
  ],
  spatialReference: { wkid: 4326 }
};
```

### Extent
```javascript
const extent = {
  type: "extent",
  xmin: -118.82, ymin: 34.01,
  xmax: -118.80, ymax: 34.03,
  spatialReference: { wkid: 4326 }
};
```

### Circle
```javascript
import Circle from "@arcgis/core/geometry/Circle.js";

const circle = new Circle({
  center: [-118.80657, 34.02749],
  radius: 1000,
  radiusUnit: "meters",
  geodesic: true
});
```

## Geometry Operators (Modern API)

> **Note:** `geometryEngine` is deprecated since 4.29. Use geometry operators instead.

### Import Operators
```javascript
import buffer from "@arcgis/core/geometry/operators/buffer.js";
import union from "@arcgis/core/geometry/operators/union.js";
import contains from "@arcgis/core/geometry/operators/contains.js";
import intersection from "@arcgis/core/geometry/operators/intersection.js";
```

### Buffer Operations
```javascript
import buffer from "@arcgis/core/geometry/operators/buffer.js";
import geodesicBuffer from "@arcgis/core/geometry/operators/geodesicBuffer.js";

const buffered = buffer.execute(point, 1000);

const geoBuffered = geodesicBuffer.execute(point, {
  distance: 1000,
  unit: "meters"
});
```

### Spatial Relationships
```javascript
import contains from "@arcgis/core/geometry/operators/contains.js";
import within from "@arcgis/core/geometry/operators/within.js";
import intersects from "@arcgis/core/geometry/operators/intersects.js";

const result = contains.execute(polygon, point);  // boolean
const result = within.execute(point, polygon);    // boolean
const result = intersects.execute(poly1, poly2);  // boolean
```

### Set Operations
```javascript
import union from "@arcgis/core/geometry/operators/union.js";
import intersection from "@arcgis/core/geometry/operators/intersection.js";
import difference from "@arcgis/core/geometry/operators/difference.js";

const combined = union.execute([polygon1, polygon2]);
const common = intersection.execute(polygon1, polygon2);
const diff = difference.execute(polygon1, polygon2);
```

### Measurements
```javascript
import area from "@arcgis/core/geometry/operators/area.js";
import geodesicArea from "@arcgis/core/geometry/operators/geodesicArea.js";
import length from "@arcgis/core/geometry/operators/length.js";
import distance from "@arcgis/core/geometry/operators/distance.js";

const areaValue = area.execute(polygon);
const geoArea = geodesicArea.execute(polygon, { unit: "square-kilometers" });
const dist = distance.execute(point1, point2);
```

### Geometry Manipulation
```javascript
import simplify from "@arcgis/core/geometry/operators/simplify.js";
import convexHull from "@arcgis/core/geometry/operators/convexHull.js";
import centroid from "@arcgis/core/geometry/operators/centroid.js";

const simplified = simplify.execute(polygon);
const hull = convexHull.execute(polygon);
const center = centroid.execute(polygon);
```

## Projection

```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

await projectOperator.load();

const projected = projectOperator.execute(geometry, {
  outSpatialReference: { wkid: 4326 }
});
```

## Web Mercator Utilities

```javascript
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";

const webMercator = webMercatorUtils.geographicToWebMercator(geographicPoint);
const geographic = webMercatorUtils.webMercatorToGeographic(webMercatorPoint);
```

## Mesh (3D)

```javascript
import Mesh from "@arcgis/core/geometry/Mesh.js";

const box = Mesh.createBox(location, {
  size: { width: 100, height: 100, depth: 50 },
  material: { color: "red" }
});

const sphere = Mesh.createSphere(location, {
  size: 50,
  material: { color: "blue" }
});
```

## Common Patterns

### Check if Point is in Polygon
```javascript
import contains from "@arcgis/core/geometry/operators/contains.js";

function isPointInPolygon(point, polygon) {
  return contains.execute(polygon, point);
}
```

### Buffer and Query
```javascript
import geodesicBuffer from "@arcgis/core/geometry/operators/geodesicBuffer.js";

async function queryWithinDistance(point, distance, layer) {
  const buffer = geodesicBuffer.execute(point, { distance, unit: "meters" });
  const query = layer.createQuery();
  query.geometry = buffer;
  query.spatialRelationship = "contains";
  return await layer.queryFeatures(query);
}
```

## Available Operators

| Category | Operators |
|----------|-----------|
| Relationship | `contains`, `crosses`, `disjoint`, `equals`, `intersects`, `overlaps`, `touches`, `within` |
| Set Operations | `clip`, `difference`, `intersection`, `symmetricDifference`, `union` |
| Buffer | `buffer`, `geodesicBuffer` |
| Measurement | `area`, `geodesicArea`, `length`, `geodesicLength`, `distance` |
| Transform | `densify`, `generalize`, `offset`, `project`, `rotate` |
| Analysis | `centroid`, `convexHull`, `labelPoint`, `simplify` |

## Common Pitfalls

1. **Spatial reference mismatch** - Ensure geometries are in same SR before operations
2. **Geodesic vs Planar** - Use geodesic operators for geographic coordinates (WGS84)
3. **Ring orientation** - Outer rings clockwise, holes counter-clockwise
4. **Load projection engine** - Call `projectOperator.load()` before projecting
