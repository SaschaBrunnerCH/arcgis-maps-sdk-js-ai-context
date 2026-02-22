---
name: arcgis-feature-effects
description: Apply visual effects to features including filters, drop shadows, blur, and grayscale. Use for highlighting features and creating visual emphasis.
---

# ArcGIS Feature Effects

Use this skill for applying visual effects, filters, and emphasis to features.

## Feature Effect Basics

### Basic Feature Effect
```javascript
layer.featureEffect = {
  filter: {
    where: "population > 100000"
  },
  includedEffect: "bloom(1.5, 0.5px, 0.2)",
  excludedEffect: "grayscale(100%) opacity(30%)"
};
```

### Feature Effect on LayerView
```javascript
const layerView = await view.whenLayerView(layer);

layerView.featureEffect = {
  filter: {
    where: "status = 'Active'"
  },
  excludedEffect: "grayscale(100%) opacity(50%)"
};
```

## Effect Types

### Opacity Effect
```javascript
// Make excluded features transparent
layer.featureEffect = {
  filter: { where: "type = 'primary'" },
  excludedEffect: "opacity(25%)"
};
```

### Grayscale Effect
```javascript
// Grayscale excluded features
layer.featureEffect = {
  filter: { where: "category = 'important'" },
  excludedEffect: "grayscale(100%)"
};
```

### Blur Effect
```javascript
// Blur excluded features
layer.featureEffect = {
  filter: { where: "highlighted = 1" },
  excludedEffect: "blur(5px)"
};
```

### Drop Shadow Effect
```javascript
// Add drop shadow to included features
layer.featureEffect = {
  filter: { where: "selected = 1" },
  includedEffect: "drop-shadow(3px, 3px, 4px, #000000)"
};
```

### Bloom Effect
```javascript
// Add glow to included features
layer.featureEffect = {
  filter: { where: "active = 1" },
  includedEffect: "bloom(1.5, 0.5px, 0.2)"
};
```

### Brightness and Contrast
```javascript
layer.featureEffect = {
  filter: { where: "status = 'highlight'" },
  includedEffect: "brightness(150%) contrast(120%)",
  excludedEffect: "brightness(50%)"
};
```

### Invert Colors
```javascript
layer.featureEffect = {
  filter: { where: "type = 'special'" },
  includedEffect: "invert(100%)"
};
```

### Sepia Effect
```javascript
layer.featureEffect = {
  filter: { where: "year < 1900" },
  includedEffect: "sepia(100%)"
};
```

### Saturate Effect
```javascript
layer.featureEffect = {
  filter: { where: "priority = 'high'" },
  includedEffect: "saturate(200%)",
  excludedEffect: "saturate(20%)"
};
```

### Hue Rotate
```javascript
layer.featureEffect = {
  filter: { where: "category = 'alternate'" },
  includedEffect: "hue-rotate(180deg)"
};
```

## Combining Effects

### Multiple Effects
```javascript
layer.featureEffect = {
  filter: { where: "status = 'active'" },
  includedEffect: "drop-shadow(2px, 2px, 3px) brightness(120%)",
  excludedEffect: "grayscale(100%) opacity(30%) blur(2px)"
};
```

## Geometry-Based Filters

### Spatial Filter with Effect
```javascript
const layerView = await view.whenLayerView(layer);

layerView.featureEffect = {
  filter: {
    geometry: polygon,
    spatialRelationship: "intersects"
  },
  excludedEffect: "grayscale(100%) opacity(30%)"
};
```

### Distance-Based Filter
```javascript
layerView.featureEffect = {
  filter: {
    geometry: point,
    spatialRelationship: "intersects",
    distance: 1000,
    units: "meters"
  },
  excludedEffect: "opacity(20%)"
};
```

### Multiple Spatial Relationships
```javascript
// Features intersecting, containing, within, etc.
const spatialRelationships = [
  "intersects", "contains", "crosses",
  "envelope-intersects", "overlaps",
  "touches", "within", "disjoint"
];

layerView.featureEffect = {
  filter: {
    geometry: filterGeometry,
    spatialRelationship: "within"
  },
  excludedEffect: "grayscale(100%) opacity(30%)"
};
```

## Time-Based Filters

### Time Filter with Effect
```javascript
layer.featureEffect = {
  filter: {
    timeExtent: {
      start: new Date("2020-01-01"),
      end: new Date("2020-12-31")
    }
  },
  excludedEffect: "opacity(20%)"
};
```

## Display Filter

### Display Filter (Performance Optimization)
```javascript
// Display filter completely hides features (better performance)
layer.displayFilterInfo = {
  where: "population > 10000"
};

// Combined with feature effect
layer.displayFilterInfo = {
  where: "status != 'deleted'"
};

layer.featureEffect = {
  filter: { where: "status = 'active'" },
  excludedEffect: "opacity(50%)"
};
```

## Interactive Feature Effects

### Effect on Click
```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  const graphic = response.results[0]?.graphic;

  if (graphic) {
    const oid = graphic.attributes.OBJECTID;
    layerView.featureEffect = {
      filter: {
        objectIds: [oid]
      },
      includedEffect: "drop-shadow(3px, 3px, 4px)",
      excludedEffect: "grayscale(100%) opacity(40%)"
    };
  }
});
```

### Effect with Slider
```javascript
const slider = new Slider({
  container: "sliderDiv",
  min: 0,
  max: 100,
  values: [50]
});

slider.on("thumb-drag", (event) => {
  const value = event.value;
  layer.featureEffect = {
    filter: { where: `value > ${value}` },
    excludedEffect: `opacity(${100 - value}%)`
  };
});
```

### Clear Feature Effect
```javascript
layer.featureEffect = null;
// or
layerView.featureEffect = null;
```

## Effect with Histogram

### Feature Effect with Histogram Widget
```javascript
import Histogram from "@arcgis/core/widgets/Histogram.js";
import HistogramRangeSlider from "@arcgis/core/widgets/HistogramRangeSlider.js";
import generateHistogram from "@arcgis/core/smartMapping/statistics/histogram.js";

// Generate histogram for field
const histogramResult = await generateHistogram({
  layer: layer,
  field: "population",
  numBins: 30
});

const slider = new HistogramRangeSlider({
  bins: histogramResult.bins,
  min: histogramResult.minValue,
  max: histogramResult.maxValue,
  values: [histogramResult.minValue, histogramResult.maxValue]
});

slider.on("thumb-drag", () => {
  const [min, max] = slider.values;
  layerView.featureEffect = {
    filter: {
      where: `population >= ${min} AND population <= ${max}`
    },
    excludedEffect: "grayscale(100%) opacity(30%)"
  };
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/4.34/"></script>
  <style>
    html, body, #viewDiv { height: 100%; margin: 0; }
    #controls { position: absolute; top: 10px; right: 10px; background: white; padding: 10px; }
  </style>
  <script type="module">
    import Map from "@arcgis/core/Map.js";
    import MapView from "@arcgis/core/views/MapView.js";
    import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

    const layer = new FeatureLayer({
      url: "https://services.arcgis.com/.../FeatureServer/0"
    });

    const map = new Map({
      basemap: "gray-vector",
      layers: [layer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map
    });

    const layerView = await view.whenLayerView(layer);

    // Apply effect on dropdown change
    document.getElementById("effectSelect").onchange = (e) => {
      const effect = e.target.value;

      switch(effect) {
        case "highlight":
          layerView.featureEffect = {
            filter: { where: "type = 'primary'" },
            includedEffect: "drop-shadow(2px, 2px, 3px)",
            excludedEffect: "grayscale(100%) opacity(30%)"
          };
          break;
        case "blur":
          layerView.featureEffect = {
            filter: { where: "status = 'active'" },
            excludedEffect: "blur(3px) opacity(50%)"
          };
          break;
        case "none":
          layerView.featureEffect = null;
          break;
      }
    };
  </script>
</head>
<body>
  <div id="viewDiv"></div>
  <div id="controls" class="esri-widget">
    <select id="effectSelect">
      <option value="none">No Effect</option>
      <option value="highlight">Highlight</option>
      <option value="blur">Blur</option>
    </select>
  </div>
</body>
</html>
```

## Effect Reference

| Effect | Syntax | Description |
|--------|--------|-------------|
| opacity | `opacity(50%)` | Transparency (0-100%) |
| grayscale | `grayscale(100%)` | Remove color (0-100%) |
| blur | `blur(5px)` | Gaussian blur |
| drop-shadow | `drop-shadow(x, y, blur, color)` | Shadow effect |
| bloom | `bloom(strength, radius, threshold)` | Glow effect |
| brightness | `brightness(150%)` | Adjust brightness |
| contrast | `contrast(120%)` | Adjust contrast |
| invert | `invert(100%)` | Invert colors |
| sepia | `sepia(100%)` | Sepia tone |
| saturate | `saturate(200%)` | Color saturation |
| hue-rotate | `hue-rotate(180deg)` | Rotate hue |

## Reference Samples

- `featureeffect-geometry` - Geometry-based feature effects
- `featureeffect-drop-shadow` - Drop shadow effects on features
- `intro-effect-layer` - Introduction to layer effects
- `display-filter` - Display filters with feature effects
- `featurefilter-attributes` - Attribute-based feature filtering

## Common Pitfalls

1. **Layer vs LayerView**: Feature effects on layer affect all views; on layerView only that view

2. **Performance**: Complex effects on many features can impact performance

3. **Combining effects**: Effects are applied in order listed

4. **Display filter vs feature effect**: Use display filter for hiding, feature effect for styling

5. **Time extent**: Time-based filters require layer to have time info

