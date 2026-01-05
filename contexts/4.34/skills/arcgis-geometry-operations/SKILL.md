---
name: arcgis-geometry-operations
description: Create, manipulate, and analyze geometries using geometry classes and geometry operators. Use for spatial calculations, geometry creation, buffering, intersections, unions, and mesh operations.
---

# ArcGIS Geometry Operations

Use this skill for creating geometries and performing spatial operations with the modern geometry operators module.

> **Important:** The `geometryEngine` and `geometryEngineAsync` modules are **deprecated** as of version 4.29. Use the geometry operators module instead. See the [Deprecation Notice](#deprecated-geometryengine) section for migration guidance.

## Geometry Classes Overview

| Class | Use Case |
|-------|----------|
| Point | Single location (x, y, z, m) |
| Polyline | Lines and paths |
| Polygon | Areas with rings |
| Multipoint | Collection of points |
| Extent | Bounding box |
| Circle | Circular geometry |
| Mesh | 3D mesh with vertices and faces |

## Creating Geometries

### Point
```javascript
const point = {
  type: "point",
  longitude: -118.80657,
  latitude: 34.02749,
  z: 1000,           // Optional elevation
  m: 0,              // Optional measure
  spatialReference: { wkid: 4326 }
};

// Or using x, y coordinates
const point = {
  type: "point",
  x: -13044706,
  y: 4036320,
  spatialReference: { wkid: 102100 } // Web Mercator
};
```

### Polyline
```javascript
const polyline = {
  type: "polyline",
  paths: [
    [[-118.821527, 34.0139576], [-118.814893, 34.0137161]],  // First path
    [[-118.8148893, 34.0215816], [-118.813120, 34.0215816]]  // Second path
  ],
  spatialReference: { wkid: 4326 }
};

// Single path
const line = {
  type: "polyline",
  paths: [
    [-118.821527, 34.0139576],
    [-118.814893, 34.0137161],
    [-118.808878, 34.0102256]
  ]
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
     [-118.818984, 34.01991]],
    // Inner ring/hole (counter-clockwise) - optional
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
  xmin: -118.82,
  ymin: 34.01,
  xmax: -118.80,
  ymax: 34.03,
  spatialReference: { wkid: 4326 }
};
```

### Circle
```javascript
import Circle from "@arcgis/core/geometry/Circle.js";

const circle = new Circle({
  center: [-118.80657, 34.02749],
  radius: 1000,
  radiusUnit: "meters",  // feet, kilometers, miles, nautical-miles, yards
  geodesic: true,
  spatialReference: { wkid: 4326 }
});
```

### Multipoint
```javascript
const multipoint = {
  type: "multipoint",
  points: [
    [-118.821527, 34.0139576],
    [-118.814893, 34.0137161],
    [-118.808878, 34.0102256]
  ],
  spatialReference: { wkid: 4326 }
};
```

## Geometry Operators (Modern API)

The geometry operators module is the modern, recommended approach for geometry operations. Each operator is imported individually for better tree-shaking and performance.

### Importing Operators

```javascript
// Import specific operators as needed
import buffer from "@arcgis/core/geometry/operators/buffer.js";
import union from "@arcgis/core/geometry/operators/union.js";
import intersects from "@arcgis/core/geometry/operators/intersects.js";

// Or import multiple at once
import buffer from "@arcgis/core/geometry/operators/buffer.js";
import union from "@arcgis/core/geometry/operators/union.js";
import contains from "@arcgis/core/geometry/operators/contains.js";
import difference from "@arcgis/core/geometry/operators/difference.js";
```

### Buffer Operations

```javascript
import buffer from "@arcgis/core/geometry/operators/buffer.js";

// Simple buffer
const buffered = buffer.execute(point, 1000);  // 1000 meters

// Buffer with options
const buffered = buffer.execute(point, {
  distance: 500,
  unit: "meters"  // feet, kilometers, miles, nautical-miles, yards
});

// Buffer multiple geometries
const buffered = buffer.execute([point1, point2, point3], 1000);

// Geodesic buffer (for geographic coordinates)
import geodesicBuffer from "@arcgis/core/geometry/operators/geodesicBuffer.js";
const geoBuffered = geodesicBuffer.execute(point, {
  distance: 1000,
  unit: "meters"
});
```

### Spatial Relationships

```javascript
// Contains - geometry1 completely contains geometry2
import contains from "@arcgis/core/geometry/operators/contains.js";
const result = contains.execute(polygon, point);  // returns boolean

// Within - geometry1 is completely within geometry2
import within from "@arcgis/core/geometry/operators/within.js";
const result = within.execute(point, polygon);  // returns boolean

// Intersects - geometries share any space
import intersects from "@arcgis/core/geometry/operators/intersects.js";
const result = intersects.execute(polygon1, polygon2);  // returns boolean

// Crosses - geometries cross each other
import crosses from "@arcgis/core/geometry/operators/crosses.js";
const result = crosses.execute(line, polygon);  // returns boolean

// Overlaps - geometries share some but not all space
import overlaps from "@arcgis/core/geometry/operators/overlaps.js";
const result = overlaps.execute(polygon1, polygon2);  // returns boolean

// Touches - geometries share boundary but not interior
import touches from "@arcgis/core/geometry/operators/touches.js";
const result = touches.execute(polygon1, polygon2);  // returns boolean

// Disjoint - geometries don't share any space
import disjoint from "@arcgis/core/geometry/operators/disjoint.js";
const result = disjoint.execute(polygon1, polygon2);  // returns boolean

// Equals - geometries are identical
import equals from "@arcgis/core/geometry/operators/equals.js";
const result = equals.execute(geom1, geom2);  // returns boolean
```

### Set Operations

```javascript
// Union - combine geometries
import union from "@arcgis/core/geometry/operators/union.js";
const combined = union.execute([polygon1, polygon2, polygon3]);

// Intersection - common area between geometries
import intersection from "@arcgis/core/geometry/operators/intersection.js";
const common = intersection.execute(polygon1, polygon2);

// Difference - subtract geometry2 from geometry1
import difference from "@arcgis/core/geometry/operators/difference.js";
const diff = difference.execute(polygon1, polygon2);

// Symmetric Difference - areas in either but not both
import symmetricDifference from "@arcgis/core/geometry/operators/symmetricDifference.js";
const symDiff = symmetricDifference.execute(polygon1, polygon2);

// Clip - clip geometry by envelope
import clip from "@arcgis/core/geometry/operators/clip.js";
const clipped = clip.execute(polygon, extent);
```

### Measurements

```javascript
// Area (for polygons)
import area from "@arcgis/core/geometry/operators/area.js";
const areaValue = area.execute(polygon);  // square meters

import geodesicArea from "@arcgis/core/geometry/operators/geodesicArea.js";
const geoArea = geodesicArea.execute(polygon, { unit: "square-kilometers" });

// Length (for polylines)
import length from "@arcgis/core/geometry/operators/length.js";
const lengthValue = length.execute(polyline);  // meters

import geodesicLength from "@arcgis/core/geometry/operators/geodesicLength.js";
const geoLength = geodesicLength.execute(polyline, { unit: "kilometers" });

// Distance between geometries
import distance from "@arcgis/core/geometry/operators/distance.js";
const dist = distance.execute(point1, point2);  // meters
```

### Geometry Manipulation

```javascript
// Simplify - remove self-intersections
import simplify from "@arcgis/core/geometry/operators/simplify.js";
const simplified = simplify.execute(polygon);

// Generalize - reduce vertices
import generalize from "@arcgis/core/geometry/operators/generalize.js";
const generalized = generalize.execute(polyline, {
  maxDeviation: 100,
  unit: "meters"
});

// Densify - add vertices
import densify from "@arcgis/core/geometry/operators/densify.js";
const densified = densify.execute(polyline, {
  maxSegmentLength: 100,
  unit: "meters"
});

// Offset - create parallel geometry
import offset from "@arcgis/core/geometry/operators/offset.js";
const offsetGeom = offset.execute(polyline, {
  distance: 50,
  unit: "meters",
  joinType: "round"  // round, bevel, miter
});

// Convex Hull
import convexHull from "@arcgis/core/geometry/operators/convexHull.js";
const hull = convexHull.execute(polygon);
const multiHull = convexHull.execute([point1, point2, point3]);

// Centroid
import centroid from "@arcgis/core/geometry/operators/centroid.js";
const center = centroid.execute(polygon);

// Label Point (guaranteed inside polygon)
import labelPoint from "@arcgis/core/geometry/operators/labelPoint.js";
const label = labelPoint.execute(polygon);
```

### Available Operators

| Category | Operators |
|----------|-----------|
| Relationship | `contains`, `crosses`, `disjoint`, `equals`, `intersects`, `overlaps`, `relate`, `touches`, `within` |
| Set Operations | `clip`, `cut`, `difference`, `intersection`, `symmetricDifference`, `union` |
| Buffer | `buffer`, `geodesicBuffer` |
| Shape | `autoComplete`, `boundary`, `convexHull`, `simplify` |
| Measurement | `area`, `geodesicArea`, `length`, `geodesicLength`, `distance` |
| Transform | `densify`, `generalize`, `offset`, `project`, `rotate` |
| Analysis | `centroid`, `labelPoint`, `nearestCoordinate`, `nearestVertex` |

## Projection (projectOperator)

```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

// Load projection engine (required before projecting)
await projectOperator.load();

// Project geometry to new spatial reference
const projected = projectOperator.execute(geometry, {
  outSpatialReference: { wkid: 4326 }
});

// Project with geographic transformation
const projectedWithTransform = projectOperator.execute(geometry, {
  outSpatialReference: { wkid: 4326 },
  geographicTransformation: {
    steps: [{ wkid: 108190 }]  // NAD_1983_To_WGS_1984_5
  }
});

// Get available transformations
const transformations = projectOperator.getTransformations(
  inSpatialReference,
  outSpatialReference
);
```

> **Note:** The legacy `projection` module is deprecated since 4.32. Use `projectOperator` instead.

## Web Mercator Utilities

```javascript
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";

// Convert to Web Mercator
const webMercatorGeom = webMercatorUtils.geographicToWebMercator(geographicPoint);

// Convert to Geographic
const geoGeom = webMercatorUtils.webMercatorToGeographic(webMercatorPoint);

// Check if can project
const canProject = webMercatorUtils.canProject(geom1.spatialReference, geom2.spatialReference);
```

## Mesh (3D Geometry)

Mesh is used for complex 3D surfaces with vertices and faces.

```javascript
import Mesh from "@arcgis/core/geometry/Mesh.js";

// Create mesh from primitives
const box = Mesh.createBox(location, {
  size: { width: 100, height: 100, depth: 50 },
  material: { color: "red" }
});

const sphere = Mesh.createSphere(location, {
  size: 50,
  densificationFactor: 2,
  material: { color: "blue" }
});

const cylinder = Mesh.createCylinder(location, {
  size: { width: 50, height: 100 },
  material: { color: "green" }
});

// Load from glTF/GLB
const mesh = await Mesh.createFromGLTF(location, {
  url: "model.glb"
});
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
import contains from "@arcgis/core/geometry/operators/contains.js";

function isPointInPolygon(point, polygon) {
  return contains.execute(polygon, point);
}
```

### Create Buffer and Query
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

### Calculate Total Area
```javascript
import union from "@arcgis/core/geometry/operators/union.js";
import geodesicArea from "@arcgis/core/geometry/operators/geodesicArea.js";

function calculateTotalArea(polygons) {
  const combined = union.execute(polygons);
  return geodesicArea.execute(combined, { unit: "square-kilometers" });
}
```

## Common Pitfalls

1. **Spatial Reference Mismatch**: Always ensure geometries are in the same spatial reference before operations
   ```javascript
   // Project if needed
   if (!geom1.spatialReference.equals(geom2.spatialReference)) {
     geom2 = projection.project(geom2, geom1.spatialReference);
   }
   ```

2. **Geodesic vs Planar**: Use geodesic operators for geographic coordinates (WGS84)
   ```javascript
   // Use geodesicBuffer for lat/lon, buffer for projected coordinates
   import geodesicBuffer from "@arcgis/core/geometry/operators/geodesicBuffer.js";
   import buffer from "@arcgis/core/geometry/operators/buffer.js";
   const bufferOp = geometry.spatialReference.isGeographic ? geodesicBuffer : buffer;
   ```

3. **Ring Orientation**: Outer rings clockwise, holes counter-clockwise

4. **Self-intersecting Polygons**: Use `simplify` before operations on user-drawn polygons

5. **Load Projection Engine**: Call `projection.load()` before using `projection.project()`

---

## Deprecated: geometryEngine

> **DEPRECATED:** The `geometryEngine` and `geometryEngineAsync` modules are deprecated as of version 4.29. Use the geometry operators module (shown above) instead.

The following is kept for reference when maintaining legacy code. **Do not use for new development.**

### Migration Guide

| Deprecated (geometryEngine) | Modern (operators) |
|-----------------------------|-------------------|
| `geometryEngine.buffer(geom, dist, unit)` | `buffer.execute(geom, { distance: dist, unit })` |
| `geometryEngine.geodesicBuffer(geom, dist, unit)` | `geodesicBuffer.execute(geom, { distance: dist, unit })` |
| `geometryEngine.union([geoms])` | `union.execute([geoms])` |
| `geometryEngine.intersect(g1, g2)` | `intersection.execute(g1, g2)` |
| `geometryEngine.contains(g1, g2)` | `contains.execute(g1, g2)` |
| `geometryEngine.within(g1, g2)` | `within.execute(g1, g2)` |
| `geometryEngine.distance(g1, g2, unit)` | `distance.execute(g1, g2)` |
| `geometryEngine.planarArea(geom, unit)` | `area.execute(geom)` |
| `geometryEngine.geodesicArea(geom, unit)` | `geodesicArea.execute(geom, { unit })` |
| `geometryEngine.simplify(geom)` | `simplify.execute(geom)` |
| `geometryEngine.convexHull(geom)` | `convexHull.execute(geom)` |

### Legacy geometryEngine (Deprecated)

```javascript
// DEPRECATED - Do not use for new development
import geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

// These methods still work but will be removed in a future release
const buffer = geometryEngine.buffer(point, 1000, "meters");
const intersects = geometryEngine.intersects(polygon1, polygon2);
const union = geometryEngine.union([polygon1, polygon2]);
```

