---
name: arcgis-geometry-operations
description: Create, manipulate, and analyze geometries using geometry classes and geometry operators. Use for spatial calculations, geometry creation, buffering, intersections, unions, and mesh operations.
---

# ArcGIS Geometry Operations

Use this skill for creating geometries and performing spatial operations with geometry operators.

> **Important:** The `geometryEngine` and `geometryEngineAsync` modules were removed in v5.0 (deprecated since 4.29). Use geometry operators exclusively.

## Import Patterns

### Direct ESM Imports
```javascript
import Point from "@arcgis/core/geometry/Point.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
```

### Dynamic Imports (CDN)
```javascript
const Point = await $arcgis.import("@arcgis/core/geometry/Point.js");
const [bufferOperator, unionOperator] = await $arcgis.import([
  "@arcgis/core/geometry/operators/bufferOperator.js",
  "@arcgis/core/geometry/operators/unionOperator.js"
]);
```

## Geometry Classes Overview

| Class | Use Case | Import Path |
|-------|----------|-------------|
| Point | Single location (x, y, z, m) | `geometry/Point.js` |
| Polyline | Lines and paths | `geometry/Polyline.js` |
| Polygon | Areas with rings | `geometry/Polygon.js` |
| Multipoint | Collection of points | `geometry/Multipoint.js` |
| Extent | Bounding box | `geometry/Extent.js` |
| Circle | Circular geometry | `geometry/Circle.js` |
| Mesh | 3D mesh with vertices and faces | `geometry/Mesh.js` |

## Creating Geometries

### Point

```javascript
// Using autocast (plain object)
const point = {
  type: "point",
  longitude: -118.80657,
  latitude: 34.02749,
  z: 1000,
  spatialReference: { wkid: 4326 }
};

// Using x, y coordinates (projected)
const point = {
  type: "point",
  x: -13044706,
  y: 4036320,
  spatialReference: { wkid: 102100 }
};
```

### Polyline

```javascript
const polyline = {
  type: "polyline",
  paths: [
    [[-118.821, 34.014], [-118.815, 34.014], [-118.809, 34.010]]
  ],
  spatialReference: { wkid: 4326 }
};

// Multi-path
const multiPath = {
  type: "polyline",
  paths: [
    [[-118.821, 34.014], [-118.815, 34.014]],
    [[-118.815, 34.022], [-118.813, 34.022]]
  ]
};
```

### Polygon

```javascript
const polygon = {
  type: "polygon",
  rings: [
    // Outer ring (clockwise)
    [[-118.818, 34.020], [-118.807, 34.020],
     [-118.807, 34.029], [-118.818, 34.029],
     [-118.818, 34.020]],
    // Inner ring/hole (counter-clockwise)
    [[-118.815, 34.022], [-118.810, 34.022],
     [-118.810, 34.026], [-118.815, 34.026],
     [-118.815, 34.022]]
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
  geodesic: true,
  spatialReference: { wkid: 4326 }
});
```

### Multipoint

```javascript
const multipoint = {
  type: "multipoint",
  points: [
    [-118.821, 34.014],
    [-118.815, 34.014],
    [-118.809, 34.010]
  ],
  spatialReference: { wkid: 4326 }
};
```

## Geometry Operators

Each operator is imported individually for tree-shaking. Some operators require `await operator.load()` before use.

### Buffer Operations

```javascript
import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";

await bufferOperator.load();

// Simple buffer (distance in meters by default)
const buffered = bufferOperator.execute(point, 1000);

// Buffer with unit
const buffered = bufferOperator.execute(point, 500, { unit: "meters" });

// Geodesic buffer (for geographic coordinates)
import geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";

await geodesicBufferOperator.load();
const geoBuffered = geodesicBufferOperator.execute(point, 1000, { unit: "meters" });
```

### Spatial Relationships

All relationship operators return a boolean.

```javascript
import containsOperator from "@arcgis/core/geometry/operators/containsOperator.js";
import withinOperator from "@arcgis/core/geometry/operators/withinOperator.js";
import intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";
import crossesOperator from "@arcgis/core/geometry/operators/crossesOperator.js";
import overlapsOperator from "@arcgis/core/geometry/operators/overlapsOperator.js";
import touchesOperator from "@arcgis/core/geometry/operators/touchesOperator.js";
import disjointOperator from "@arcgis/core/geometry/operators/disjointOperator.js";
import equalsOperator from "@arcgis/core/geometry/operators/equalsOperator.js";

// Contains - geometry1 completely contains geometry2
containsOperator.execute(polygon, point); // boolean

// Within - geometry1 is completely within geometry2
withinOperator.execute(point, polygon); // boolean

// Intersects - geometries share any space
intersectsOperator.execute(polygon1, polygon2); // boolean

// Crosses, Overlaps, Touches, Disjoint, Equals
crossesOperator.execute(line, polygon);
overlapsOperator.execute(polygon1, polygon2);
touchesOperator.execute(polygon1, polygon2);
disjointOperator.execute(polygon1, polygon2);
equalsOperator.execute(geom1, geom2);
```

### Set Operations

```javascript
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js";
import symmetricDifferenceOperator from "@arcgis/core/geometry/operators/symmetricDifferenceOperator.js";
import clipOperator from "@arcgis/core/geometry/operators/clipOperator.js";

// Union - combine geometries
const combined = unionOperator.execute([polygon1, polygon2, polygon3]);

// Intersection - common area
const common = intersectionOperator.execute(polygon1, polygon2);

// Difference - subtract geometry2 from geometry1
const diff = differenceOperator.execute(polygon1, polygon2);

// Symmetric Difference - areas in either but not both
const symDiff = symmetricDifferenceOperator.execute(polygon1, polygon2);

// Clip - clip geometry by extent
const clipped = clipOperator.execute(polygon, extent);
```

### Measurements

```javascript
import areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
import geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";
import lengthOperator from "@arcgis/core/geometry/operators/lengthOperator.js";
import geodeticLengthOperator from "@arcgis/core/geometry/operators/geodeticLengthOperator.js";
import distanceOperator from "@arcgis/core/geometry/operators/distanceOperator.js";
import geodeticDistanceOperator from "@arcgis/core/geometry/operators/geodeticDistanceOperator.js";

// Area (polygons)
const area = areaOperator.execute(polygon);
const geoArea = geodeticAreaOperator.execute(polygon, { unit: "square-kilometers" });

// Length (polylines)
const length = lengthOperator.execute(polyline);
const geoLength = geodeticLengthOperator.execute(polyline, { unit: "kilometers" });

// Distance between geometries
const dist = distanceOperator.execute(point1, point2);
const geoDist = geodeticDistanceOperator.execute(point1, point2, { unit: "kilometers" });
```

### Geometry Manipulation

```javascript
import simplifyOperator from "@arcgis/core/geometry/operators/simplifyOperator.js";
import generalizeOperator from "@arcgis/core/geometry/operators/generalizeOperator.js";
import densifyOperator from "@arcgis/core/geometry/operators/densifyOperator.js";
import offsetOperator from "@arcgis/core/geometry/operators/offsetOperator.js";
import convexHullOperator from "@arcgis/core/geometry/operators/convexHullOperator.js";
import centroidOperator from "@arcgis/core/geometry/operators/centroidOperator.js";
import labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";

// Simplify - remove self-intersections
const simplified = simplifyOperator.execute(polygon);

// Generalize - reduce vertices
const generalized = generalizeOperator.execute(polyline, {
  maxDeviation: 100,
  unit: "meters"
});

// Densify - add vertices
const densified = densifyOperator.execute(polyline, {
  maxSegmentLength: 100,
  unit: "meters"
});

// Offset - create parallel geometry
const offsetGeom = offsetOperator.execute(polyline, {
  distance: 50,
  unit: "meters",
  joinType: "round"
});

// Convex Hull
const hull = convexHullOperator.execute(polygon);

// Centroid
const center = centroidOperator.execute(polygon);

// Label Point (guaranteed inside polygon)
const label = labelPointOperator.execute(polygon);
```

### Available Operators

| Category | Operators |
|----------|-----------|
| Relationship | `containsOperator`, `crossesOperator`, `disjointOperator`, `equalsOperator`, `intersectsOperator`, `isNearOperator`, `overlapsOperator`, `relateOperator`, `touchesOperator`, `withinOperator` |
| Set Operations | `clipOperator`, `cutOperator`, `differenceOperator`, `intersectionOperator`, `symmetricDifferenceOperator`, `unionOperator` |
| Buffer | `bufferOperator`, `geodesicBufferOperator`, `graphicBufferOperator` |
| Shape | `autoCompleteOperator`, `boundaryOperator`, `convexHullOperator`, `simplifyOperator`, `simplifyOGCOperator`, `alphaShapeOperator`, `minimumBoundingCircleOperator` |
| Measurement | `areaOperator`, `geodeticAreaOperator`, `lengthOperator`, `geodeticLengthOperator`, `distanceOperator`, `geodeticDistanceOperator` |
| Transform | `densifyOperator`, `geodeticDensifyOperator`, `generalizeOperator`, `offsetOperator`, `affineTransformOperator`, `reshapeOperator`, `extendOperator` |
| Analysis | `centroidOperator`, `labelPointOperator`, `proximityOperator`, `geodesicProximityOperator` |
| Projection | `projectOperator`, `shapePreservingProjectOperator` |
| Conversion | `linesToPolygonsOperator`, `multiPartToSinglePartOperator`, `polygonSlicerOperator`, `polygonOverlayOperator` |

## Projection (projectOperator)

```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

await projectOperator.load();

// Project to new spatial reference
const projected = projectOperator.execute(geometry, { wkid: 4326 });

// With geographic transformation
const projected = projectOperator.execute(geometry, { wkid: 4326 }, {
  geographicTransformation: {
    steps: [{ wkid: 108190 }]
  }
});
```

> For details on coordinate systems and transformations, see `arcgis-coordinates-projection`.

## Web Mercator Utilities

```javascript
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";

const webMercatorGeom = webMercatorUtils.geographicToWebMercator(geographicPoint);
const geoGeom = webMercatorUtils.webMercatorToGeographic(webMercatorPoint);
const canProject = webMercatorUtils.canProject(geom1.spatialReference, geom2.spatialReference);
```

## Mesh (3D Geometry)

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

const cylinder = Mesh.createCylinder(location, {
  size: { width: 50, height: 100 },
  material: { color: "green" }
});

// Load from glTF/GLB
const mesh = await Mesh.createFromGLTF(location, "model.glb");
```

## JSON Utilities

```javascript
import jsonUtils from "@arcgis/core/geometry/support/jsonUtils.js";

// Create geometry from JSON
const geometry = jsonUtils.fromJSON({
  rings: [[[-118.8, 34.0], [-118.7, 34.0], [-118.7, 34.1], [-118.8, 34.1], [-118.8, 34.0]]],
  spatialReference: { wkid: 4326 }
});

// Get JSON from geometry
const json = geometry.toJSON();
```

## Common Patterns

### Check if Point is in Polygon

```javascript
import containsOperator from "@arcgis/core/geometry/operators/containsOperator.js";

function isPointInPolygon(point, polygon) {
  return containsOperator.execute(polygon, point);
}
```

### Buffer and Query

```javascript
import geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";

async function queryWithinDistance(point, distance, layer) {
  await geodesicBufferOperator.load();
  const bufferGeom = geodesicBufferOperator.execute(point, distance, { unit: "meters" });
  const query = layer.createQuery();
  query.geometry = bufferGeom;
  query.spatialRelationship = "contains";
  return await layer.queryFeatures(query);
}
```

### Calculate Total Area

```javascript
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";

function calculateTotalArea(polygons) {
  const combined = unionOperator.execute(polygons);
  return geodeticAreaOperator.execute(combined, { unit: "square-kilometers" });
}
```

## Common Pitfalls

1. **Spatial reference mismatch**: Always ensure geometries are in the same spatial reference before operations:
   ```javascript
   import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
   await projectOperator.load();
   if (!geom1.spatialReference.equals(geom2.spatialReference)) {
     geom2 = projectOperator.execute(geom2, geom1.spatialReference);
   }
   ```

2. **Geodesic vs planar**: Use geodesic operators for geographic coordinates (WGS84/4326). Use planar operators for projected coordinate systems:
   ```javascript
   const bufferOp = geometry.spatialReference.isGeographic
     ? geodesicBufferOperator
     : bufferOperator;
   ```

3. **Ring orientation**: Outer rings must be clockwise, holes counter-clockwise. Use `simplifyOperator` if unsure.

4. **Self-intersecting polygons**: Use `simplifyOperator.execute(polygon)` before operations on user-drawn polygons.

5. **Forgetting to load operators**: Some operators require `await operator.load()` before calling `.execute()`. Check operator documentation.

6. **Using removed `geometryEngine`**: The `geometryEngine` and `geometryEngineAsync` modules were removed in 5.0. Use individual operators instead.

## Reference Samples

- `ge-geodesicbuffer` - Geodesic buffer operations
- `gx-geodesicbuffer` - Geodesic buffer (alternate)
- `geometry-operator-centroid` - Computing geometry centroids
- `geometry-operator-offset-visualizer` - Visualizing geometry offsets
- `geometry-operator-proximity` - Proximity analysis with geometry operators
- `geometry-operator-worker` - Running geometry operations in a web worker
- `geometry-mesh-primitives` - 3D mesh primitive creation
- `geometry-mesh-elevation` - 3D mesh with elevation

## Related Skills

- See `arcgis-coordinates-projection` for coordinate systems, projection details, and coordinate formatting.
- See `arcgis-rest-services` for server-side geometry operations via geometry service.
- See `arcgis-spatial-analysis` for analysis objects and feature reduction.
