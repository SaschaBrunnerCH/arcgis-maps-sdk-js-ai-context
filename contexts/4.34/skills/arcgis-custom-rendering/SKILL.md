---
name: arcgis-custom-rendering
description: Create custom layer types by extending BaseLayerView2D/3D with WebGL rendering, custom tile layers, and blend layers. Use for advanced visualizations and custom data sources.
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

## LayerView Architecture

Custom layers work through the LayerView pattern: a Layer defines data and properties, while its LayerView handles rendering in a specific view type.

### BaseLayerView2D

For 2D custom rendering without WebGL:

```javascript
import BaseLayerView2D from "@arcgis/core/views/2d/layers/BaseLayerView2D.js";
import Layer from "@arcgis/core/layers/Layer.js";

const CustomLayer = Layer.createSubclass({
  createLayerView(view) {
    if (view.type === "2d") {
      return new CustomLayerView2D({ view, layer: this });
    }
  }
});

const CustomLayerView2D = BaseLayerView2D.createSubclass({
  // Called when the LayerView is attached to the view
  attach() {
    // Initialize resources (canvas, data structures)
  },

  // Called every frame when the layer needs to render
  render(renderParameters) {
    const { context, state, stationary } = renderParameters;
    const ctx = context; // CanvasRenderingContext2D

    // state.size — viewport size [width, height]
    // state.resolution — map units per pixel
    // state.extent — current visible extent
    // state.rotation — current map rotation

    // Convert map coordinates to screen coordinates
    const screenPoint = state.toScreen(state.center);

    ctx.fillStyle = "red";
    ctx.fillRect(screenPoint[0] - 5, screenPoint[1] - 5, 10, 10);
  },

  // Called when the LayerView is detached
  detach() {
    // Clean up resources
  }
});
```

### BaseLayerViewGL2D

For 2D custom rendering with WebGL:

```javascript
import BaseLayerViewGL2D from "@arcgis/core/views/2d/layers/BaseLayerViewGL2D.js";

const CustomGLLayerView = BaseLayerViewGL2D.createSubclass({
  attach() {
    const gl = this.context; // WebGLRenderingContext

    // Create shaders, buffers, programs
    this.program = this.createShaderProgram(gl);
    this.buffer = gl.createBuffer();
  },

  render(renderParameters) {
    const gl = renderParameters.context;
    const { displayViewMatrix3, viewMatrix3, size } = renderParameters.state;

    gl.useProgram(this.program);

    // Use displayViewMatrix3 for pixel-aligned rendering
    // Use viewMatrix3 for map-coordinate rendering
    gl.uniformMatrix3fv(
      gl.getUniformLocation(this.program, "u_matrix"),
      false,
      renderParameters.state.displayViewMatrix3
    );

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  },

  detach() {
    const gl = this.context;
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.buffer);
  },

  // Request re-render when data changes
  requestRender() {
    this.requestRender();
  }
});
```

### 3D Custom Rendering with RenderNode

For 3D custom rendering in SceneView:

```javascript
import RenderNode from "@arcgis/core/views/3d/webgl/RenderNode.js";

const CustomRenderNode = RenderNode.createSubclass({
  consumes: { required: ["composite-color"] },
  produces: "composite-color",

  initialize() {
    this.addHandles(
      reactiveUtils.watch(() => this.view.ready, (ready) => {
        if (ready) this.setup();
      })
    );
  },

  setup() {
    const gl = this.gl; // WebGL2RenderingContext
    // Create shaders, buffers, textures
  },

  render(inputs) {
    const output = this.bindRenderTarget();
    const gl = this.gl;
    const camera = this.camera;

    // camera.viewMatrix — view transformation
    // camera.projectionMatrix — projection transformation
    // camera.eye — camera position in world space

    // Draw custom 3D content
    this.drawCustomContent(gl, camera);

    // Pass through the composite color
    this.requestRender();
  },

  destroy() {
    // Clean up WebGL resources
  }
});

// Add render node to SceneView
const view = new SceneView({ container: "viewDiv", map });
view.when(() => {
  new CustomRenderNode({ view });
});
```

### LayerView Properties and Methods

| Property/Method | Description |
|----------------|-------------|
| `layer` | Reference to the associated Layer |
| `view` | Reference to the MapView or SceneView |
| `suspended` | Whether the LayerView is suspended (not visible) |
| `updating` | Whether the LayerView is updating |
| `visible` | Whether the LayerView is visible |
| `requestRender()` | Request a re-render on next frame |
| `attach()` | Called when LayerView is added to view |
| `detach()` | Called when LayerView is removed from view |
| `render()` | Called every frame to draw content |

## Reference Samples

- `layers-custom-tilelayer` - Creating custom tile layers
- `layers-custom-blendlayer` - Custom blend layer implementation
- `custom-gl-tiles` - Custom WebGL tile rendering
- `custom-gl-visuals` - Custom WebGL visual effects
- `custom-layerview-2d` - Custom BaseLayerView2D implementation

## Common Pitfalls

1. **CORS**: External tile servers must support CORS

2. **Canvas size**: Match tile size exactly with tileInfo

3. **Memory management**: Clean up WebGL resources in detach()

4. **Async operations**: Handle abort signals properly

5. **Coordinate systems**: Transform coordinates correctly for rendering

