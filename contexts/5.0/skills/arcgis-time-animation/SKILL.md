---
name: arcgis-time-animation
description: Work with temporal data using TimeSlider, TimeExtent, TimeInterval, and time-aware layers. Use for animating data over time, filtering by date ranges, and visualizing temporal patterns.
---

# ArcGIS Time Animation

Use this skill for temporal data, time-aware layers, time filtering, and animation controls.

## Import Patterns

### ESM (npm)
```javascript
import TimeExtent from "@arcgis/core/TimeExtent.js";
import TimeInterval from "@arcgis/core/TimeInterval.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
```

### CDN (dynamic import)
```javascript
const TimeExtent = await $arcgis.import("@arcgis/core/TimeExtent.js");
const TimeInterval = await $arcgis.import("@arcgis/core/TimeInterval.js");
const TimeSlider = await $arcgis.import("@arcgis/core/widgets/TimeSlider.js");
```

## TimeExtent

Represents a time range with start and end dates.

```javascript
const timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31")
});

// Apply to view (filters all time-aware layers)
view.timeExtent = timeExtent;

// Instant in time (start === end)
const instant = new TimeExtent({
  start: new Date("2024-06-15"),
  end: new Date("2024-06-15")
});

// No time filter (show all data)
view.timeExtent = null;
```

## TimeInterval

Represents a duration of time.

```javascript
const interval = new TimeInterval({
  value: 1,
  unit: "months"
});
```

**Supported units:** `milliseconds`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`, `decades`, `centuries`

## TimeSlider Component

### arcgis-time-slider (Map Component)

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-time-slider
    slot="bottom-left"
    mode="time-window"
    loop
    time-visible>
  </arcgis-time-slider>
</arcgis-map>

<script type="module">
  const map = document.querySelector("arcgis-map");
  const timeSlider = document.querySelector("arcgis-time-slider");

  await map.viewOnReady();

  // Configure from layer
  const layer = map.view.map.layers.find(l => l.timeInfo);
  if (layer) {
    await layer.load();
    timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent;
    timeSlider.stops = { interval: layer.timeInfo.interval };
  }
</script>
```

### TimeSlider Widget (Core API)

```javascript
const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view,
  fullTimeExtent: {
    start: new Date("2020-01-01"),
    end: new Date("2024-12-31")
  },
  timeExtent: {
    start: new Date("2024-01-01"),
    end: new Date("2024-03-31")
  },
  mode: "time-window",
  playRate: 1000,
  loop: true,
  stops: {
    interval: {
      value: 1,
      unit: "months"
    }
  }
});
```

### TimeSlider Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fullTimeExtent` | TimeExtent | — | Complete time range the widget can display |
| `timeExtent` | TimeExtent | — | Currently selected time range |
| `mode` | string | `"instant"` | Animation mode |
| `stops` | object | — | Snap points for slider |
| `playRate` | number | 1000 | Milliseconds between steps |
| `loop` | boolean | false | Restart at end |
| `layout` | string | `"auto"` | `"auto"`, `"compact"`, `"wide"` |
| `disabled` | boolean | false | Disable interaction |

### TimeSlider Modes

```javascript
// Instant - single point in time
mode: "instant"

// Time Window - range with start and end
mode: "time-window"

// Cumulative from Start - everything from start to current
mode: "cumulative-from-start"

// Cumulative from End - everything from current to end
mode: "cumulative-from-end"
```

### Custom Stops

```javascript
// Interval-based stops
stops: {
  interval: { value: 1, unit: "weeks" }
}

// Specific dates
stops: {
  dates: [
    new Date("2024-01-01"),
    new Date("2024-04-01"),
    new Date("2024-07-01"),
    new Date("2024-10-01")
  ]
}

// Number of evenly distributed stops
stops: {
  count: 12
}
```

### Playback Control

```javascript
timeSlider.play();
timeSlider.stop();
```

### Watch Time Changes

```javascript
timeSlider.watch("timeExtent", (timeExtent) => {
  console.log("New time range:", timeExtent.start, "to", timeExtent.end);
});

timeSlider.watch("viewModel.state", (state) => {
  console.log("State:", state); // "ready", "playing", "disabled"
});
```

### Custom Labels

```javascript
const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view,
  fullTimeExtent: { start, end },

  tickConfigs: [{
    mode: "position",
    values: [
      new Date("2021-01-01"),
      new Date("2022-01-01"),
      new Date("2023-01-01")
    ],
    labelsVisible: true,
    labelFormatFunction: (value) => value.getFullYear().toString()
  }],

  labelFormatFunction: (value, type, element, layout) => {
    const date = new Date(value);
    if (type === "min" || type === "max") {
      return date.toLocaleDateString();
    }
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
});
```

## Time-Aware Layers

### FeatureLayer with Time

```javascript
const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  timeInfo: {
    startField: "event_date",
    endField: "end_date",
    interval: {
      value: 1,
      unit: "days"
    }
  }
});

// Check if layer supports time
await featureLayer.load();
if (featureLayer.timeInfo) {
  console.log("Time field:", featureLayer.timeInfo.startField);
  console.log("Full extent:", featureLayer.timeInfo.fullTimeExtent);
}
```

### TimeInfo Properties

| Property | Type | Description |
|----------|------|-------------|
| `startField` | string | Start date field name (required) |
| `endField` | string | End date field name (optional) |
| `fullTimeExtent` | TimeExtent | Complete time range of data |
| `interval` | TimeInterval | Suggested animation interval |
| `trackIdField` | string | Track identifier field (for StreamLayer) |

### Other Time-Aware Layers

```javascript
// ImageryLayer
const imageryLayer = new ImageryLayer({
  url: "...",
  timeInfo: { startField: "acquisition_date" }
});

// MapImageLayer
const mapImageLayer = new MapImageLayer({
  url: "...",
  timeInfo: { startField: "date_field" }
});

// StreamLayer
const streamLayer = new StreamLayer({
  url: "wss://services.arcgis.com/.../StreamServer",
  timeInfo: {
    trackIdField: "vehicle_id",
    startField: "timestamp"
  },
  purgeOptions: {
    displayCount: 1000,
    age: 5
  }
});
```

## Initializing TimeSlider from Layer

```javascript
async function setupTimeSlider(view, layer) {
  await layer.load();

  if (!layer.timeInfo) {
    console.warn("Layer is not time-aware");
    return null;
  }

  const timeSlider = new TimeSlider({
    container: "timeSliderDiv",
    view: view,
    fullTimeExtent: layer.timeInfo.fullTimeExtent,
    mode: "time-window",
    playRate: 1000,
    loop: true,
    stops: {
      interval: layer.timeInfo.interval || { value: 1, unit: "months" }
    }
  });

  timeSlider.watch("timeExtent", (extent) => {
    document.getElementById("currentTime").textContent =
      `${extent.start.toLocaleDateString()} - ${extent.end.toLocaleDateString()}`;
  });

  return timeSlider;
}
```

## Filtering by Time

### Client-Side Filter

```javascript
// Filter all time-aware layers via view
view.timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-06-30")
});

// Filter specific layer via layerView
const layerView = await view.whenLayerView(featureLayer);
layerView.filter = {
  timeExtent: new TimeExtent({
    start: new Date("2024-03-01"),
    end: new Date("2024-03-31")
  })
};
```

### Query with Time

```javascript
const query = featureLayer.createQuery();
query.timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31")
});
query.where = "status = 'active'";
query.returnGeometry = true;

const results = await featureLayer.queryFeatures(query);
```

## Animation Patterns

### TimeSlider with Statistics

```javascript
timeSlider.watch("timeExtent", async (timeExtent) => {
  const query = featureLayer.createQuery();
  query.timeExtent = timeExtent;
  query.outStatistics = [{
    statisticType: "count",
    onStatisticField: "OBJECTID",
    outStatisticFieldName: "count"
  }, {
    statisticType: "sum",
    onStatisticField: "value",
    outStatisticFieldName: "total"
  }];

  const result = await featureLayer.queryFeatures(query);
  const stats = result.features[0].attributes;
  document.getElementById("count").textContent = stats.count;
  document.getElementById("total").textContent = stats.total;
});
```

### Time-Based Highlighting

```javascript
let highlightHandle;

timeSlider.watch("timeExtent", async (timeExtent) => {
  if (highlightHandle) highlightHandle.remove();

  const query = featureLayer.createQuery();
  query.timeExtent = timeExtent;

  const layerView = await view.whenLayerView(featureLayer);
  const results = await featureLayer.queryFeatures(query);
  highlightHandle = layerView.highlight(results.features);
});
```

### Manual Animation Loop

```javascript
async function animateOverTime(layer, startDate, endDate, intervalDays) {
  const current = new Date(startDate);

  while (current <= endDate) {
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + intervalDays);

    view.timeExtent = new TimeExtent({
      start: current,
      end: nextDate
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    current.setDate(current.getDate() + intervalDays);
  }
}
```

## TimeZoneLabel Component

```html
<arcgis-map>
  <arcgis-time-zone-label slot="bottom-left"></arcgis-time-zone-label>
</arcgis-map>
```

## Graphics Visibility with Time

```javascript
// Set time visibility on individual graphics
graphic.visibilityTimeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-06-30")
});
```

## Common Pitfalls

1. **Time zone issues**: Dates are affected by JavaScript's local timezone — use UTC dates for consistency.
   ```javascript
   const date = new Date("2024-06-15T00:00:00Z");
   ```

2. **Layer must be loaded**: `timeInfo` is only available after `await layer.load()`.

3. **TimeExtent not applied**: The view's `timeExtent` must be set to filter all time-aware layers.

4. **Null removes filter**: Use `view.timeExtent = null` to show all data (no time filter).

5. **Performance**: Large time ranges can return many features — use server-side queries when possible.

6. **Stops required**: TimeSlider needs `stops` configured to define slider positions.

## Reference Samples

- `timeslider` — Basic TimeSlider widget
- `timeslider-filter` — Filtering data with TimeSlider
- `timeslider-component-filter` — TimeSlider component with filtering
- `time-layer` — Working with time-aware layers
- `widgets-timeslider` — TimeSlider widget examples
- `widgets-timeslider-offset` — TimeSlider with timezone offset
- `layers-scenelayer-time` — Time-aware SceneLayer
- `layers-voxel-time` — Time-aware VoxelLayer
- `layers-graphics-visibilitytimeextent` — Graphics visibility with time

## Related Skills

- `arcgis-imagery` — Multidimensional imagery with time
- `arcgis-layers` — Layer configuration
- `arcgis-widgets-ui` — Widget placement and slots
