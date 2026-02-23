---
name: arcgis-interaction
description: Handle user interaction with map views including hit testing, feature highlighting, sketching, and event handling. Use for interactive map applications with feature selection and custom interactions.
---

# ArcGIS Interaction

Use this skill when implementing user interactions like popups, editing, sketching, hit testing, and event handling.

## Popups

> For detailed PopupTemplate configuration, content elements, field formatting, Arcade expressions, and custom actions, see [arcgis-popup-templates](../arcgis-popup-templates/SKILL.md).

### Programmatic Popup Control

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
// Set highlight options on the layer view
layerView.highlightOptions = {
  color: [255, 255, 0, 1],
  haloOpacity: 0.9,
  fillOpacity: 0.2
};
```

## Editing

### Editor Component (Simplest)
```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-editor slot="top-right"></arcgis-editor>
</arcgis-map>
```

### Editor Widget
```javascript
import Editor from "@arcgis/core/widgets/Editor.js";

const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    formTemplate: {
      elements: [
        { type: "field", fieldName: "name" },
        { type: "field", fieldName: "description" }
      ]
    }
  }]
});

view.ui.add(editor, "top-right");
```

### FeatureForm
```javascript
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";

const featureForm = new FeatureForm({
  container: "formDiv",
  layer: featureLayer,
  formTemplate: {
    title: "Edit Feature",
    elements: [
      {
        type: "field",
        fieldName: "name",
        label: "Name"
      },
      {
        type: "field",
        fieldName: "type",
        label: "Type"
      }
    ]
  }
});

// Set feature to edit
featureForm.feature = graphic;

// Listen for submit
featureForm.on("submit", () => {
  const values = featureForm.getValues();
  // Update feature attributes
  Object.keys(values).forEach(key => {
    graphic.attributes[key] = values[key];
  });
});

// Submit programmatically
featureForm.submit();
```

### applyEdits API

```javascript
// Add features
const edits = {
  addFeatures: [newGraphic]
};
const result = await featureLayer.applyEdits(edits);
console.log("Added:", result.addFeatureResults);

// Update features
const edits = {
  updateFeatures: [updatedGraphic]
};
const result = await featureLayer.applyEdits(edits);

// Delete features
const edits = {
  deleteFeatures: [graphicToDelete]
};
const result = await featureLayer.applyEdits(edits);

// Combined edits
const edits = {
  addFeatures: [newGraphic1, newGraphic2],
  updateFeatures: [updatedGraphic],
  deleteFeatures: [deleteGraphic]
};
const result = await featureLayer.applyEdits(edits);
```

## Sketching

### Sketch Component (Simplest)
```html
<arcgis-map basemap="topo-vector">
  <arcgis-sketch slot="top-right" creation-mode="update"></arcgis-sketch>
</arcgis-map>
```

### Sketch Widget
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
// Click
view.on("click", (event) => {
  console.log("Map point:", event.mapPoint);
  console.log("Screen point:", event.x, event.y);
});

// Double-click
view.on("double-click", (event) => {
  event.stopPropagation(); // Prevent default zoom
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

### Property Watching
```javascript
// Watch single property
view.watch("zoom", (newZoom) => {
  console.log("Zoom changed to:", newZoom);
});

// Watch multiple properties
view.watch(["center", "zoom"], ([center, zoom]) => {
  console.log("View changed:", center, zoom);
});

// Watch stationary (after navigation completes)
view.watch("stationary", (isStationary) => {
  if (isStationary) {
    console.log("Navigation complete");
  }
});

// One-time watch
import { when } from "@arcgis/core/core/reactiveUtils.js";

await when(() => view.stationary === true);
console.log("View is now stationary");
```

### Layer Events
```javascript
// Layer view updating
const layerView = await view.whenLayerView(featureLayer);

layerView.watch("updating", (updating) => {
  if (updating) {
    console.log("Layer is updating...");
  } else {
    console.log("Layer update complete");
  }
});
```

### Widget Events
```javascript
// Search widget
searchWidget.on("select-result", (event) => {
  console.log("Selected:", event.result);
});

// Sketch widget
sketchWidget.on("create", (event) => {
  if (event.state === "complete") {
    console.log("Sketch complete");
  }
});
```

## Coordinate Conversion

```javascript
// Screen to map coordinates
const mapPoint = view.toMap({ x: screenX, y: screenY });

// Map to screen coordinates
const screenPoint = view.toScreen(mapPoint);
```

## TypeScript Usage

Popup and symbol configurations use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for popup content types
layer.popupTemplate = {
  title: "{name}",
  content: [{
    type: "fields",
    fieldInfos: [
      { fieldName: "name", label: "Name" }
    ]
  }]
} as const;

// Use 'as const' for symbol configurations
const graphic = new Graphic({
  geometry: point,
  symbol: {
    type: "simple-marker",
    color: "red",
    size: 12
  } as const
});
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `view-hittest` - Hit testing to identify features at screen coordinates
- `highlight-point-features` - Highlighting features on the map
- `sketch` - Sketching geometries on the map
- `view-events` - Handling view click, pointer, and key events

## Common Pitfalls

1. **Popup not showing**: Ensure layer has `popupEnabled: true` (default)

2. **Hit test returns nothing**: Check if layers are included/excluded correctly

3. **Highlight handle leak**: Creating new highlights without removing previous ones causes memory leaks.

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
     // Remove previous highlight
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

   **Impact:** Each pointer-move adds another highlight without removing the previous one. Highlights accumulate visually and in memory, causing performance degradation and eventually freezing the browser.

4. **applyEdits fails**: Ensure layer is editable and user has edit permissions

5. **Events fire multiple times**: Adding event listeners repeatedly without cleanup causes handler accumulation.

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
   setupInteraction(); // Third handler - now click fires three times
   ```

   ```javascript
   // Correct: store handle and remove before re-adding, or add once
   let clickHandle = null;

   function setupInteraction() {
     // Remove previous handler if it exists
     if (clickHandle) {
       clickHandle.remove();
     }
     clickHandle = view.on("click", async (event) => {
       const result = await view.hitTest(event);
       console.log("Clicked:", result);
     });
   }
   ```

   **Impact:** Each call to the setup function adds another listener. Clicks fire multiple duplicate callbacks, causing repeated API calls, flickering UI updates, and steadily growing memory usage.

