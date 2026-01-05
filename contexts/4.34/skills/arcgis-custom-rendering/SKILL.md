---
name: arcgis-custom-rendering
description: Create custom layer types with WebGL rendering, custom tile layers, and blend layers. Use for advanced visualizations and custom data sources.
---

# ArcGIS Custom Rendering

Use this skill for creating custom layers, WebGL rendering, and advanced visualization techniques.

## Custom TileLayer

### Basic Custom TileLayer
```javascript
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
import esriRequest from "@arcgis/core/request.js";
import Color from "@arcgis/core/Color.js";

const TintLayer = BaseTileLayer.createSubclass({
  properties: {
    urlTemplate: null,
    tint: {
      value: null,
      type: Color
    }
  },

  // Generate tile URL
  getTileUrl(level, row, col) {
    return this.urlTemplate
      .replace("{z}", level)
      .replace("{x}", col)
      .replace("{y}", row);
  },

  // Fetch and process tiles
  fetchTile(level, row, col, options) {
    const url = this.getTileUrl(level, row, col);

    return esriRequest(url, {
      responseType: "image",
      signal: options?.signal
    }).then((response) => {
      const image = response.data;
      const width = this.tileInfo.size[0];
      const height = this.tileInfo.size[0];

      // Create canvas for processing
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      // Apply tint
      if (this.tint) {
        context.fillStyle = this.tint.toCss();
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = "difference";
      }

      context.drawImage(image, 0, 0, width, height);
      return canvas;
    });
  }
});

// Use the custom layer
const customLayer = new TintLayer({
  urlTemplate: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
  tint: new Color("#132178"),
  title: "Custom Tinted Layer"
});

map.add(customLayer);
```

### Watch Property Changes
```javascript
const CustomLayer = BaseTileLayer.createSubclass({
  properties: {
    customProperty: null
  },

  initialize() {
    reactiveUtils.watch(
      () => this.customProperty,
      () => {
        this.refresh();  // Refresh tiles when property changes
      }
    );
  }
});
```

## Custom DynamicLayer

### Dynamic Layer from Canvas
```javascript
import BaseDynamicLayer from "@arcgis/core/layers/BaseDynamicLayer.js";

const CustomDynamicLayer = BaseDynamicLayer.createSubclass({
  properties: {
    data: null
  },

  // Called when layer needs to render
  getImageUrl(extent, width, height) {
    // Create canvas with specified dimensions
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    // Draw your custom visualization
    this.drawVisualization(context, extent, width, height);

    return canvas.toDataURL("image/png");
  },

  drawVisualization(ctx, extent, width, height) {
    // Convert geographic coordinates to pixel coordinates
    const xScale = width / (extent.xmax - extent.xmin);
    const yScale = height / (extent.ymax - extent.ymin);

    // Draw data points
    this.data.forEach(point => {
      const x = (point.x - extent.xmin) * xScale;
      const y = height - (point.y - extent.ymin) * yScale;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  }
});
```

## Custom Elevation Layer

### Exaggerated Elevation
```javascript
import BaseElevationLayer from "@arcgis/core/layers/BaseElevationLayer.js";

const ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
  properties: {
    exaggeration: 2
  },

  load() {
    this._elevation = new ElevationLayer({
      url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    this.addResolvingPromise(this._elevation.load());
  },

  fetchTile(level, row, col, options) {
    return this._elevation.fetchTile(level, row, col, options)
      .then((data) => {
        const exaggeration = this.exaggeration;
        for (let i = 0; i < data.values.length; i++) {
          data.values[i] *= exaggeration;
        }
        return data;
      });
  }
});
```

## Custom Blend Layer

### Blending Multiple Layers
```javascript
import BaseLayerViewGL2D from "@arcgis/core/views/2d/layers/BaseLayerViewGL2D.js";

const BlendLayer = Layer.createSubclass({
  properties: {
    layers: null,
    blendMode: "multiply"
  },

  createLayerView(view) {
    if (view.type === "2d") {
      return new BlendLayerView2D({
        view: view,
        layer: this
      });
    }
  }
});

const BlendLayerView2D = BaseLayerViewGL2D.createSubclass({
  render(renderParameters) {
    // Custom WebGL rendering
    const gl = renderParameters.context;
    // ... WebGL operations
  }
});
```

## WebGL Custom Rendering

### Custom LayerView with WebGL
```javascript
import BaseLayerViewGL2D from "@arcgis/core/views/2d/layers/BaseLayerViewGL2D.js";

const CustomLayerView2D = BaseLayerViewGL2D.createSubclass({
  constructor() {
    this.bindAttach = this.attach.bind(this);
    this.bindDetach = this.detach.bind(this);
    this.bindRender = this.render.bind(this);
  },

  attach() {
    const gl = this.context;

    // Create shaders
    const vertexSource = `
      attribute vec2 a_position;
      uniform mat3 u_transform;
      void main() {
        gl_Position = vec4((u_transform * vec3(a_position, 1)).xy, 0, 1);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;

    // Compile shaders and create program
    this.program = this.createProgram(gl, vertexSource, fragmentSource);
  },

  render(renderParameters) {
    const gl = renderParameters.context;
    const state = renderParameters.state;

    // Set up transformation matrix
    const transform = mat3.create();
    mat3.translate(transform, transform, [state.size[0] / 2, state.size[1] / 2]);

    gl.useProgram(this.program);
    // ... draw operations
  },

  detach() {
    const gl = this.context;
    gl.deleteProgram(this.program);
  }
});
```

## LERC Decoding

### Custom LERC Layer
```javascript
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
import esriRequest from "@arcgis/core/request.js";

// Import LERC decoder
import * as Lerc from "https://cdn.jsdelivr.net/npm/lerc@4.0.4/+esm";

const LercLayer = BaseTileLayer.createSubclass({
  properties: {
    urlTemplate: null,
    minValue: 0,
    maxValue: 1000
  },

  fetchTile(level, row, col, options) {
    const url = this.urlTemplate
      .replace("{z}", level)
      .replace("{x}", col)
      .replace("{y}", row);

    return esriRequest(url, {
      responseType: "array-buffer",
      signal: options?.signal
    }).then((response) => {
      // Decode LERC data
      const decodedPixels = Lerc.decode(response.data);
      const { width, height, pixels } = decodedPixels;

      // Convert to canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);

      // Map values to colors
      for (let i = 0; i < pixels[0].length; i++) {
        const value = pixels[0][i];
        const normalized = (value - this.minValue) / (this.maxValue - this.minValue);
        const color = this.valueToColor(normalized);

        imageData.data[i * 4] = color.r;
        imageData.data[i * 4 + 1] = color.g;
        imageData.data[i * 4 + 2] = color.b;
        imageData.data[i * 4 + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas;
    });
  },

  valueToColor(value) {
    // Simple blue-to-red color ramp
    return {
      r: Math.round(value * 255),
      g: 0,
      b: Math.round((1 - value) * 255)
    };
  }
});
```

## Custom Graphics Rendering

### Animated Lines with WebGL
```javascript
// Animated lines require custom render nodes in 3D
// or custom LayerView in 2D

const view = new SceneView({
  container: "viewDiv",
  map: map
});

// Use external render node for animations
view.when(() => {
  // Add custom render node
  const renderNode = new CustomRenderNode({ view });
  view.environment.lighting = {
    type: "virtual"
  };
});
```

## Tessellation Helpers

### Using Tessellation for Complex Geometries
```javascript
import tessellate from "@arcgis/core/geometry/support/tessellate.js";

// Tessellate a polygon for WebGL rendering
const polygon = new Polygon({
  rings: [[/* coordinates */]]
});

const tessellated = tessellate(polygon);
// Use tessellated.vertices and tessellated.indices for WebGL
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
  </style>
  <script type="module">
    import Map from "@arcgis/core/Map.js";
    import SceneView from "@arcgis/core/views/SceneView.js";
    import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
    import esriRequest from "@arcgis/core/request.js";
    import Color from "@arcgis/core/Color.js";

    // Create custom tinted tile layer
    const TintLayer = BaseTileLayer.createSubclass({
      properties: {
        urlTemplate: null,
        tint: { value: null, type: Color }
      },

      getTileUrl(level, row, col) {
        return this.urlTemplate
          .replace("{z}", level)
          .replace("{x}", col)
          .replace("{y}", row);
      },

      fetchTile(level, row, col, options) {
        return esriRequest(this.getTileUrl(level, row, col), {
          responseType: "image",
          signal: options?.signal
        }).then((response) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = canvas.height = this.tileInfo.size[0];

          if (this.tint) {
            ctx.fillStyle = this.tint.toCss();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "difference";
          }

          ctx.drawImage(response.data, 0, 0, canvas.width, canvas.height);
          return canvas;
        });
      }
    });

    const customLayer = new TintLayer({
      urlTemplate: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
      tint: new Color("#4488ff"),
      title: "Custom Layer"
    });

    const map = new Map({ layers: [customLayer] });

    const view = new SceneView({
      container: "viewDiv",
      map: map,
      center: [8.5, 46],
      zoom: 8
    });
  </script>
</head>
<body>
  <div id="viewDiv"></div>
</body>
</html>
```

## Common Pitfalls

1. **CORS**: External tile servers must support CORS

2. **Canvas size**: Match tile size exactly with tileInfo

3. **Memory management**: Clean up WebGL resources in detach()

4. **Async operations**: Handle abort signals properly

5. **Coordinate systems**: Transform coordinates correctly for rendering

