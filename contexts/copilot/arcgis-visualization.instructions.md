---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Visualization (Renderers & Symbols)

## Renderer Types

| Renderer | Use Case |
|----------|----------|
| SimpleRenderer | Same symbol for all features |
| UniqueValueRenderer | Different symbols by category |
| ClassBreaksRenderer | Different symbols by numeric ranges |
| HeatmapRenderer | Density visualization |
| DotDensityRenderer | Dot density maps |

## SimpleRenderer

```javascript
layer.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "blue",
    size: 8,
    outline: { color: "white", width: 1 }
  }
};
```

### With Visual Variables
```javascript
layer.renderer = {
  type: "simple",
  symbol: { type: "simple-marker", color: "#13EB0C" },
  visualVariables: [{
    type: "size",
    field: "population",
    stops: [
      { value: 1000, size: 4 },
      { value: 100000, size: 24 }
    ]
  }]
};
```

## UniqueValueRenderer

```javascript
layer.renderer = {
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
    }
  ]
};
```

## ClassBreaksRenderer

```javascript
layer.renderer = {
  type: "class-breaks",
  field: "population",
  classBreakInfos: [
    { minValue: 0, maxValue: 100, symbol: { type: "simple-fill", color: "#fffcd4" }, label: "< 100" },
    { minValue: 100, maxValue: 500, symbol: { type: "simple-fill", color: "#b1cdc2" }, label: "100 - 500" },
    { minValue: 500, maxValue: Infinity, symbol: { type: "simple-fill", color: "#0d2644" }, label: "> 500" }
  ]
};
```

## HeatmapRenderer

```javascript
layer.renderer = {
  type: "heatmap",
  colorStops: [
    { color: "rgba(63, 40, 102, 0)", ratio: 0 },
    { color: "#472b77", ratio: 0.25 },
    { color: "#ffff00", ratio: 1 }
  ],
  radius: 18,
  maxDensity: 0.01
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
  outline: { color: [255, 255, 255], width: 2 }
};
```

### SimpleLineSymbol
```javascript
const symbol = {
  type: "simple-line",
  style: "solid", // solid, dash, dot, dash-dot
  color: [0, 0, 255],
  width: 2,
  cap: "round",
  join: "round"
};
```

### SimpleFillSymbol
```javascript
const symbol = {
  type: "simple-fill",
  style: "solid",
  color: [255, 255, 0, 0.5],
  outline: { type: "simple-line", color: [0, 0, 0], width: 1 }
};
```

### PictureMarkerSymbol
```javascript
const symbol = {
  type: "picture-marker",
  url: "https://example.com/icon.png",
  width: 24,
  height: 24
};
```

### TextSymbol
```javascript
const symbol = {
  type: "text",
  text: "Label",
  color: "white",
  font: { family: "Arial", size: 12, weight: "bold" },
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
    resource: { primitive: "cylinder" },
    material: { color: "blue" },
    height: 100,
    width: 10
  }]
};
```

### PolygonSymbol3D (Extrusion)
```javascript
const symbol = {
  type: "polygon-3d",
  symbolLayers: [{
    type: "extrude",
    material: { color: "blue" },
    size: 100
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
  rotationType: "geographic"
}]
```

## Labeling

```javascript
layer.labelingInfo = [{
  symbol: {
    type: "text",
    color: "white",
    font: { family: "Noto Sans", size: 10, weight: "bold" },
    haloColor: "#472b77",
    haloSize: 1
  },
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.name"
  },
  where: "population > 10000",
  minScale: 500000
}];

layer.labelsVisible = true;
```

### Label Placements
- Points: `above-center`, `below-center`, `center-center`
- Lines: `above-along`, `below-along`, `center-along`
- Polygons: `always-horizontal`

## Effects and Blend Modes

```javascript
// Layer effects
layer.effect = "drop-shadow(2px 2px 3px gray)";
layer.effect = "blur(2px)";
layer.effect = "grayscale(100%)";
layer.effect = "brightness(150%) contrast(120%)";

// Blend modes
layer.blendMode = "multiply";
```

## Feature Effects

```javascript
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";

layerView.featureEffect = new FeatureEffect({
  filter: { where: "population > 100000" },
  includedEffect: "bloom(1, 0.5px, 0.2)",
  excludedEffect: "grayscale(100%) opacity(30%)"
});
```

## Smart Mapping (Auto-generated Renderers)

```javascript
import colorRendererCreator from "@arcgis/core/smartMapping/renderers/color.js";

const response = await colorRendererCreator.createContinuousRenderer({
  layer: layer,
  field: "population",
  view: view,
  theme: "high-to-low"
});
layer.renderer = response.renderer;
```

## TypeScript: Use `as const`

```typescript
layer.renderer = {
  type: "simple",
  symbol: { type: "simple-marker", color: "red", size: 8 }
} as const;
```

## Common Pitfalls

1. **Missing type property** - Always include `type` for autocasting
2. **Color formats** - Use hex, named, RGB array, or RGBA array
3. **Visual variables require numeric fields** - Field must contain numbers
4. **Label expressions are Arcade** - Use Arcade syntax, not JavaScript
