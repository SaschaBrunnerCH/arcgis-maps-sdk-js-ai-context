---
name: arcgis-interaction
description: Handle user interaction with map views including hit testing, feature highlighting, sketching, and event handling.
---

# ArcGIS Interaction

Use this skill when implementing user interactions like hit testing, feature highlighting, sketching, coordinate conversion, and event handling.

## Import Patterns

### Direct ESM Imports
```javascript
import Draw from "@arcgis/core/views/draw/Draw.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
```

### Dynamic Imports (CDN)
```javascript
const Draw = await $arcgis.import("@arcgis/core/views/draw/Draw.js");
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");
```

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Hit Testing

### Basic Hit Test
```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event);

  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked feature:", graphic.attributes);
  }
});
```

### Hit Test with Layer Filter
```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event, {
    include: [featureLayer] // Only test this layer
  });

  // Or exclude layers
  const response2 = await view.hitTest(event, {
    exclude: [graphicsLayer]
  });
});
```

### Pointer Move Hit Test
```javascript
view.on("pointer-move", async (event) => {
  const response = await view.hitTest(event, {
    include: featureLayer
  });

  if (response.results.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
});
```

### Hit Test Result Types

The `hitTest` returns `ViewHitTestResult` containing an array of result objects. Each result has a `type`:

| Result Type | Description |
|-------------|-------------|
| `graphic` | A graphic from a layer or GraphicsLayer |
| `media` | A media element hit (images in popups) |
| `route` | A route hit from RouteLayer |

```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event);

  response.results.forEach((result) => {
    if (result.type === "graphic") {
      console.log("Layer:", result.graphic.layer.title);
      console.log("Attributes:", result.graphic.attributes);
    }
  });
});
```

## Highlighting

### Highlight Features
```javascript
const layerView = await view.whenLayerView(featureLayer);

// Highlight a single feature
const highlight = layerView.highlight(graphic);

// Highlight multiple features
const highlight = layerView.highlight([graphic1, graphic2]);

// Highlight by object IDs
const highlight = layerView.highlight([1, 2, 3]);

// Remove highlight
highlight.remove();
```

### Highlight on Click
```javascript
let highlightHandle;

view.on("click", async (event) => {
  // Remove previous highlight
  if (highlightHandle) {
    highlightHandle.remove();
  }

  const response = await view.hitTest(event, { include: featureLayer });

  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    const layerView = await view.whenLayerView(featureLayer);
    highlightHandle = layerView.highlight(graphic);
  }
});
```

### Highlight Options
```javascript
// Set highlight options on the view
view.highlightOptions = {
  color: [255, 255, 0, 1],
  haloOpacity: 0.9,
  fillOpacity: 0.2
};
```

## Sketching

### Sketch Component (Simplest)
```html
<arcgis-map basemap="topo-vector" center="139.5716,35.696" zoom="18">
  <arcgis-sketch slot="top-right" creation-mode="update"></arcgis-sketch>
</arcgis-map>
```

The `arcgis-sketch` component provides drawing tools for point, polyline, polygon, rectangle, and circle geometries with snapping, undo/redo, and selection support.

**Key Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `creation-mode` | `"single"` \| `"update"` \| `"continuous"` | How sketched graphics are handled after creation |
| `available-create-tools` | string | Comma-separated list of enabled create tools |
| `multiple-selection-enabled` | boolean | Allow selecting multiple graphics |
| `update-on-graphic-click` | boolean | Start updating when clicking a graphic |

**Key Events:**

| Event | Description |
|-------|-------------|
| `arcgisCreate` | Fires during graphic creation |
| `arcgisUpdate` | Fires during graphic update |
| `arcgisDelete` | Fires when graphics are deleted |
| `arcgisUndo` | Fires on undo |
| `arcgisRedo` | Fires on redo |

**Key Methods:**

| Method | Description |
|--------|-------------|
| `create(tool)` | Start creating a graphic (`"point"`, `"polyline"`, `"polygon"`, `"rectangle"`, `"circle"`) |
| `update(graphics)` | Start updating graphics |
| `delete()` | Delete selected graphics |
| `undo()` / `redo()` | Undo/redo last action |

### Sketch Component with Events
```html
<arcgis-map basemap="topo-vector">
  <arcgis-sketch slot="top-right" creation-mode="update"></arcgis-sketch>
</arcgis-map>

<script type="module">
  const sketch = document.querySelector("arcgis-sketch");

  sketch.addEventListener("arcgisCreate", (event) => {
    const { state, graphic } = event.detail;
    if (state === "complete") {
      console.log("Created:", graphic.geometry.type);
    }
  });

  sketch.addEventListener("arcgisUpdate", (event) => {
    const { state, graphics } = event.detail;
    if (state === "complete") {
      console.log("Updated:", graphics.length, "graphics");
    }
  });

  sketch.addEventListener("arcgisDelete", (event) => {
    console.log("Deleted:", event.detail.graphics.length, "graphics");
  });
</script>
```

### Sketch Widget (Core API)
```javascript
import Sketch from "@arcgis/core/widgets/Sketch.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

const sketch = new Sketch({
  view: view,
  layer: graphicsLayer,
  creationMode: "update" // or "single", "continuous"
});

view.ui.add(sketch, "top-right");

// Listen for events
sketch.on("create", (event) => {
  if (event.state === "complete") {
    console.log("Created:", event.graphic);
  }
});

sketch.on("update", (event) => {
  if (event.state === "complete") {
    console.log("Updated:", event.graphics);
  }
});

sketch.on("delete", (event) => {
  console.log("Deleted:", event.graphics);
});
```

### Draw Tool (Low-level)
```javascript
import Draw from "@arcgis/core/views/draw/Draw.js";

const draw = new Draw({ view: view });

// Create a polygon
const action = draw.create("polygon");

action.on("vertex-add", (event) => {
  console.log("Vertex added:", event.vertices);
});

action.on("draw-complete", (event) => {
  const polygon = {
    type: "polygon",
    rings: event.vertices,
    spatialReference: view.spatialReference
  };
  // Create graphic with polygon
});
```

## Event Handling

### View Events
```javascript
// Click (waits for potential double-click delay)
view.on("click", (event) => {
  console.log("Map point:", event.mapPoint);
  console.log("Screen point:", event.x, event.y);
});

// Immediate-click (fires without delay, recommended for hit testing)
view.on("immediate-click", (event) => {
  console.log("Immediate click at:", event.mapPoint);
});

// Double-click
view.on("double-click", (event) => {
  event.stopPropagation(); // Prevent default zoom
});

// Immediate-double-click (cannot be prevented by immediate-click stopPropagation)
view.on("immediate-double-click", (event) => {
  console.log("Double clicked");
});

// Pointer move
view.on("pointer-move", (event) => {
  const point = view.toMap(event);
  console.log("Coordinates:", point.longitude, point.latitude);
});

// Drag
view.on("drag", (event) => {
  if (event.action === "start") { }
  if (event.action === "update") { }
  if (event.action === "end") { }
});

// Key events
view.on("key-down", (event) => {
  if (event.key === "Escape") {
    // Cancel operation
  }
});
```

> **Tip:** Use `immediate-click` instead of `click` when responding to user clicks without delay (e.g., for hit testing). The `click` event waits to check for a double-click, which adds latency.

### Property Watching with reactiveUtils
```javascript
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// Watch for view stationary state
reactiveUtils.when(
  () => view.stationary === true,
  () => {
    console.log("Navigation complete, extent:", view.extent);
  }
);

// Watch zoom changes
reactiveUtils.watch(
  () => view.zoom,
  (zoom) => {
    console.log("Zoom changed to:", zoom);
  }
);

// Watch multiple properties
reactiveUtils.watch(
  () => [view.center, view.zoom],
  ([center, zoom]) => {
    console.log("View changed:", center, zoom);
  }
);

// One-time wait
await reactiveUtils.whenOnce(() => view.ready);
console.log("View is ready");
```

### Layer Events
```javascript
const layerView = await view.whenLayerView(featureLayer);

reactiveUtils.watch(
  () => layerView.updating,
  (updating) => {
    if (!updating) {
      console.log("Layer update complete");
    }
  }
);
```

## Coordinate Conversion

```javascript
// Screen to map coordinates
const mapPoint = view.toMap({ x: screenX, y: screenY });

// Map to screen coordinates
const screenPoint = view.toScreen(mapPoint);
```

## Programmatic Popup Control

> For detailed PopupTemplate configuration, see `arcgis-popup-templates`.

```javascript
// Open popup programmatically
view.openPopup({
  title: "Custom Popup",
  content: "Hello World",
  location: view.center
});

// Close popup
view.closePopup();
```

## Complete Example: Hit Test with Highlight

### Map Components
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <arcgis-map basemap="streets-navigation-vector" center="-118.805,34.027" zoom="13">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>

  <script type="module">
    const [FeatureLayer] = await $arcgis.import([
      "@arcgis/core/layers/FeatureLayer.js"
    ]);

    const mapElement = document.querySelector("arcgis-map");
    const view = await mapElement.view;
    await view.when();

    const featureLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
    });
    mapElement.map.add(featureLayer);

    let highlightHandle;

    view.on("pointer-move", async (event) => {
      const response = await view.hitTest(event, { include: featureLayer });

      if (highlightHandle) {
        highlightHandle.remove();
        highlightHandle = null;
      }

      if (response.results.length > 0) {
        const graphic = response.results[0].graphic;
        const layerView = await view.whenLayerView(featureLayer);
        highlightHandle = layerView.highlight(graphic);
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    });
  </script>
</body>
</html>
```

## Reference Samples

- `view-hittest` - Hit testing to identify features at screen coordinates
- `map-component-hittest` - Access features with hitTest using Map Components
- `sketch` - Sketch component for drawing geometries
- `sketch-geometries` - Sketching geometries with the Sketch widget
- `sketch-update-validation` - Validating sketch updates
- `sketch-snapping-magnifier` - Snapping and magnifier with Sketch

## Common Pitfalls

1. **Highlight handle leak**: Creating new highlights without removing previous ones causes memory leaks.

   ```javascript
   // Anti-pattern: creating highlights without cleaning up previous ones
   view.on("pointer-move", async (event) => {
     const response = await view.hitTest(event);
     if (response.results.length > 0) {
       const feature = response.results[0].graphic;
       // New highlight created every pointer-move - old ones never removed
       layerView.highlight(feature);
     }
   });
   ```

   ```javascript
   // Correct: store handle and remove before creating a new highlight
   let highlightHandle = null;

   view.on("pointer-move", async (event) => {
     const response = await view.hitTest(event);
     if (highlightHandle) {
       highlightHandle.remove();
       highlightHandle = null;
     }
     if (response.results.length > 0) {
       const feature = response.results[0].graphic;
       highlightHandle = layerView.highlight(feature);
     }
   });
   ```

   **Impact:** Each pointer-move adds another highlight without removing the previous one. Highlights accumulate visually and in memory, causing performance degradation.

2. **Events fire multiple times**: Adding event listeners repeatedly without cleanup causes handler accumulation.

   ```javascript
   // Anti-pattern: adding listeners in a function that gets called multiple times
   function setupInteraction() {
     view.on("click", async (event) => {
       const result = await view.hitTest(event);
       console.log("Clicked:", result);
     });
   }
   setupInteraction(); // First handler
   setupInteraction(); // Second handler - now click fires twice
   ```

   ```javascript
   // Correct: store handle and remove before re-adding, or add once
   let clickHandle = null;

   function setupInteraction() {
     if (clickHandle) {
       clickHandle.remove();
     }
     clickHandle = view.on("click", async (event) => {
       const result = await view.hitTest(event);
       console.log("Clicked:", result);
     });
   }
   ```

   **Impact:** Each call to the setup function adds another listener. Clicks fire multiple duplicate callbacks.

3. **Hit test returns nothing**: Check if layers are included/excluded correctly, and ensure the view is ready.

4. **Using click instead of immediate-click**: The `click` event has a built-in delay to check for double-clicks. Use `immediate-click` for responsive hit testing.

5. **Popup not showing**: Ensure layer has `popupEnabled: true` (default) and a `popupTemplate` set.

## Related Skills

- See `arcgis-popup-templates` for detailed PopupTemplate configuration.
- See `arcgis-editing` for feature editing workflows.
- See `arcgis-core-maps` for view initialization and navigation.
