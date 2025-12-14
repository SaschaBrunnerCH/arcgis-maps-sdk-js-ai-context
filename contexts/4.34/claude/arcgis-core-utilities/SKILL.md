---
name: arcgis-core-utilities
description: Core utilities including Accessor pattern, Collection, reactiveUtils, promiseUtils, and workers. Use for reactive programming, property watching, async operations, and background processing.
---

# ArcGIS Core Utilities

Use this skill for core infrastructure patterns like Accessor, Collection, reactive utilities, and workers.

## Accessor Pattern

The Accessor class is the foundation for all ArcGIS classes, providing property watching and computed properties.

### Creating Custom Accessor Classes

```javascript
import Accessor from "@arcgis/core/core/Accessor.js";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators.js";

@subclass("myapp.CustomClass")
class CustomClass extends Accessor {
  @property()
  name = "default";

  @property()
  value = 0;

  // Computed property
  @property({
    readOnly: true,
    dependsOn: ["name", "value"]
  })
  get summary() {
    return `${this.name}: ${this.value}`;
  }
}

const instance = new CustomClass({ name: "Test", value: 42 });
console.log(instance.summary); // "Test: 42"
```

### Property Decorators

```javascript
@subclass("myapp.MyClass")
class MyClass extends Accessor {
  // Basic property
  @property()
  title = "";

  // Property with type casting
  @property({ type: Number })
  count = 0;

  // Read-only computed property
  @property({ readOnly: true })
  get displayName() {
    return this.title.toUpperCase();
  }

  // Property with custom setter
  @property()
  get status() {
    return this._status;
  }
  set status(value) {
    this._status = value?.toLowerCase() || "unknown";
  }

  // Property that depends on others
  @property({
    readOnly: true,
    dependsOn: ["count", "title"]
  })
  get info() {
    return `${this.title} (${this.count})`;
  }
}
```

### Property Types

```javascript
@property({ type: String })
name = "";

@property({ type: Number })
count = 0;

@property({ type: Boolean })
enabled = true;

@property({ type: Date })
createdAt = new Date();

@property({ type: [Number] })  // Array of numbers
values = [];

@property({ type: SomeClass })  // Custom class
child = null;
```

## Collection

Collection is an array-like class with change notifications.

### Basic Usage

```javascript
import Collection from "@arcgis/core/core/Collection.js";

const collection = new Collection([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
]);

// Add items
collection.add({ id: 3, name: "Item 3" });
collection.addMany([
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" }
]);

// Remove items
collection.remove(item);
collection.removeAt(0);
collection.removeMany([item1, item2]);
collection.removeAll();

// Access items
const first = collection.getItemAt(0);
const all = collection.toArray();
const length = collection.length;
```

### Collection Methods

```javascript
// Find items
const found = collection.find(item => item.id === 3);
const index = collection.findIndex(item => item.name === "Item 2");
const filtered = collection.filter(item => item.value > 10);

// Transform
const mapped = collection.map(item => item.name);
const reduced = collection.reduce((acc, item) => acc + item.value, 0);

// Check
const hasItem = collection.includes(item);
const exists = collection.some(item => item.active);
const allActive = collection.every(item => item.active);

// Sort and reorder
collection.sort((a, b) => a.name.localeCompare(b.name));
collection.reverse();
collection.reorder(item, 0); // Move item to index 0

// Iterate
collection.forEach(item => console.log(item.name));
for (const item of collection) {
  console.log(item);
}
```

### Collection Events

```javascript
// Watch for changes
collection.on("change", (event) => {
  console.log("Added:", event.added);
  console.log("Removed:", event.removed);
  console.log("Moved:", event.moved);
});

// Watch length
collection.watch("length", (newLength, oldLength) => {
  console.log(`Length changed from ${oldLength} to ${newLength}`);
});
```

### Typed Collections

```javascript
// Collection of specific type
import Graphic from "@arcgis/core/Graphic.js";

const graphics = new Collection();
graphics.addMany([
  new Graphic({ geometry: point1 }),
  new Graphic({ geometry: point2 })
]);

// Map's layers is a Collection
map.layers.add(featureLayer);
map.layers.reorder(featureLayer, 0);
```

## reactiveUtils

Modern reactive utilities for watching properties and state changes.

### watch()

Watch a property for changes.

```javascript
import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// Watch single property
const handle = reactiveUtils.watch(
  () => view.scale,
  (scale) => {
    console.log("Scale changed to:", scale);
  }
);

// With options
reactiveUtils.watch(
  () => view.extent,
  (extent) => console.log("Extent:", extent),
  { initial: true }  // Call immediately with current value
);

// Stop watching
handle.remove();
```

### when()

Wait for a condition to become true.

```javascript
// Wait for view to be ready
await reactiveUtils.when(
  () => view.ready,
  () => console.log("View is ready!")
);

// Wait for layer to load
await reactiveUtils.when(
  () => layer.loaded
);
console.log("Layer loaded");

// With timeout (throws if not met)
await reactiveUtils.when(
  () => view.stationary,
  { timeout: 5000 }
);
```

### once()

Watch for a value change only once.

```javascript
// Execute once when condition is met
await reactiveUtils.once(
  () => view.ready
);
console.log("View became ready");

// Once with callback
reactiveUtils.once(
  () => layer.visible,
  (visible) => console.log("Layer visibility changed to:", visible)
);
```

### whenOnce()

Deprecated - use when() or once() instead.

### on()

Listen to events reactively.

```javascript
// Listen to click events
const handle = reactiveUtils.on(
  () => view,
  "click",
  (event) => {
    console.log("Clicked at:", event.mapPoint);
  }
);

// Listen to layer view events
reactiveUtils.on(
  () => view.whenLayerView(layer),
  "highlight",
  (event) => console.log("Highlight changed")
);
```

### Multiple Properties

```javascript
// Watch multiple properties
reactiveUtils.watch(
  () => [view.center, view.zoom],
  ([center, zoom]) => {
    console.log(`Center: ${center.x}, ${center.y}, Zoom: ${zoom}`);
  }
);

// Computed expression
reactiveUtils.watch(
  () => view.scale < 50000,
  (isZoomedIn) => {
    layer.visible = isZoomedIn;
  }
);
```

### Sync Option

```javascript
// Synchronous updates (use carefully)
reactiveUtils.watch(
  () => view.extent,
  (extent) => updateUI(extent),
  { sync: true }
);
```

## Handles

Manage multiple watch handles for cleanup.

```javascript
import Handles from "@arcgis/core/core/Handles.js";

const handles = new Handles();

// Add handles
handles.add(
  reactiveUtils.watch(() => view.scale, (scale) => {})
);

handles.add(
  view.on("click", (e) => {}),
  "click-handlers"  // Group name
);

handles.add([
  reactiveUtils.watch(() => view.center, () => {}),
  reactiveUtils.watch(() => view.zoom, () => {})
], "view-watchers");

// Remove specific group
handles.remove("click-handlers");

// Remove all
handles.removeAll();

// Destroy (also removes all)
handles.destroy();
```

### In Custom Classes

```javascript
@subclass("myapp.MyWidget")
class MyWidget extends Accessor {
  constructor(props) {
    super(props);
    this.handles = new Handles();
  }

  initialize() {
    this.handles.add(
      reactiveUtils.watch(
        () => this.view?.scale,
        (scale) => this.onScaleChange(scale)
      )
    );
  }

  destroy() {
    this.handles.destroy();
    super.destroy();
  }
}
```

## promiseUtils

Utilities for working with Promises.

```javascript
import promiseUtils from "@arcgis/core/core/promiseUtils.js";
```

### create()

Create an abortable promise.

```javascript
const { promise, resolve, reject } = promiseUtils.create();

// Later...
resolve(result);
// or
reject(new Error("Failed"));

// Wait for it
const result = await promise;
```

### eachAlways()

Wait for all promises, regardless of success/failure.

```javascript
const results = await promiseUtils.eachAlways([
  fetch("/api/data1"),
  fetch("/api/data2"),
  fetch("/api/data3")
]);

results.forEach((result, index) => {
  if (result.error) {
    console.error(`Request ${index} failed:`, result.error);
  } else {
    console.log(`Request ${index} succeeded:`, result.value);
  }
});
```

### debounce()

Debounce a function.

```javascript
const debouncedSearch = promiseUtils.debounce(async (query) => {
  const results = await searchService.search(query);
  return results;
});

// Rapid calls will be debounced
input.addEventListener("input", async (e) => {
  try {
    const results = await debouncedSearch(e.target.value);
    displayResults(results);
  } catch (e) {
    if (!promiseUtils.isAbortError(e)) {
      console.error(e);
    }
  }
});
```

### throttle()

Throttle a function.

```javascript
const throttledUpdate = promiseUtils.throttle(async (extent) => {
  await updateDisplay(extent);
}, 100); // Max once per 100ms

view.watch("extent", throttledUpdate);
```

### isAbortError()

Check if error is from aborted operation.

```javascript
try {
  await someAsyncOperation();
} catch (error) {
  if (promiseUtils.isAbortError(error)) {
    console.log("Operation was cancelled");
  } else {
    throw error;
  }
}
```

### timeout()

Add timeout to a promise.

```javascript
try {
  const result = await promiseUtils.timeout(
    fetch("/api/slow-endpoint"),
    5000  // 5 second timeout
  );
} catch (e) {
  console.error("Request timed out or failed");
}
```

## Workers

Run heavy computations in background threads.

```javascript
import workers from "@arcgis/core/core/workers.js";
```

### Open Worker Connection

```javascript
const connection = await workers.open("path/to/worker.js");

// Execute method on worker
const result = await connection.invoke("methodName", { data: "params" });

// Close when done
connection.close();
```

### Worker Script Example

```javascript
// worker.js
define([], function() {
  return {
    methodName: function(params) {
      // Heavy computation here
      const result = processData(params.data);
      return result;
    },

    anotherMethod: function(params) {
      return params.value * 2;
    }
  };
});
```

### Using Workers for Heavy Tasks

```javascript
// Main script
import workers from "@arcgis/core/core/workers.js";

async function processLargeDataset(data) {
  const connection = await workers.open("./dataProcessor.js");

  try {
    const result = await connection.invoke("process", {
      data: data,
      options: { threshold: 100 }
    });
    return result;
  } finally {
    connection.close();
  }
}
```

## Error Handling

```javascript
import Error from "@arcgis/core/core/Error.js";

// Create custom error
const error = new Error("layer-load-error", "Failed to load layer", {
  layer: layer,
  originalError: e
});

// Check error type
if (error.name === "layer-load-error") {
  console.log("Layer failed:", error.details.layer.title);
}
```

## URL Utilities

```javascript
import urlUtils from "@arcgis/core/core/urlUtils.js";

// Add proxy rule
urlUtils.addProxyRule({
  urlPrefix: "https://services.arcgis.com",
  proxyUrl: "/proxy"
});

// Get proxy URL
const proxiedUrl = urlUtils.getProxyUrl("https://services.arcgis.com/data");

// URL helpers
const normalized = urlUtils.normalize("https://example.com//path//to//resource");
```

## Units and Quantities

```javascript
import units from "@arcgis/core/core/units.js";

// Convert units
const meters = units.convertUnit(100, "feet", "meters");
const sqKm = units.convertUnit(1000, "acres", "square-kilometers");

// Get unit info
const info = units.getUnitInfo("meters");
console.log(info.abbreviation); // "m"
console.log(info.pluralLabel); // "meters"
```

## Scheduling

```javascript
import scheduling from "@arcgis/core/core/scheduling.js";

// Schedule for next frame
const handle = scheduling.addFrameTask({
  update: (event) => {
    // Called every frame
    console.log("Delta time:", event.deltaTime);
    console.log("Elapsed:", event.elapsedTime);
  }
});

// Remove task
handle.remove();

// One-time frame callback
scheduling.schedule(() => {
  console.log("Executed on next frame");
});
```

## Common Patterns

### Cleanup Pattern

```javascript
class MyComponent {
  constructor(view) {
    this.view = view;
    this.handles = new Handles();
    this.setup();
  }

  setup() {
    this.handles.add([
      reactiveUtils.watch(
        () => this.view.scale,
        (scale) => this.onScaleChange(scale)
      ),
      reactiveUtils.watch(
        () => this.view.extent,
        (extent) => this.onExtentChange(extent)
      ),
      this.view.on("click", (e) => this.onClick(e))
    ]);
  }

  destroy() {
    this.handles.removeAll();
  }
}
```

### Debounced Updates

```javascript
const debouncedUpdate = promiseUtils.debounce(async () => {
  const extent = view.extent;
  const results = await layer.queryFeatures({
    geometry: extent,
    returnGeometry: true
  });
  updateDisplay(results);
});

reactiveUtils.watch(
  () => view.stationary && view.extent,
  debouncedUpdate
);
```

### Conditional Watching

```javascript
// Only react when view is stationary
reactiveUtils.watch(
  () => view.stationary ? view.extent : null,
  (extent) => {
    if (extent) {
      updateForExtent(extent);
    }
  }
);
```

## Common Pitfalls

1. **Memory Leaks**: Always remove handles when done
   ```javascript
   // Store handle reference
   const handle = reactiveUtils.watch(...);
   // Remove when no longer needed
   handle.remove();
   ```

2. **Initial Value**: Use `initial: true` to get current value immediately
   ```javascript
   reactiveUtils.watch(
     () => view.scale,
     (scale) => updateUI(scale),
     { initial: true }  // Called immediately with current scale
   );
   ```

3. **Sync vs Async**: Default is async batching, use `sync: true` carefully
   ```javascript
   // Async (default) - batched, better performance
   reactiveUtils.watch(() => value, callback);

   // Sync - immediate, can cause performance issues
   reactiveUtils.watch(() => value, callback, { sync: true });
   ```

4. **Abort Errors**: Always check for abort errors in catch blocks
   ```javascript
   try {
     await debouncedFunction();
   } catch (e) {
     if (!promiseUtils.isAbortError(e)) {
       throw e;
     }
   }
   ```

