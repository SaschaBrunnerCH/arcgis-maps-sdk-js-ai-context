---
name: arcgis-custom-rendering
description: Create custom layer types with WebGL rendering using RenderNode, BaseLayerViewGL2D, BaseTileLayer, and BaseDynamicLayer. Use for advanced visualizations, custom data sources, and post-processing effects.
---

# ArcGIS Custom Rendering

Use this skill for creating custom layers, WebGL rendering in 2D/3D, custom tile sources, and post-processing effects in SceneView.

## Import Patterns

### ESM (npm)
```javascript
// 3D custom rendering
import RenderNode from "@arcgis/core/views/3d/webgl/RenderNode.js";

// 2D custom rendering
import BaseLayerView2D from "@arcgis/core/views/2d/layers/BaseLayerView2D.js";
import BaseLayerViewGL2D from "@arcgis/core/views/2d/layers/BaseLayerViewGL2D.js";

// Custom layer bases
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
import BaseDynamicLayer from "@arcgis/core/layers/BaseDynamicLayer.js";
import BaseElevationLayer from "@arcgis/core/layers/BaseElevationLayer.js";
import Layer from "@arcgis/core/layers/Layer.js";

// Utilities
import esriRequest from "@arcgis/core/request.js";
import Color from "@arcgis/core/Color.js";
```

### CDN (dynamic import)
```javascript
const RenderNode = await $arcgis.import("@arcgis/core/views/3d/webgl/RenderNode.js");
const BaseTileLayer = await $arcgis.import("@arcgis/core/layers/BaseTileLayer.js");
const BaseLayerViewGL2D = await $arcgis.import("@arcgis/core/views/2d/layers/BaseLayerViewGL2D.js");
```

## Custom Rendering Summary

| Class | 2D | 3D | Typical Use |
|-------|----|----|-------------|
| `RenderNode` | — | Yes | Post-processing effects in SceneView |
| `BaseLayerView2D` | Yes | — | Custom 2D canvas rendering |
| `BaseLayerViewGL2D` | Yes | — | WebGL-accelerated 2D rendering |
| `BaseTileLayer` | Yes | Yes | Custom tile sources and processing |
| `BaseDynamicLayer` | Yes | Yes | On-demand dynamic rendering |
| `BaseElevationLayer` | — | Yes | Custom elevation/terrain data |

## RenderNode (3D Post-Processing)

RenderNode creates custom rendering passes in SceneView's WebGL 2 pipeline.

### Basic RenderNode

```javascript
const LuminanceRenderNode = RenderNode.createSubclass({
  constructor() {
    this.consumes = { required: ["composite-color"] };
    this.produces = "composite-color";
  },

  render(inputs) {
    const input = inputs.find(({ name }) => name === "composite-color");
    const colorTexture = input.getTexture();
    const output = this.acquireOutputFramebuffer();
    const gl = this.gl;

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.uniform1i(this.texLocation, 0);

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Preserve depth from input
    output.attachDepth(input.getAttachment(gl.DEPTH_STENCIL_ATTACHMENT));
    return output;
  },

  destroy() {
    if (this.program) this.gl?.deleteProgram(this.program);
    if (this.vao) this.gl?.deleteVertexArray(this.vao);
  }
});

// Add to SceneView
const view = new SceneView({ container: "viewDiv", map });
view.when(() => {
  new LuminanceRenderNode({ view });
});
```

### RenderNode Key Concepts

| Property/Method | Description |
|-----------------|-------------|
| `consumes` | Render targets this node needs as input (e.g., `{ required: ["composite-color"] }`) |
| `produces` | Name of the render target produced (set `null` to disable) |
| `gl` | WebGL 2 context (read-only) |
| `view` | Reference to SceneView |
| `render(inputs)` | Override to implement rendering logic |
| `acquireOutputFramebuffer()` | Get framebuffer to render into |
| `requestRender()` | Request a new frame |

### RenderNode Enable/Disable

```javascript
const MyRenderNode = RenderNode.createSubclass({
  properties: {
    enabled: {
      get() { return this.produces != null; },
      set(value) {
        this.produces = value ? "composite-color" : null;
        this.requestRender();
      }
    }
  }
});
```

### GLSL ES 3.0 Fragment Shader Example

```glsl
#version 300 es
precision highp float;
out lowp vec4 fragColor;
in vec2 uv;
uniform sampler2D colorTex;

void main() {
  vec4 color = texture(colorTex, uv);
  // Luminance (grayscale) conversion
  fragColor = vec4(vec3(dot(color.rgb, vec3(0.2126, 0.7152, 0.0722))), color.a);
}
```

## Custom TileLayer

### Basic Custom TileLayer

```javascript
const TintLayer = BaseTileLayer.createSubclass({
  properties: {
    urlTemplate: null,
    tint: {
      value: null,
      type: Color
    }
  },

  getTileUrl(level, row, col) {
    return this.urlTemplate
      .replace("{z}", level)
      .replace("{x}", col)
      .replace("{y}", row);
  },

  fetchTile(level, row, col, options) {
    const url = this.getTileUrl(level, row, col);

    return esriRequest(url, {
      responseType: "image",
      signal: options?.signal
    }).then((response) => {
      const image = response.data;
      const width = this.tileInfo.size[0];
      const height = this.tileInfo.size[0];

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

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

const customLayer = new TintLayer({
  urlTemplate: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
  tint: new Color("#132178"),
  title: "Custom Tinted Layer"
});

map.add(customLayer);
```

### BaseTileLayer Key Methods

| Method | Description |
|--------|-------------|
| `getTileUrl(level, row, col)` | Return URL string for a tile |
| `fetchTile(level, row, col, options)` | Fetch and optionally process tile; return canvas or image |
| `load()` | Called when layer loads |
| `refresh()` | Reload all tiles |

### Watch Property Changes

```javascript
const CustomLayer = BaseTileLayer.createSubclass({
  properties: {
    customProperty: null
  },

  initialize() {
    reactiveUtils.watch(
      () => this.customProperty,
      () => this.refresh()
    );
  }
});
```

## Custom DynamicLayer

```javascript
const CustomDynamicLayer = BaseDynamicLayer.createSubclass({
  properties: {
    data: null
  },

  getImageUrl(extent, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    // Convert geo coords to pixel coords
    const xScale = width / (extent.xmax - extent.xmin);
    const yScale = height / (extent.ymax - extent.ymin);

    this.data.forEach(point => {
      const x = (point.x - extent.xmin) * xScale;
      const y = height - (point.y - extent.ymin) * yScale;
      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2);
      context.fillStyle = "red";
      context.fill();
    });

    return canvas.toDataURL("image/png");
  }
});
```

## Custom Elevation Layer

```javascript
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

## WebGL Custom 2D Rendering (BaseLayerViewGL2D)

### Custom LayerView with WebGL

```javascript
const CustomGLLayerView = BaseLayerViewGL2D.createSubclass({
  attach() {
    const gl = this.context;
    this.program = this.createShaderProgram(gl);
    this.buffer = gl.createBuffer();
    this.vao = gl.createVertexArray();
  },

  render(renderParameters) {
    const gl = renderParameters.context;
    const { displayViewMatrix3, size } = renderParameters.state;

    gl.useProgram(this.program);
    gl.uniformMatrix3fv(
      gl.getUniformLocation(this.program, "u_matrix"),
      false,
      displayViewMatrix3
    );
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  },

  detach() {
    const gl = this.context;
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.buffer);
    gl.deleteVertexArray(this.vao);
  }
});
```

### Custom Layer with createLayerView

```javascript
const CustomLayer = Layer.createSubclass({
  createLayerView(view) {
    if (view.type === "2d") {
      return new CustomGLLayerView({ view, layer: this });
    }
  }
});
```

### BaseLayerView2D (Canvas-based)

```javascript
const CustomLayerView2D = BaseLayerView2D.createSubclass({
  attach() {
    // Initialize resources
  },

  render(renderParameters) {
    const { context, state } = renderParameters;
    const ctx = context; // CanvasRenderingContext2D

    // state.size — viewport size [width, height]
    // state.resolution — map units per pixel
    // state.extent — current visible extent

    const screenPoint = state.toScreen(state.center);
    ctx.fillStyle = "red";
    ctx.fillRect(screenPoint[0] - 5, screenPoint[1] - 5, 10, 10);
  },

  detach() {
    // Clean up resources
  }
});
```

### LayerView Lifecycle

| Method | Description |
|--------|-------------|
| `attach()` | Called when LayerView is added to view — init resources |
| `render(renderParameters)` | Called every frame to draw content |
| `detach()` | Called when LayerView is removed — clean up resources |
| `requestRender()` | Request a re-render on next frame |

## LERC Decoding

```javascript
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
      const decodedPixels = Lerc.decode(response.data);
      const { width, height, pixels } = decodedPixels;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < pixels[0].length; i++) {
        const value = pixels[0][i];
        const normalized = (value - this.minValue) / (this.maxValue - this.minValue);
        imageData.data[i * 4] = Math.round(normalized * 255);
        imageData.data[i * 4 + 1] = 0;
        imageData.data[i * 4 + 2] = Math.round((1 - normalized) * 255);
        imageData.data[i * 4 + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas;
    });
  }
});
```

## Custom Blend Layer

```javascript
const BlendLayer = BaseTileLayer.createSubclass({
  properties: {
    multiplyLayers: null
  },

  load() {
    this.multiplyLayers.forEach((layer) => {
      this.addResolvingPromise(layer.load());
    });
  },

  fetchTile(level, row, col, options) {
    const tilePromises = this.multiplyLayers.map((layer) =>
      layer.fetchTile(level, row, col, options)
    );

    return Promise.all(tilePromises).then((images) => {
      const width = this.tileInfo.size[0];
      const height = this.tileInfo.size[1];
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(images[0], 0, 0, width, height);
      ctx.globalCompositeOperation = "multiply";
      for (let i = 1; i < images.length; i++) {
        ctx.drawImage(images[i], 0, 0, width, height);
      }
      return canvas;
    });
  }
});
```

## Common Pitfalls

1. **CORS**: External tile servers must support CORS for canvas-based processing.

2. **Canvas size**: Match tile size exactly with `tileInfo.size[0]` — mismatches cause rendering artifacts.

3. **Memory management**: Always clean up WebGL resources (programs, buffers, VAOs, textures) in `detach()` or `destroy()`.

4. **Abort signals**: Always pass `options?.signal` to `esriRequest` for proper cancellation.

5. **Coordinate systems**: Use `displayViewMatrix3` for pixel-aligned rendering, `viewMatrix3` for map-coordinate rendering.

6. **RenderNode WebGL version**: SceneView uses WebGL 2 — shaders must use `#version 300 es`.

7. **createSubclass pattern**: Use `BaseTileLayer.createSubclass({...})` — do not use ES6 `class extends`.

## Reference Samples

- `layers-custom-tilelayer` — Custom tinted tile layer
- `layers-custom-blendlayer` — Multi-layer blending
- `layers-custom-lerc-2d` — LERC data decoding
- `layers-custom-elevation-exaggerated` — Elevation exaggeration
- `layers-custom-dynamiclayer` — Dynamic on-demand rendering
- `custom-gl-tiles` — WebGL tile rendering
- `custom-gl-visuals` — Complex WebGL visualizations
- `custom-gl-animated-lines` — Animated line rendering
- `custom-render-node-color` — RenderNode color post-processing
- `custom-render-node-dof` — Depth of field effect
- `custom-render-node-windmills` — 3D geometry rendering
- `custom-lv-deckgl` — deck.gl integration

## Related Skills

- `arcgis-3d-layers` — SceneLayer, PointCloudLayer, VoxelLayer
- `arcgis-scene-environment` — Lighting, weather, atmosphere
- `arcgis-layers` — Standard layer types
- `arcgis-performance` — Rendering optimization
