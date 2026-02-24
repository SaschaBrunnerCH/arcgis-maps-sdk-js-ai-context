---
name: arcgis-core-utilities
description: Core utilities including Accessor pattern, Collection, reactiveUtils, promiseUtils, intl (internationalization), and workers. Use for reactive programming, property watching, locale formatting, async operations, and background processing.
---

# ArcGIS Core Utilities

Use this skill for core infrastructure patterns like Accessor, Collection, reactive utilities, and workers.

## Import Patterns

### Direct ESM Imports
```javascript
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import Collection from "@arcgis/core/core/Collection.js";
import Handles from "@arcgis/core/core/Handles.js";
```

### Dynamic Imports (CDN)
```javascript
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");
const promiseUtils = await $arcgis.import("@arcgis/core/core/promiseUtils.js");
```

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
const first = collection.at(0);
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

// Stack operations
collection.push(item);      // Add to end
collection.pop();           // Remove from end
collection.unshift(item);   // Add to beginning
collection.shift();         // Remove from beginning
collection.splice(1, 2);    // Remove 2 items at index 1

// Iterate
collection.forEach(item => console.log(item.name));
for (const item of collection) {
  console.log(item);
}

// Filter by type
const featureLayers = map.layers.ofType(FeatureLayer);
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
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

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

Wait for a property to become truthy once, returns a promise.

```javascript
// Wait for view to be ready
await reactiveUtils.whenOnce(
  () => view.ready
);
console.log("View is ready");
```

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

// Check if group exists
handles.has("view-watchers"); // true

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

### Using addHandles on Accessor

All Accessor-based classes have built-in handle management:

```javascript
// Add handles directly to an Accessor instance
view.addHandles(
  reactiveUtils.watch(() => view.scale, (scale) => {}),
  "my-group"
);

// Check if handles exist
view.hasHandles("my-group"); // true

// Remove handles by group
view.removeHandles("my-group");
```

## promiseUtils

Utilities for working with Promises.

```javascript
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
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

### ignoreAbortErrors()

Suppress abort errors from a promise.

```javascript
// Instead of try/catch with isAbortError check
await promiseUtils.ignoreAbortErrors(debouncedFunction());
```

### createAbortError()

Create an abort error for use with AbortSignal.

```javascript
const error = promiseUtils.createAbortError();
// Useful in custom async operations that support cancellation
```

### filter()

Async filter of arrays.

```javascript
const validItems = await promiseUtils.filter(items, async (item) => {
  const result = await validateItem(item);
  return result.isValid;
});
```

## Workers

Run heavy computations in background threads.

```javascript
import * as workers from "@arcgis/core/core/workers.js";
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
import * as workers from "@arcgis/core/core/workers.js";

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
import * as urlUtils from "@arcgis/core/core/urlUtils.js";

// Add proxy rule
urlUtils.addProxyRule({
  urlPrefix: "https://services.arcgis.com",
  proxyUrl: "/proxy"
});
```

## Scheduling

```javascript
import * as scheduling from "@arcgis/core/core/scheduling.js";

// Schedule for next frame
const handle = scheduling.addFrameTask({
  update: (event) => {
    // Called every frame
    console.log("Delta time:", event.deltaTime);
    console.log("Elapsed:", event.elapsedTime);
  }
});

// Pause/resume frame task
handle.pause();
handle.resume();

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

## Internationalization (intl)

The `intl` module provides locale-aware formatting for numbers, dates, and coordinates.

### Number Formatting

```javascript
import * as intl from "@arcgis/core/intl.js";

// Format numbers with locale settings
const formatted = intl.formatNumber(1234567.89);
// "1,234,567.89" (en-US) or "1.234.567,89" (de-DE)

// Format with options
const currency = intl.formatNumber(1234.5, {
  style: "currency",
  currency: "USD"
});
// "$1,234.50"

const percent = intl.formatNumber(0.75, {
  style: "percent"
});
// "75%"
```

### Date Formatting

```javascript
import * as intl from "@arcgis/core/intl.js";

const date = new Date();

// Format dates
const formatted = intl.formatDate(date);

// Format with options
const longDate = intl.formatDate(date, {
  dateStyle: "full",
  timeStyle: "short"
});

// Format date only (from ISO string)
const dateOnly = intl.formatDateOnly("2024-03-15");

// Format time only (from ISO string)
const timeOnly = intl.formatTimeOnly("14:30:00");

// Format timestamp (from ISO string)
const timestamp = intl.formatTimestamp("2024-03-15T14:30:00Z");
```

### Setting Locale

```javascript
import * as intl from "@arcgis/core/intl.js";

// Get current locale
const locale = intl.getLocale();

// Get language code
const lang = intl.getLocaleLanguage();

// Normalize locale string
const normalized = intl.normalizeMessageBundleLocale("en-us"); // "en-US"
```

### Message Bundles (i18n)

```javascript
import * as intl from "@arcgis/core/intl.js";

// Create a JSON message bundle loader
const loader = intl.createJSONLoader({
  pattern: "my-app/",
  base: "./nls"
});

// Fetch a message bundle
const messages = await intl.fetchMessageBundle("my-app/messages");
console.log(messages.greeting); // Localized string
```

### Format Conversion Utilities

```javascript
import * as intl from "@arcgis/core/intl.js";

// Convert SDK date format to Intl options
const intlOptions = intl.convertDateFormatToIntlOptions("short-date-short-time");

// Convert field format to Intl options
const numberOptions = intl.convertNumberFieldFormatToIntlOptions(fieldFormat);
const dateOptions = intl.convertDateTimeFieldFormatToIntlOptions(dateFieldFormat);
```

### Coordinate Formatting

```javascript
import * as coordinateFormatter from "@arcgis/core/geometry/coordinateFormatter.js";

// Load the coordinate formatter module
await coordinateFormatter.load();

// Format point as DMS (degrees, minutes, seconds)
const dms = coordinateFormatter.toLatitudeLongitude(point, "dms", 2);
// "34°01'12.00\"N 118°48'18.00\"W"

// Format as UTM
const utm = coordinateFormatter.toUtm(point, "north-south-indicators", true);
// "11S 357811 3764417"

// Parse coordinate string to Point
const parsed = coordinateFormatter.fromLatitudeLongitude("34.02N 118.805W");
```

## Reference Samples

- `watch-for-changes` - Watching property changes on map objects
- `watch-for-changes-reactiveutils` - Modern reactive property watching
- `chaining-promises` - Promise chaining patterns with the API
- `event-explorer` - Exploring view and layer events

## Related Skills

- See `arcgis-core-maps` for map and view setup that uses reactiveUtils.
- See `arcgis-layers` for layer management using Collection.
- See `arcgis-interaction` for event handling patterns.

## Common Pitfalls

1. **Memory Leaks**: Always remove handles when done.

   ```javascript
   // Anti-pattern: never removing the handle
   reactiveUtils.watch(
     () => view.scale,
     (scale) => updateUI(scale)
   );
   // Handle is lost, watcher runs forever
   ```

   ```javascript
   // Correct: store and remove the handle
   const handle = reactiveUtils.watch(
     () => view.scale,
     (scale) => updateUI(scale)
   );
   // Remove when no longer needed
   handle.remove();
   ```

   **Impact:** Watchers accumulate over time, causing performance degradation and potential errors if they reference destroyed objects.

2. **Initial Value**: Use `initial: true` to get current value immediately.

   ```javascript
   // Anti-pattern: missing initial value
   reactiveUtils.watch(
     () => view.scale,
     (scale) => updateUI(scale)
   );
   // updateUI is NOT called until scale changes
   ```

   ```javascript
   // Correct: use initial option
   reactiveUtils.watch(
     () => view.scale,
     (scale) => updateUI(scale),
     { initial: true }  // Called immediately with current scale
   );
   ```

   **Impact:** UI is not initialized with the current value, remaining empty or stale until the first property change.

3. **Sync vs Async**: Default is async batching, use `sync: true` carefully.

   ```javascript
   // Async (default) - batched, better performance
   reactiveUtils.watch(() => value, callback);

   // Sync - immediate, can cause performance issues
   reactiveUtils.watch(() => value, callback, { sync: true });
   ```

   **Impact:** Sync watchers fire on every single change, which can cause layout thrashing and poor performance if the watched property updates frequently.

4. **Abort Errors**: Always check for abort errors in catch blocks.

   ```javascript
   // Anti-pattern: treating abort errors as real errors
   try {
     await debouncedFunction();
   } catch (e) {
     console.error("Error!", e); // Logs abort errors as errors
   }
   ```

   ```javascript
   // Correct: filter out abort errors
   try {
     await debouncedFunction();
   } catch (e) {
     if (!promiseUtils.isAbortError(e)) {
       console.error("Error!", e);
     }
   }
   ```

   **Impact:** Abort errors (from debounced operations, cancelled queries, or navigation changes) are logged as real errors, flooding the console and potentially triggering error-reporting systems.
