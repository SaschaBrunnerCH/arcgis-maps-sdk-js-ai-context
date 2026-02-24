---
name: arcgis-cim-symbols
description: Create advanced cartographic symbols using CIM (Cartographic Information Model). Use for complex multi-layer symbols, animated markers, custom line patterns, and data-driven symbology.
---

# ArcGIS CIM Symbols

Use this skill for creating advanced cartographic symbols with CIM (Cartographic Information Model).

## Import Patterns

### Direct ESM Imports
```javascript
import CIMSymbol from "@arcgis/core/symbols/CIMSymbol.js";
import * as cimSymbolUtils from "@arcgis/core/symbols/support/cimSymbolUtils.js";
import * as cimConversionUtils from "@arcgis/core/symbols/support/cimConversionUtils.js";
```

### CDN Dynamic Imports
```javascript
const CIMSymbol = await $arcgis.import("@arcgis/core/symbols/CIMSymbol.js");
const cimSymbolUtils = await $arcgis.import("@arcgis/core/symbols/support/cimSymbolUtils.js");
const cimConversionUtils = await $arcgis.import("@arcgis/core/symbols/support/cimConversionUtils.js");
```

> **Note:** Examples below use autocasting. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## CIM Symbol Overview

CIM symbols provide advanced cartographic capabilities beyond standard symbols:
- Multi-layer symbols (stacked marker, fill, stroke layers)
- Complex custom marker graphics (vector-based shapes)
- Custom line patterns and arrow heads
- Animated symbols with duration/loop control
- Data-driven symbol properties via primitive overrides (Arcade expressions)

## CIM Symbol Structure

```
CIMSymbol (type: "cim")
  └── data (CIMSymbolReference)
        ├── symbol (CIMPointSymbol | CIMLineSymbol | CIMPolygonSymbol)
        │     └── symbolLayers[] (CIMVectorMarker | CIMSolidFill | CIMSolidStroke | CIMHatchFill | ...)
        │           └── markerGraphics[] (CIMMarkerGraphic - for vector markers)
        │                 ├── geometry (point, polyline, polygon rings)
        │                 └── symbol (nested CIM symbol for the graphic)
        └── primitiveOverrides[] (CIMPrimitiveOverride - data-driven)
```

## CIM Point Symbols

### Basic CIM Point
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

### Numbered Marker (multi-layer)
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

## Marker Placement Types

| Placement Type | Use Case |
|----------------|----------|
| `CIMMarkerPlacementAtExtremities` | Arrow heads at line start/end |
| `CIMMarkerPlacementAlongLineSameSize` | Repeat markers along a line |
| `CIMMarkerPlacementAtRatioPositions` | Markers at specific positions (0-1) |
| `CIMMarkerPlacementInsidePolygon` | Fill polygon interior with markers |

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

### At Ratio Positions
```javascript
const markerAtPositions = {
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
const animatedCIM = {
  type: "CIMSymbolReference",
  symbol: {
    type: "CIMPointSymbol",
    symbolLayers: [{
      type: "CIMVectorMarker",
      enable: true,
      size: 20,
      animatedSymbolProperties: {
        type: "CIMAnimatedSymbolProperties",
        playAnimation: true,
        reverseAnimation: false,
        randomizeStartTime: true,
        startTimeOffset: 0,
        duration: 3, // Seconds
        repeatType: "Loop" // Loop, Oscillate, None
      },
      // ... marker graphics
    }]
  }
};
```

## Data-Driven Properties (Primitive Overrides)

Primitive overrides let you drive any CIM property from feature attributes using Arcade expressions.

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

### Common Override Properties

| propertyName | Target | Expression Returns |
|--------------|--------|--------------------|
| `"Color"` | Fill/stroke color | `[R, G, B, A]` array |
| `"Size"` | Marker size | Number |
| `"TextString"` | Text content | String |
| `"Rotation"` | Marker angle | Number (degrees) |

## CIM Utility Functions

### cimSymbolUtils
```javascript
import * as cimSymbolUtils from "@arcgis/core/symbols/support/cimSymbolUtils.js";

// Get CIM color for a symbol layer
const color = cimSymbolUtils.getCIMSymbolColor(cimSymbol);

// Set color on CIM symbol
cimSymbolUtils.applyCIMSymbolColor(cimSymbol, [255, 0, 0, 255]);

// Get/set rotation
const rotation = cimSymbolUtils.getCIMSymbolRotation(cimSymbol);
cimSymbolUtils.applyCIMSymbolRotation(cimSymbol, 45);

// Get/set size
const size = cimSymbolUtils.getCIMSymbolSize(cimSymbol);
cimSymbolUtils.applyCIMSymbolSize(cimSymbol, 24);
```

### cimConversionUtils
```javascript
import * as cimConversionUtils from "@arcgis/core/symbols/support/cimConversionUtils.js";

// Convert simple symbol to CIM equivalent
const cimData = cimConversionUtils.fromSimpleMarkerSymbol(simpleMarkerSymbol);
const cimData = cimConversionUtils.fromSimpleLineSymbol(simpleLineSymbol);
const cimData = cimConversionUtils.fromSimpleFillSymbol(simpleFillSymbol);
```

## CIM Color & Stroke Reference

### Colors
```javascript
// RGBA array [R, G, B, A] - each value 0-255
color: [255, 0, 0, 255]   // Red, fully opaque
color: [0, 0, 255, 128]   // Blue, 50% transparent
```

### Stroke Properties
```javascript
{
  type: "CIMSolidStroke",
  enable: true,
  width: 2,
  color: [0, 0, 0, 255],
  capStyle: "Round",    // Butt, Round, Square
  joinStyle: "Round",   // Bevel, Miter, Round
  miterLimit: 10
}
```

### Anchor Points
```javascript
{
  anchorPoint: { x: 0, y: 0 },      // Center
  anchorPoint: { x: 0, y: -0.5 },   // Bottom center
  anchorPointUnits: "Relative"       // Relative or Absolute
}
```

## Using CIM with Renderers

```javascript
layer.renderer = {
  type: "simple",
  symbol: {
    type: "cim",
    data: arrowLineCIM // Any CIMSymbolReference object
  }
};
```

## Reference Samples

- `cim-symbols` - Basic CIM symbol creation
- `cim-animations` - Animated CIM symbols
- `cim-line-arrows` - Arrow symbols for line features
- `cim-lines-and-polygons` - CIM line and polygon patterns
- `cim-primitive-overrides` - Data-driven CIM properties
- `cim-marker-placement` - Marker placement along lines

## Common Pitfalls

1. **Frame coordinates**: Frame defines the coordinate space for marker graphics. Geometry coordinates must fall within the frame bounds.

2. **Layer order**: Symbol layers render bottom-to-top in the array. Place backgrounds before foreground elements.

3. **Primitive names**: Must be unique within the entire symbol for overrides to work. Each `primitiveName` is matched to its corresponding `primitiveOverrides` entry.

4. **Color format**: Always use `[R, G, B, A]` with values 0-255. Unlike standard symbols, CIM does not accept named colors or hex strings.

5. **Geometry rings**: Polygon rings must be closed (first point = last point). Open rings cause rendering errors.

6. **Enable property**: Every symbol layer must have `enable: true` or it will not render.

## Related Skills

- `arcgis-visualization` - Standard renderers and symbols
- `arcgis-smart-mapping` - Auto-generated renderers
- `arcgis-core-maps` - Map and view setup
