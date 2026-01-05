---
name: arcgis-cim-symbols
description: Create advanced cartographic symbols using CIM (Cartographic Information Model). Use for complex multi-layer symbols, animated markers, custom line patterns, and data-driven symbology.
---

# ArcGIS CIM Symbols

Use this skill for creating advanced cartographic symbols with CIM (Cartographic Information Model).

## CIM Symbol Basics

CIM symbols provide advanced cartographic capabilities:
- Multi-layer symbols
- Complex marker graphics
- Custom line patterns
- Animated symbols
- Data-driven symbol properties

### Basic CIM Symbol
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
            geometry: {
              rings: [[[0,0], [10,0], [10,10], [0,10], [0,0]]]
            },
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

## CIM Point Symbols

### Numbered Marker
```javascript
function getNumberedMarkerCIM(number) {
  return {
    type: "CIMSymbolReference",
    primitiveOverrides: [{
      type: "CIMPrimitiveOverride",
      primitiveName: "textGraphic",
      propertyName: "TextString",
      valueExpressionInfo: {
        type: "CIMExpressionInfo",
        expression: "$feature.text",
        returnType: "Default"
      }
    }],
    symbol: {
      type: "CIMPointSymbol",
      symbolLayers: [
        // Text layer (on top)
        {
          type: "CIMVectorMarker",
          enable: true,
          size: 32,
          frame: { xmin: -5, ymin: -5, xmax: 5, ymax: 5 },
          markerGraphics: [{
            type: "CIMMarkerGraphic",
            primitiveName: "textGraphic",
            geometry: { x: 0, y: 0 },
            symbol: {
              type: "CIMTextSymbol",
              fontFamilyName: "Arial",
              fontStyleName: "Bold",
              height: 4,
              horizontalAlignment: "Center",
              verticalAlignment: "Center",
              symbol: {
                type: "CIMPolygonSymbol",
                symbolLayers: [{
                  type: "CIMSolidFill",
                  enable: true,
                  color: [255, 255, 255, 255]
                }]
              }
            },
            textString: String(number)
          }]
        },
        // Circle background
        {
          type: "CIMVectorMarker",
          enable: true,
          size: 24,
          frame: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 },
          markerGraphics: [{
            type: "CIMMarkerGraphic",
            geometry: {
              rings: [/* circle coordinates */]
            },
            symbol: {
              type: "CIMPolygonSymbol",
              symbolLayers: [{
                type: "CIMSolidFill",
                enable: true,
                color: [0, 100, 200, 255]
              }]
            }
          }]
        }
      ]
    }
  };
}
```

### Pin Marker
```javascript
const pinMarkerCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMPointSymbol",
    symbolLayers: [{
      type: "CIMVectorMarker",
      enable: true,
      anchorPoint: { x: 0, y: -0.5 },
      anchorPointUnits: "Relative",
      size: 40,
      frame: { xmin: 0, ymin: 0, xmax: 20, ymax: 30 },
      markerGraphics: [{
        type: "CIMMarkerGraphic",
        geometry: {
          rings: [[
            [10, 30], [0, 15], [0, 10],
            [10, 0], [20, 10], [20, 15], [10, 30]
          ]]
        },
        symbol: {
          type: "CIMPolygonSymbol",
          symbolLayers: [
            {
              type: "CIMSolidStroke",
              enable: true,
              width: 1,
              color: [50, 50, 50, 255]
            },
            {
              type: "CIMSolidFill",
              enable: true,
              color: [255, 100, 100, 255]
            }
          ]
        }
      }]
    }]
  }
};
```

## CIM Line Symbols

### Arrow Line
```javascript
const arrowLineCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMLineSymbol",
    symbolLayers: [
      // Arrow head at end
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
          geometry: {
            rings: [[[0, 0], [10, 5], [0, 10], [3, 5], [0, 0]]]
          },
          symbol: {
            type: "CIMPolygonSymbol",
            symbolLayers: [{
              type: "CIMSolidFill",
              enable: true,
              color: [0, 0, 0, 255]
            }]
          }
        }]
      },
      // Line stroke
      {
        type: "CIMSolidStroke",
        enable: true,
        width: 2,
        color: [0, 0, 0, 255]
      }
    ]
  }
};
```

### Dashed Line with Pattern
```javascript
const dashedLineCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMLineSymbol",
    symbolLayers: [{
      type: "CIMSolidStroke",
      enable: true,
      width: 3,
      color: [0, 100, 200, 255],
      effects: [{
        type: "CIMGeometricEffectDashes",
        dashTemplate: [8, 4, 2, 4], // dash, gap, dash, gap
        lineDashEnding: "NoConstraint"
      }]
    }]
  }
};
```

## CIM Polygon Symbols

### Hatched Fill
```javascript
const hatchedFillCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMPolygonSymbol",
    symbolLayers: [
      // Hatch pattern
      {
        type: "CIMHatchFill",
        enable: true,
        lineSymbol: {
          type: "CIMLineSymbol",
          symbolLayers: [{
            type: "CIMSolidStroke",
            enable: true,
            width: 1,
            color: [0, 0, 0, 255]
          }]
        },
        rotation: 45,
        separation: 5
      },
      // Background fill
      {
        type: "CIMSolidFill",
        enable: true,
        color: [255, 255, 200, 255]
      },
      // Outline
      {
        type: "CIMSolidStroke",
        enable: true,
        width: 2,
        color: [0, 0, 0, 255]
      }
    ]
  }
};
```

## Marker Placement

### Along Line
```javascript
const markerAlongLine = {
  type: "CIMVectorMarker",
  enable: true,
  size: 10,
  markerPlacement: {
    type: "CIMMarkerPlacementAlongLineSameSize",
    placementTemplate: [20], // Every 20 points
    angleToLine: true
  },
  // ... marker graphics
};
```

### At Vertices
```javascript
const markerAtVertices = {
  type: "CIMVectorMarker",
  enable: true,
  size: 8,
  markerPlacement: {
    type: "CIMMarkerPlacementAtRatioPositions",
    positionArray: [0, 0.5, 1], // Start, middle, end
    angleToLine: true
  },
  // ... marker graphics
};
```

## Animated CIM Symbols

```javascript
// Animation is controlled via primitive overrides
const animatedCIM = {
  type: "CIMSymbolReference",
  primitiveOverrides: [{
    type: "CIMPrimitiveOverride",
    primitiveName: "rotatingElement",
    propertyName: "Rotation",
    valueExpressionInfo: {
      type: "CIMExpressionInfo",
      expression: "$view.animation.currentTime * 360",
      returnType: "Default"
    }
  }],
  symbol: {
    type: "CIMPointSymbol",
    symbolLayers: [{
      type: "CIMVectorMarker",
      primitiveName: "rotatingElement",
      // ... marker definition
    }]
  }
};
```

## Data-Driven Properties

### Color from Attribute
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
        if (val < 100) return [255, 255, 0, 255];
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
            enable: true,
            color: [128, 128, 128, 255] // Default
          }]
        }
      }]
    }]
  }
};
```

### Size from Attribute
```javascript
primitiveOverrides: [{
  type: "CIMPrimitiveOverride",
  primitiveName: "mainMarker",
  propertyName: "Size",
  valueExpressionInfo: {
    type: "CIMExpressionInfo",
    expression: "Sqrt($feature.population) * 0.01",
    returnType: "Default"
  }
}]
```

## Common CIM Properties

### Colors
```javascript
// RGBA array [R, G, B, A] where each value is 0-255
color: [255, 0, 0, 255]  // Red, fully opaque
color: [0, 0, 255, 128]  // Blue, 50% transparent
```

### Stroke Properties
```javascript
{
  type: "CIMSolidStroke",
  enable: true,
  width: 2,
  color: [0, 0, 0, 255],
  capStyle: "Round",      // Butt, Round, Square
  joinStyle: "Round",     // Bevel, Miter, Round
  miterLimit: 10
}
```

### Anchor Points
```javascript
{
  anchorPoint: { x: 0, y: 0 },        // Center
  anchorPoint: { x: 0, y: -0.5 },     // Bottom center
  anchorPointUnits: "Relative"        // Relative or Absolute
}
```

## TypeScript Usage

CIM symbols are plain objects by design (following CIM specification). For TypeScript safety, use `as const` or type annotations:

### Using `as const`
```typescript
const cimSymbol = {
  type: "cim",
  data: {
    type: "CIMSymbolReference",
    symbol: {
      type: "CIMPointSymbol",
      symbolLayers: [{
        type: "CIMVectorMarker",
        enable: true,
        size: 20,
        // ... rest of symbol definition
      }]
    }
  }
} as const;
```

### Using Type Annotation
```typescript
const cimSymbol: __esri.CIMSymbolProperties = {
  type: "cim",
  data: {
    type: "CIMSymbolReference",
    symbol: {
      type: "CIMPointSymbol",
      symbolLayers: [{
        type: "CIMVectorMarker",
        enable: true,
        size: 20,
        // ... rest of symbol definition
      }]
    }
  }
};
```

> **Note:** CIM symbols are configuration objects and work well with autocasting. Use `as const` to keep discriminated union types narrow in TypeScript. See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting.

## Common Pitfalls

1. **Frame coordinates**: Frame defines the coordinate space for marker graphics

2. **Layer order**: Symbol layers render bottom to top in the array

3. **Primitive names**: Must be unique within symbol for overrides to work

4. **Color format**: Always use [R, G, B, A] with values 0-255

5. **Geometry rings**: Rings must be closed (first point = last point)

