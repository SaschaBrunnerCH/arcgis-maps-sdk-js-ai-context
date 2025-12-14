---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Core Utilities & Interaction

## reactiveUtils (Property Watching)

```javascript
import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// Watch property
const handle = reactiveUtils.watch(
  () => view.scale,
  (scale) => console.log("Scale:", scale)
);

// Watch with initial value
reactiveUtils.watch(
  () => view.extent,
  (extent) => console.log("Extent:", extent),
  { initial: true }
);

// Wait for condition
await reactiveUtils.when(() => view.ready);

// One-time watch
await reactiveUtils.once(() => layer.loaded);

// Watch multiple
reactiveUtils.watch(
  () => [view.center, view.zoom],
  ([center, zoom]) => console.log(center, zoom)
);

// Stop watching
handle.remove();
```

## Handles (Cleanup)

```javascript
import Handles from "@arcgis/core/core/Handles.js";

const handles = new Handles();

handles.add(reactiveUtils.watch(() => view.scale, () => {}));
handles.add(view.on("click", () => {}), "click-group");

// Remove group
handles.remove("click-group");

// Remove all
handles.removeAll();
handles.destroy();
```

## promiseUtils

```javascript
import promiseUtils from "@arcgis/core/core/promiseUtils.js";

// Debounce
const debouncedSearch = promiseUtils.debounce(async (query) => {
  return await searchService.search(query);
});

// Throttle
const throttledUpdate = promiseUtils.throttle(async (extent) => {
  await updateDisplay(extent);
}, 100);

// Check abort error
try {
  await debouncedSearch(query);
} catch (e) {
  if (!promiseUtils.isAbortError(e)) throw e;
}

// Wait for all (regardless of success)
const results = await promiseUtils.eachAlways([promise1, promise2]);
results.forEach(r => console.log(r.error || r.value));
```

## Collection

```javascript
import Collection from "@arcgis/core/core/Collection.js";

const collection = new Collection([item1, item2]);

// Mutate
collection.add(item);
collection.addMany([item3, item4]);
collection.remove(item);
collection.removeAt(0);
collection.removeAll();
collection.reorder(item, 0);

// Query
const found = collection.find(item => item.id === 3);
const filtered = collection.filter(item => item.active);
const mapped = collection.map(item => item.name);

// Events
collection.on("change", (e) => {
  console.log("Added:", e.added, "Removed:", e.removed);
});
```

## Hit Testing

```javascript
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked:", graphic.attributes);
  }
});

// Filter by layer
const response = await view.hitTest(event, {
  include: [featureLayer],
  exclude: [graphicsLayer]
});
```

## Highlighting

```javascript
const layerView = await view.whenLayerView(featureLayer);

// Highlight
const highlight = layerView.highlight(graphic);
const highlight = layerView.highlight([graphic1, graphic2]);
const highlight = layerView.highlight([objectId1, objectId2]);

// Remove highlight
highlight.remove();

// Options
layerView.highlightOptions = {
  color: [255, 255, 0, 1],
  haloOpacity: 0.9,
  fillOpacity: 0.2
};
```

## View Events

```javascript
// Click
view.on("click", (event) => {
  console.log("Map point:", event.mapPoint);
  console.log("Screen:", event.x, event.y);
});

// Double-click
view.on("double-click", (event) => {
  event.stopPropagation(); // Prevent zoom
});

// Pointer move
view.on("pointer-move", (event) => {
  const point = view.toMap(event);
});

// Key events
view.on("key-down", (event) => {
  if (event.key === "Escape") { }
});

// Stationary (navigation complete)
view.watch("stationary", (isStationary) => {
  if (isStationary) console.log("Navigation done");
});
```

## Coordinate Conversion

```javascript
// Screen to map
const mapPoint = view.toMap({ x: screenX, y: screenY });

// Map to screen
const screenPoint = view.toScreen(mapPoint);
```

## Units

```javascript
import units from "@arcgis/core/core/units.js";

const meters = units.convertUnit(100, "feet", "meters");
const sqKm = units.convertUnit(1000, "acres", "square-kilometers");
```

## Scheduling

```javascript
import scheduling from "@arcgis/core/core/scheduling.js";

const handle = scheduling.addFrameTask({
  update: (event) => {
    console.log("Delta:", event.deltaTime);
  }
});

handle.remove();
```

## Workers (Background Processing)

```javascript
import workers from "@arcgis/core/core/workers.js";

const connection = await workers.open("path/to/worker.js");
const result = await connection.invoke("methodName", { data: "params" });
connection.close();
```

## Accessor (Custom Classes)

```javascript
import Accessor from "@arcgis/core/core/Accessor.js";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators.js";

@subclass("myapp.CustomClass")
class CustomClass extends Accessor {
  @property()
  name = "default";

  @property({ readOnly: true, dependsOn: ["name"] })
  get displayName() {
    return this.name.toUpperCase();
  }
}
```

## Common Pitfalls

1. **Memory leaks** - Always remove handles when done
2. **Initial value** - Use `{ initial: true }` for immediate callback
3. **Abort errors** - Check with `promiseUtils.isAbortError()`
4. **Sync vs async** - Default is async batching, `{ sync: true }` for immediate
