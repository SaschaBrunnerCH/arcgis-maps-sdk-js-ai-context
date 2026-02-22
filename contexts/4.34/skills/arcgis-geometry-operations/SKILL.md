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
import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";

// Or import multiple at once
import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import containsOperator from "@arcgis/core/geometry/operators/containsOperator.js";
import differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js";
```

> **Important:** Some operators require loading before use. Call `await operator.load()` before calling `.execute()`. For example: `await bufferOperator.load();` before `bufferOperator.execute(...)`. Check operator documentation for specific requirements.

### Buffer Operations

```javascript
import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";

await bufferOperator.load();

// Simple buffer (distance in meters by default)
const buffered = bufferOperator.execute(point, 1000);

// Buffer with unit option (distance is a separate parameter)
const buffered = bufferOperator.execute(point, 500, {
  unit: "meters"  // feet, kilometers, miles, nautical-miles, yards
});

// Buffer multiple geometries
const buffered = bufferOperator.execute([point1, point2, point3], 1000);

// Geodesic buffer (for geographic coordinates)
import geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";

await geodesicBufferOperator.load();
const geoBuffered = geodesicBufferOperator.execute(point, 1000, {
  unit: "meters"
});
```

### Spatial Relationships

```javascript
// Contains - geometry1 completely contains geometry2
import containsOperator from "@arcgis/core/geometry/operators/containsOperator.js";
const result = containsOperator.execute(polygon, point);  // returns boolean

// Within - geometry1 is completely within geometry2
import withinOperator from "@arcgis/core/geometry/operators/withinOperator.js";
const result = withinOperator.execute(point, polygon);  // returns boolean

// Intersects - geometries share any space
import intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";
const result = intersectsOperator.execute(polygon1, polygon2);  // returns boolean

// Crosses - geometries cross each other
import crossesOperator from "@arcgis/core/geometry/operators/crossesOperator.js";
const result = crossesOperator.execute(line, polygon);  // returns boolean

// Overlaps - geometries share some but not all space
import overlapsOperator from "@arcgis/core/geometry/operators/overlapsOperator.js";
const result = overlapsOperator.execute(polygon1, polygon2);  // returns boolean

// Touches - geometries share boundary but not interior
import touchesOperator from "@arcgis/core/geometry/operators/touchesOperator.js";
const result = touchesOperator.execute(polygon1, polygon2);  // returns boolean

// Disjoint - geometries don't share any space
import disjointOperator from "@arcgis/core/geometry/operators/disjointOperator.js";
const result = disjointOperator.execute(polygon1, polygon2);  // returns boolean

// Equals - geometries are identical
import equalsOperator from "@arcgis/core/geometry/operators/equalsOperator.js";
const result = equalsOperator.execute(geom1, geom2);  // returns boolean
```

### Set Operations

```javascript
// Union - combine geometries
import unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
const combined = unionOperator.execute([polygon1, polygon2, polygon3]);

// Intersection - common area between geometries
import intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
const common = intersectionOperator.execute(polygon1, polygon2);

// Difference - subtract geometry2 from geometry1
import differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js";
const diff = differenceOperator.execute(polygon1, polygon2);

// Symmetric Difference - areas in either but not both
import symmetricDifferenceOperator from "@arcgis/core/geometry/operators/symmetricDifferenceOperator.js";
const symDiff = symmetricDifferenceOperator.execute(polygon1, polygon2);

// Clip - clip geometry by envelope
import clipOperator from "@arcgis/core/geometry/operators/clipOperator.js";
const clipped = clipOperator.execute(polygon, extent);
```

### Measurements

```javascript
// Area (for polygons)
import areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
const areaValue = areaOperator.execute(polygon);  // square meters

import geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";
const geoArea = geodeticAreaOperator.execute(polygon, { unit: "square-kilometers" });

// Length (for polylines)
import lengthOperator from "@arcgis/core/geometry/operators/lengthOperator.js";
const lengthValue = lengthOperator.execute(polyline);  // meters

import geodeticLengthOperator from "@arcgis/core/geometry/operators/geodeticLengthOperator.js";
const geoLength = geodeticLengthOperator.execute(polyline, { unit: "kilometers" });

// Distance between geometries
import distanceOperator from "@arcgis/core/geometry/operators/distanceOperator.js";
const dist = distanceOperator.execute(point1, point2);  // meters
```

### Geometry Manipulation

```javascript
// Simplify - remove self-intersections
import simplifyOperator from "@arcgis/core/geometry/operators/simplifyOperator.js";
const simplified = simplifyOperator.execute(polygon);

// Generalize - reduce vertices
import generalizeOperator from "@arcgis/core/geometry/operators/generalizeOperator.js";
const generalized = generalizeOperator.execute(polyline, {
  maxDeviation: 100,
  unit: "meters"
});

// Densify - add vertices
import densifyOperator from "@arcgis/core/geometry/operators/densifyOperator.js";
const densified = densifyOperator.execute(polyline, {
  maxSegmentLength: 100,
  unit: "meters"
});

// Offset - create parallel geometry
import offsetOperator from "@arcgis/core/geometry/operators/offsetOperator.js";
const offsetGeom = offsetOperator.execute(polyline, {
  distance: 50,
  unit: "meters",
  joinType: "round"  // round, bevel, miter
});

// Convex Hull
import convexHullOperator from "@arcgis/core/geometry/operators/convexHullOperator.js";
const hull = convexHullOperator.execute(polygon);
const multiHull = convexHullOperator.execute([point1, point2, point3]);

// Centroid
import centroidOperator from "@arcgis/core/geometry/operators/centroidOperator.js";
const center = centroidOperator.execute(polygon);

// Label Point (guaranteed inside polygon)
import labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";
const label = labelPointOperator.execute(polygon);
```

### Available Operators

| Category | Operators |
|----------|-----------|
| Relationship | `containsOperator`, `crossesOperator`, `disjointOperator`, `equalsOperator`, `intersectsOperator`, `overlapsOperator`, `relateOperator`, `touchesOperator`, `withinOperator` |
| Set Operations | `clipOperator`, `cutOperator`, `differenceOperator`, `intersectionOperator`, `symmetricDifferenceOperator`, `unionOperator` |
| Buffer | `bufferOperator`, `geodesicBufferOperator` |
| Shape | `autoCompleteOperator`, `boundaryOperator`, `convexHullOperator`, `simplifyOperator` |
| Measurement | `areaOperator`, `geodeticAreaOperator`, `lengthOperator`, `geodeticLengthOperator`, `distanceOperator` |
| Transform | `densifyOperator`, `generalizeOperator`, `offsetOperator`, `projectOperator` |
| Analysis | `centroidOperator`, `labelPointOperator` |

## Projection (projectOperator)

```javascript
import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

// Load projection engine (required before projecting)
await projectOperator.load();

// Project geometry to new spatial reference (spatial reference is a separate parameter)
const projected = projectOperator.execute(geometry, { wkid: 4326 });

// Project with geographic transformation
const projectedWithTransform = projectOperator.execute(geometry, { wkid: 4326 }, {
  geographicTransformation: {
    steps: [{ wkid: 108190 }]  // NAD_1983_To_WGS_1984_5
  }
});
```

> **Note:** To get available geographic transformations, use the `geographicTransformationUtils` module, not `projectOperator`.

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

// Load from glTF/GLB (URL is a separate parameter)
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

### Create Buffer and Query
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

## Reference Samples

- `geometry-operator-centroid` - Computing geometry centroids
- `geometry-operator-offset-visualizer` - Visualizing geometry offsets
- `geometry-operator-proximity` - Proximity analysis with geometry operators
- `geometry-operator-worker` - Running geometry operations in a web worker
- `ge-geodesicbuffer` - Geodesic buffer operations

## Common Pitfalls

1. **Spatial Reference Mismatch**: Always ensure geometries are in the same spatial reference before operations
   ```javascript
   // Project if needed
   import projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
   await projectOperator.load();
   if (!geom1.spatialReference.equals(geom2.spatialReference)) {
     geom2 = projectOperator.execute(geom2, geom1.spatialReference);
   }
   ```

2. **Geodesic vs Planar**: Use geodesic operators for geographic coordinates (WGS84)
   ```javascript
   // Use geodesicBufferOperator for lat/lon, bufferOperator for projected coordinates
   import geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";
   import bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
   const bufferOp = geometry.spatialReference.isGeographic ? geodesicBufferOperator : bufferOperator;
   ```

3. **Ring Orientation**: Outer rings clockwise, holes counter-clockwise

4. **Self-intersecting Polygons**: Use `simplifyOperator` before operations on user-drawn polygons

5. **Load Operators**: Call `await operator.load()` before using operators that require it (e.g., `await projectOperator.load()` before `projectOperator.execute()`)

---

## Deprecated: geometryEngine

> **DEPRECATED:** The `geometryEngine` and `geometryEngineAsync` modules are deprecated as of version 4.29. Use the geometry operators module (shown above) instead.

The following is kept for reference when maintaining legacy code. **Do not use for new development.**

### Migration Guide

| Deprecated (geometryEngine) | Modern (operators) |
|-----------------------------|-------------------|
| `geometryEngine.buffer(geom, dist, unit)` | `bufferOperator.execute(geom, dist, { unit })` |
| `geometryEngine.geodesicBuffer(geom, dist, unit)` | `geodesicBufferOperator.execute(geom, dist, { unit })` |
| `geometryEngine.union([geoms])` | `unionOperator.execute([geoms])` |
| `geometryEngine.intersect(g1, g2)` | `intersectionOperator.execute(g1, g2)` |
| `geometryEngine.contains(g1, g2)` | `containsOperator.execute(g1, g2)` |
| `geometryEngine.within(g1, g2)` | `withinOperator.execute(g1, g2)` |
| `geometryEngine.distance(g1, g2, unit)` | `distanceOperator.execute(g1, g2)` |
| `geometryEngine.planarArea(geom, unit)` | `areaOperator.execute(geom)` |
| `geometryEngine.geodesicArea(geom, unit)` | `geodeticAreaOperator.execute(geom, { unit })` |
| `geometryEngine.simplify(geom)` | `simplifyOperator.execute(geom)` |
| `geometryEngine.convexHull(geom)` | `convexHullOperator.execute(geom)` |

### Legacy geometryEngine (Deprecated)

```javascript
// DEPRECATED - Do not use for new development
import geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

// These methods still work but will be removed in a future release
const buffer = geometryEngine.buffer(point, 1000, "meters");
const intersects = geometryEngine.intersects(polygon1, polygon2);
const union = geometryEngine.union([polygon1, polygon2]);
```

