---
name: arcgis-visualization
description: Style and render geographic data with renderers, symbols, and visual variables. Use for creating thematic maps, heatmaps, class breaks, unique values, labels, and 3D visualization.
---

# ArcGIS Visualization

Use this skill when styling layers with renderers, symbols, visual variables, labels, and effects.

## Renderer Types Overview

| Renderer | Use Case |
|----------|----------|
| SimpleRenderer | Same symbol for all features |
| UniqueValueRenderer | Different symbols by category |
| ClassBreaksRenderer | Different symbols by numeric ranges |
| HeatmapRenderer | Density visualization |
| DotDensityRenderer | Dot density maps |
| DictionaryRenderer | Military symbology |

## SimpleRenderer

```javascript
const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "blue",
    size: 8,
    outline: {
      color: "white",
      width: 1
    }
  }
};

layer.renderer = renderer;
```

### With Visual Variables
```javascript
const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "#13EB0C",
    outline: { color: "#A9A9A9", width: 0.5 }
  },
  visualVariables: [{
    type: "size",
    field: "population",
    stops: [
      { value: 1000, size: 4 },
      { value: 10000, size: 12 },
      { value: 100000, size: 24 }
    ]
  }]
};
```

## UniqueValueRenderer

### Basic Unique Values
```javascript
const renderer = {
  type: "unique-value",
  field: "type",
  defaultSymbol: { type: "simple-fill", color: "gray" },
  uniqueValueInfos: [
    {
      value: "residential",
      symbol: { type: "simple-fill", color: "#FFFF00" },
      label: "Residential"
    },
    {
      value: "commercial",
      symbol: { type: "simple-fill", color: "#FF0000" },
      label: "Commercial"
    },
    {
      value: "industrial",
      symbol: { type: "simple-fill", color: "#800080" },
      label: "Industrial"
    }
  ]
};
```

### Grouped Unique Values (with headings in legend)
```javascript
const renderer = {
  type: "unique-value",
  field: "zonecode",
  uniqueValueGroups: [
    {
      heading: "Commercial",
      classes: [
        {
          label: "C-1 | Neighborhood Commercial",
          symbol: createFillSymbol([189, 145, 145]),
          values: "C-1"
        },
        {
          label: "C-2 | Community Commercial",
          symbol: createFillSymbol([255, 179, 219]),
          values: "C-2"
        }
      ]
    },
    {
      heading: "Residential",
      classes: [
        {
          label: "R-1 | Low Density",
          symbol: createFillSymbol([255, 255, 224]),
          values: "R-1"
        },
        {
          label: "Special Areas",
          symbol: createFillSymbol([161, 237, 237]),
          values: ["S-DW", "S-DR", "S-RP"] // Multiple values
        }
      ]
    }
  ]
};

function createFillSymbol(color) {
  return {
    type: "simple-fill",
    color: color,
    outline: null
  };
}
```

## ClassBreaksRenderer

```javascript
const renderer = {
  type: "class-breaks",
  field: "population",
  normalizationField: "area", // Optional: divide by this field
  legendOptions: {
    title: "Population Density"
  },
  defaultSymbol: {
    type: "simple-fill",
    color: "black",
    style: "backward-diagonal"
  },
  defaultLabel: "No data",
  classBreakInfos: [
    {
      minValue: 0,
      maxValue: 100,
      symbol: { type: "simple-fill", color: "#fffcd4" },
      label: "< 100"
    },
    {
      minValue: 100,
      maxValue: 500,
      symbol: { type: "simple-fill", color: "#b1cdc2" },
      label: "100 - 500"
    },
    {
      minValue: 500,
      maxValue: 1000,
      symbol: { type: "simple-fill", color: "#38627a" },
      label: "500 - 1,000"
    },
    {
      minValue: 1000,
      maxValue: Infinity,
      symbol: { type: "simple-fill", color: "#0d2644" },
      label: "> 1,000"
    }
  ]
};
```

## HeatmapRenderer

```javascript
const renderer = {
  type: "heatmap",
  colorStops: [
    { color: "rgba(63, 40, 102, 0)", ratio: 0 },
    { color: "#472b77", ratio: 0.083 },
    { color: "#563098", ratio: 0.25 },
    { color: "#7139d4", ratio: 0.5 },
    { color: "#853fff", ratio: 0.664 },
    { color: "#c29f80", ratio: 0.83 },
    { color: "#ffff00", ratio: 1 }
  ],
  maxDensity: 0.01,
  minDensity: 0,
  radius: 18 // Blur radius in pixels
};
```

## 2D Symbol Types

### SimpleMarkerSymbol (Points)
```javascript
const symbol = {
  type: "simple-marker",
  style: "circle", // circle, square, cross, x, diamond, triangle
  color: [255, 0, 0],
  size: 12,
  outline: {
    color: [255, 255, 255],
    width: 2
  }
};
```

### SimpleLineSymbol
```javascript
const symbol = {
  type: "simple-line",
  style: "solid", // solid, dash, dot, dash-dot, etc.
  color: [0, 0, 255],
  width: 2,
  cap: "round",   // round, butt, square
  join: "round"   // round, miter, bevel
};
```

### SimpleFillSymbol (Polygons)
```javascript
const symbol = {
  type: "simple-fill",
  style: "solid", // solid, none, horizontal, vertical, cross, etc.
  color: [255, 255, 0, 0.5], // RGBA
  outline: {
    type: "simple-line",
    color: [0, 0, 0],
    width: 1
  }
};
```

### PictureMarkerSymbol
```javascript
const symbol = {
  type: "picture-marker",
  url: "https://example.com/icon.png",
  width: 24,
  height: 24,
  xoffset: 0,
  yoffset: 0
};
```

### TextSymbol
```javascript
const symbol = {
  type: "text",
  text: "Label",
  color: "white",
  font: {
    family: "Arial",
    size: 12,
    weight: "bold"
  },
  haloColor: "black",
  haloSize: 1
};
```

## 3D Symbol Types

### PointSymbol3D
```javascript
const symbol = {
  type: "point-3d",
  symbolLayers: [{
    type: "icon",
    resource: { primitive: "circle" },
    material: { color: "red" },
    size: 12
  }]
};

// Object marker
const symbol = {
  type: "point-3d",
  symbolLayers: [{
    type: "object",
    resource: { primitive: "cylinder" }, // cone, cube, sphere, diamond
    material: { color: "blue" },
    height: 100,
    width: 10,
    depth: 10
  }]
};
```

### WebStyleSymbol (3D icons from gallery)
```javascript
const symbol = {
  type: "web-style",
  name: "Pushpin 1",
  styleName: "Esri2DPointSymbolsStyle"
};
```

### MeshSymbol3D (for SceneLayer)
```javascript
const symbol = {
  type: "mesh-3d",
  symbolLayers: [{
    type: "fill",
    material: {
      color: [244, 247, 134]
    }
  }]
};
```

### LineSymbol3D
```javascript
const symbol = {
  type: "line-3d",
  symbolLayers: [{
    type: "path",
    profile: "quad", // circle, quad
    material: { color: "red" },
    width: 5,
    height: 5
  }]
};
```

### PolygonSymbol3D
```javascript
const symbol = {
  type: "polygon-3d",
  symbolLayers: [{
    type: "extrude",
    material: { color: "blue" },
    size: 100 // Extrusion height
  }]
};
```

## Visual Variables

### Size Variable
```javascript
visualVariables: [{
  type: "size",
  field: "magnitude",
  stops: [
    { value: 1, size: 4 },
    { value: 5, size: 20 },
    { value: 10, size: 40 }
  ]
}]
```

### Color Variable
```javascript
visualVariables: [{
  type: "color",
  field: "temperature",
  stops: [
    { value: 0, color: "blue" },
    { value: 50, color: "yellow" },
    { value: 100, color: "red" }
  ]
}]
```

### Opacity Variable
```javascript
visualVariables: [{
  type: "opacity",
  field: "confidence",
  stops: [
    { value: 0, opacity: 0.1 },
    { value: 100, opacity: 1 }
  ]
}]
```

### Rotation Variable
```javascript
visualVariables: [{
  type: "rotation",
  field: "heading",
  rotationType: "geographic" // or "arithmetic"
}]
```

## Labeling

```javascript
layer.labelingInfo = [{
  symbol: {
    type: "text",
    color: "white",
    font: {
      family: "Noto Sans",
      size: 10,
      weight: "bold"
    },
    haloColor: "#472b77",
    haloSize: 1
  },
  labelPlacement: "above-center", // Various placement options
  labelExpressionInfo: {
    expression: "$feature.name" // Arcade expression
  },
  where: "population > 10000", // SQL filter
  minScale: 500000,
  maxScale: 0
}];

layer.labelsVisible = true;
```

### Label Placements
- Points: `above-center`, `below-center`, `center-center`, `above-left`, etc.
- Lines: `above-along`, `below-along`, `center-along`
- Polygons: `always-horizontal`

### Arcade Label Expressions
```javascript
labelExpressionInfo: {
  expression: `
    var pop = $feature.population;
    if (pop > 1000000) {
      return $feature.name + " (" + Round(pop/1000000, 1) + "M)";
    }
    return $feature.name;
  `
}
```

> For layer effects (bloom, blur, drop-shadow) and blend modes, see [arcgis-feature-effects](../arcgis-feature-effects/SKILL.md).

> For smart mapping renderers and data-driven visualization, see [arcgis-smart-mapping](../arcgis-smart-mapping/SKILL.md).

## Autocasting

All symbol and renderer objects support autocasting - you can use plain objects instead of constructing classes.

### JavaScript
```javascript
// This plain object autocasts to a SimpleRenderer with SimpleMarkerSymbol
layer.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "red",
    size: 8
  }
};
```

### TypeScript (with type safety)
```typescript
// Use 'as const' to keep discriminated union types narrow
layer.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "red",
    size: 8
  }
} as const;

// Or use 'satisfies' for explicit type checking
layer.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "red",
    size: 8
  }
} satisfies __esri.SimpleRendererProperties;
```

### Explicit Classes (when you need instance methods)
```typescript
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";

layer.renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: "red",
    size: 8
  })
});
```

> **Tip:** Use autocasting for configuration-heavy code. Use explicit classes when you need instance methods or `instanceof` checks. See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance.

## Reference Samples

- `get-started-visualization` - Getting started with data visualization
- `visualization-classbreaks` - ClassBreaksRenderer for numeric data
- `visualization-unique-value-groups` - Grouped unique value renderers
- `visualization-vv-color` - Visual variables with color
- `labels-basic` - Basic label configuration

## Common Pitfalls

1. **Missing type property**: Both renderers and symbols require a `type` property for autocasting to work.

   ```javascript
   // Anti-pattern: missing type on renderer and symbol
   layer.renderer = {
     symbol: {
       color: "red",
       size: 8
     }
   };
   // No type on renderer or symbol - autocasting fails silently
   ```

   ```javascript
   // Correct: include type at both renderer and symbol level
   layer.renderer = {
     type: "simple",
     symbol: {
       type: "simple-marker",
       color: "red",
       size: 8
     }
   };
   ```

   **Impact:** Without the `type` property, the ArcGIS autocasting system cannot determine which class to create. The renderer or symbol is silently ignored, and features render with the default symbology or not at all.

2. **Color formats**: Colors can be hex, named, RGB array, or RGBA array
   ```javascript
   color: "red"
   color: "#FF0000"
   color: [255, 0, 0]
   color: [255, 0, 0, 0.5] // With transparency
   ```

3. **Visual variables require numeric fields**: Using a string field for a size or color visual variable produces no variation.

   ```javascript
   // Anti-pattern: using a string/text field for size visual variable
   layer.renderer = {
     type: "simple",
     symbol: { type: "simple-marker", color: "blue" },
     visualVariables: [{
       type: "size",
       field: "city_name", // String field - cannot map to size
       minDataValue: 0,
       maxDataValue: 100,
       minSize: 4,
       maxSize: 40
     }]
   };
   ```

   ```javascript
   // Correct: use a numeric field for size visual variable
   layer.renderer = {
     type: "simple",
     symbol: { type: "simple-marker", color: "blue" },
     visualVariables: [{
       type: "size",
       field: "population", // Numeric field - maps correctly to size
       minDataValue: 10000,
       maxDataValue: 1000000,
       minSize: 4,
       maxSize: 40
     }]
   };
   ```

   **Impact:** All features render at the same default size with no visual variation. No error is thrown, making it difficult to diagnose why the visualization appears flat and uniform.

4. **Label expressions are Arcade**: Use Arcade syntax, not JavaScript

