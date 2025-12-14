---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - CIM Symbols

Advanced cartographic symbols using CIM (Cartographic Information Model).

## Basic CIM Symbol

```javascript
const graphic = new Graphic({
  geometry: point,
  symbol: {
    type: "cim",
    data: {
      type: "CIMSymbolReference",
      symbol: {
        type: "CIMPointSymbol",
        symbolLayers: [{
          type: "CIMVectorMarker",
          enable: true,
          size: 20,
          frame: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 },
          markerGraphics: [{
            type: "CIMMarkerGraphic",
            geometry: { rings: [[[0,0], [10,0], [10,10], [0,10], [0,0]]] },
            symbol: {
              type: "CIMPolygonSymbol",
              symbolLayers: [{
                type: "CIMSolidFill",
                enable: true,
                color: [255, 0, 0, 255]
              }]
            }
          }]
        }]
      }
    }
  }
});
```

## CIM Line Symbol (Arrow)

```javascript
const arrowLineCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMLineSymbol",
    symbolLayers: [
      {
        type: "CIMVectorMarker",
        enable: true,
        size: 12,
        markerPlacement: {
          type: "CIMMarkerPlacementAtExtremities",
          extremityPlacement: "JustEnd",
          angleToLine: true
        },
        frame: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 },
        markerGraphics: [{
          type: "CIMMarkerGraphic",
          geometry: { rings: [[[0, 0], [10, 5], [0, 10], [3, 5], [0, 0]]] },
          symbol: {
            type: "CIMPolygonSymbol",
            symbolLayers: [{ type: "CIMSolidFill", enable: true, color: [0, 0, 0, 255] }]
          }
        }]
      },
      { type: "CIMSolidStroke", enable: true, width: 2, color: [0, 0, 0, 255] }
    ]
  }
};
```

## CIM Polygon Symbol (Hatched)

```javascript
const hatchedFillCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMPolygonSymbol",
    symbolLayers: [
      {
        type: "CIMHatchFill",
        enable: true,
        lineSymbol: {
          type: "CIMLineSymbol",
          symbolLayers: [{ type: "CIMSolidStroke", enable: true, width: 1, color: [0, 0, 0, 255] }]
        },
        rotation: 45,
        separation: 5
      },
      { type: "CIMSolidFill", enable: true, color: [255, 255, 200, 255] },
      { type: "CIMSolidStroke", enable: true, width: 2, color: [0, 0, 0, 255] }
    ]
  }
};
```

## Data-Driven CIM

```javascript
const dataDrivenCIM = {
  type: "CIMSymbolReference",
  primitiveOverrides: [{
    type: "CIMPrimitiveOverride",
    primitiveName: "fillLayer",
    propertyName: "Color",
    valueExpressionInfo: {
      type: "CIMExpressionInfo",
      expression: `
        var val = $feature.value;
        if (val < 50) return [255, 0, 0, 255];
        return [0, 255, 0, 255];
      `,
      returnType: "Default"
    }
  }],
  symbol: {
    type: "CIMPointSymbol",
    symbolLayers: [{
      type: "CIMVectorMarker",
      markerGraphics: [{
        type: "CIMMarkerGraphic",
        symbol: {
          type: "CIMPolygonSymbol",
          symbolLayers: [{
            type: "CIMSolidFill",
            primitiveName: "fillLayer",
            color: [128, 128, 128, 255]
          }]
        }
      }]
    }]
  }
};
```

## Marker Placement

```javascript
// Along line
markerPlacement: {
  type: "CIMMarkerPlacementAlongLineSameSize",
  placementTemplate: [20],
  angleToLine: true
}

// At vertices
markerPlacement: {
  type: "CIMMarkerPlacementAtRatioPositions",
  positionArray: [0, 0.5, 1],
  angleToLine: true
}
```

## CIM Properties

```javascript
// Colors: [R, G, B, A] where each is 0-255
color: [255, 0, 0, 255]

// Stroke
{ type: "CIMSolidStroke", width: 2, color: [0, 0, 0, 255], capStyle: "Round", joinStyle: "Round" }

// Anchor
{ anchorPoint: { x: 0, y: -0.5 }, anchorPointUnits: "Relative" }
```

## Common Pitfalls

1. **Frame coordinates** - Frame defines coordinate space for graphics
2. **Layer order** - Renders bottom to top
3. **Primitive names** - Must be unique for overrides
4. **Closed rings** - First point must equal last point
