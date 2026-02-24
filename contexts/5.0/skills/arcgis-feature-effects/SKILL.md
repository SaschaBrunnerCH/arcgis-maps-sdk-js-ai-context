---
name: arcgis-feature-effects
description: Apply visual effects, filters, focus areas, and blend modes to map layers. Use for highlighting features, spatial filtering, display filters, and CSS-like visual emphasis.
---

# ArcGIS Feature Effects

Use this skill for applying visual effects, feature filters, display filters, focus areas, and blend modes to layers.

## Import Patterns

### Direct ESM Imports
```javascript
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import FocusArea from "@arcgis/core/effects/FocusArea.js";
import FocusAreas from "@arcgis/core/effects/FocusAreas.js";
import FocusAreaOutline from "@arcgis/core/effects/FocusAreaOutline.js";
```

### CDN Dynamic Imports
```javascript
const [FeatureEffect, FeatureFilter, FocusArea] = await $arcgis.import([
  "@arcgis/core/layers/support/FeatureEffect.js",
  "@arcgis/core/layers/support/FeatureFilter.js",
  "@arcgis/core/effects/FocusArea.js"
]);
```

> **Note:** Examples below use autocasting. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Feature Effect Basics

Feature effects divide features into two sets (included/excluded) based on a filter, then apply CSS-like effects to each set.

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

### Scale-Dependent Effects
```javascript
layerView.featureEffect = {
  filter: {
    where: "party_switch = 'R' OR party_switch = 'D'"
  },
  includedEffect: [
    { scale: 36978595, value: "drop-shadow(3px, 3px, 4px)" },
    { scale: 18489297, value: "drop-shadow(2px, 2px, 3px)" },
    { scale: 4622324, value: "drop-shadow(1px, 1px, 2px)" }
  ]
};
```

## Effect Types Reference

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

## Individual Effect Examples

### Opacity
```javascript
layer.featureEffect = {
  filter: { where: "type = 'primary'" },
  excludedEffect: "opacity(25%)"
};
```

### Grayscale
```javascript
layer.featureEffect = {
  filter: { where: "category = 'important'" },
  excludedEffect: "grayscale(100%)"
};
```

### Blur
```javascript
layer.featureEffect = {
  filter: { where: "highlighted = 1" },
  excludedEffect: "blur(5px)"
};
```

### Drop Shadow
```javascript
layer.featureEffect = {
  filter: { where: "selected = 1" },
  includedEffect: "drop-shadow(3px, 3px, 4px, #000000)"
};
```

### Bloom (Glow)
```javascript
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

### Combining Multiple Effects
```javascript
layer.featureEffect = {
  filter: { where: "status = 'active'" },
  includedEffect: "drop-shadow(2px, 2px, 3px) brightness(120%)",
  excludedEffect: "grayscale(100%) opacity(30%) blur(2px)"
};
```

## Filter Types

### Attribute Filter
```javascript
layer.featureEffect = {
  filter: {
    where: "population > 50000 AND state = 'CA'"
  },
  excludedEffect: "grayscale(100%) opacity(30%)"
};
```

### Geometry-Based Filter
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

### ObjectID Filter
```javascript
layerView.featureEffect = {
  filter: {
    objectIds: [1, 5, 10, 42]
  },
  includedEffect: "drop-shadow(3px, 3px, 4px)",
  excludedEffect: "grayscale(100%) opacity(40%)"
};
```

### Time-Based Filter
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

### Spatial Relationships

| Relationship | Description |
|-------------|-------------|
| `intersects` | Features that intersect the geometry |
| `contains` | Features that contain the geometry |
| `within` | Features within the geometry |
| `crosses` | Features that cross the geometry |
| `overlaps` | Features that overlap the geometry |
| `touches` | Features that touch the geometry |
| `disjoint` | Features not intersecting the geometry |
| `envelope-intersects` | Envelope intersection (faster) |

## Focus Areas (3D SceneView)

Focus areas highlight specific polygon regions in a 3D SceneView, dimming everything outside. Useful for drawing attention to areas of interest in 3D scenes.

### Creating a Focus Area
```javascript
import FocusArea from "@arcgis/core/effects/FocusArea.js";
import Collection from "@arcgis/core/core/Collection.js";

const focusArea = new FocusArea({
  title: "Area of Interest",
  id: "focus-1",
  enabled: true,
  outline: { color: [255, 128, 128, 0.55] },
  geometries: new Collection([polygon])
});
```

### Adding to a SceneView
```javascript
// Add focus area to the view
view.focusAreas.areas.add(focusArea);

// Set visual style: "bright" or "dark"
view.focusAreas.style = "bright";
```

### Toggling Focus Areas
```javascript
// Disable without removing
focusArea.enabled = false;

// Re-enable with different style
focusArea.enabled = true;
view.focusAreas.style = "dark";

// Remove entirely
view.focusAreas.areas.remove(focusArea);
```

### FocusArea Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Title of the focus area |
| `id` | `string` | Unique identifier (auto-generated if omitted) |
| `enabled` | `boolean` | Whether displayed (default: `true`) |
| `geometries` | `Collection<Polygon>` | Polygon geometries defining the focus |
| `outline` | `FocusAreaOutline` | Outline style: `{ color }` |

## Layer Effects (Non-Feature)

Apply CSS-like effects to an entire layer (not per-feature).

```javascript
// Apply effect to the whole layer
layer.effect = "bloom(1.5, 0.5px, 0.2)";

// Multiple effects
layer.effect = "drop-shadow(3px, 3px, 4px) brightness(120%)";

// Remove effect
layer.effect = null;
```

## Blend Modes

Blend modes control how a layer blends with layers beneath it.

```javascript
layer.blendMode = "multiply"; // Default is "normal"
```

### Blend Mode Categories

| Category | Modes |
|----------|-------|
| Darkening | `multiply`, `darken`, `color-burn` |
| Lightening | `screen`, `lighten`, `color-dodge` |
| Contrast | `overlay`, `soft-light`, `hard-light` |
| Component | `hue`, `saturation`, `luminosity`, `color` |
| Composite | `destination-in`, `destination-out`, `destination-over`, `source-in` |
| Inversion | `difference`, `exclusion`, `minus` |
| Other | `normal`, `average`, `vivid-light`, `reflect` |

### Common Blend Mode Patterns

```javascript
// Darken: show dark features on light basemap
layer.blendMode = "multiply";

// Lighten: show light features on dark basemap
layer.blendMode = "screen";

// Masking: clip layers using another layer shape
maskLayer.blendMode = "destination-in";
```

## Display Filters

Display filters completely hide features (better performance than effects since features are not rendered).

### Simple Display Filter
```javascript
layer.displayFilterInfo = {
  where: "population > 10000"
};
```

### Scale-Dependent Display Filter
```javascript
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  displayFilterInfo: {
    mode: "scale",
    filters: [
      {
        title: "Major rivers",
        minScale: 0,
        maxScale: 36_978_595,
        where: "streamOrder >= 8"
      },
      {
        title: "Large rivers",
        minScale: 36_978_595,
        maxScale: 18_489_297,
        where: "streamOrder >= 7"
      },
      {
        title: "All rivers",
        minScale: 4_622_324,
        maxScale: 0
      }
    ]
  }
});
```

### Checking Active Display Filter
```javascript
const layerView = await view.whenLayerView(layer);
const activeFilter = layerView.effectiveDisplayFilter?.title;
```

### Combining Display Filter with Feature Effect
```javascript
// Display filter hides deleted features entirely (performance)
layer.displayFilterInfo = {
  where: "status != 'deleted'"
};

// Feature effect styles remaining features
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

```javascript
import histogram from "@arcgis/core/smartMapping/statistics/histogram.js";

const histogramResult = await histogram({
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

## Reference Samples

- `featureeffect-geometry` - Geometry-based feature effects with spatial relationships
- `featureeffect-drop-shadow` - Scale-dependent drop shadow effects
- `featureeffect-layers-histogram` - Feature effects with histogram widget
- `featureeffect-multiple-effects` - Combining multiple visual effects
- `effect-blur-shadow` - Blur and shadow effects on layers
- `intro-effect-layer` - Introduction to layer effects
- `display-filter` - Scale-dependent display filtering
- `focus-area` - Focus areas in 3D SceneView
- `highlight-features-by-geometry` - Highlight features using geometry
- `blendmode-darkening` - Blend mode darkening effects
- `blendmode-grouplayer` - Blend modes on group layers
- `blendmode-multiple-layers` - Blend modes across multiple layers

## Common Pitfalls

1. **Layer vs LayerView**: Feature effects on `layer` affect all views; on `layerView` only that specific view.

   ```javascript
   // Affects all views
   layer.featureEffect = { ... };

   // Affects only this view
   const layerView = await view.whenLayerView(layer);
   layerView.featureEffect = { ... };
   ```

2. **Performance**: Complex effects (blur, bloom) on many features impact rendering performance. Use display filters to reduce the feature count first.

3. **Effect order**: When combining effects, they are applied in the order listed in the string.

4. **Display filter vs feature effect**: Use `displayFilterInfo` to hide features entirely (better performance). Use `featureEffect` to style included/excluded sets differently.

5. **Time extent filter**: Time-based filters require the layer to have time info configured. Without it, the filter is silently ignored.

6. **Spatial filter on LayerView only**: Geometry-based filters (`geometry`, `distance`) only work on `layerView.featureEffect`, not `layer.featureEffect`.

7. **Bloom parameters**: `bloom(strength, radius, threshold)` - threshold (0-1) controls which brightness level starts glowing. Higher values = less glow.

8. **Effect string syntax**: Effects are space-separated, not comma-separated. Incorrect syntax fails silently.

   ```javascript
   // Anti-pattern: comma-separated effects
   excludedEffect: "grayscale(100%), opacity(30%)"

   // Correct: space-separated effects
   excludedEffect: "grayscale(100%) opacity(30%)"
   ```

9. **Focus areas require Polygon geometry**: Only `Polygon` geometry is supported for `FocusArea.geometries`. Points and polylines are not supported.

10. **Scale-dependent effects**: When using the array format for scale-dependent effects, provide at least two stops for smooth interpolation between scales.

## Related Skills

- `arcgis-visualization` - Renderers and symbols
- `arcgis-smart-mapping` - Auto-generated renderers with histogram
- `arcgis-interaction` - User interaction and hit testing
- `arcgis-layers` - Layer types and configuration
- `arcgis-core-maps` - Map and view setup
