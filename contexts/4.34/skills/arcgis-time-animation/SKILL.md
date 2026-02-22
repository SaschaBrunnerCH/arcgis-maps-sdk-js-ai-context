---
name: arcgis-time-animation
description: Work with temporal data using TimeSlider, TimeExtent, and time-aware layers. Use for animating data over time, filtering by date ranges, and visualizing temporal patterns.
---

# ArcGIS Time Animation

Use this skill for working with temporal data, time-aware layers, and time animation controls.

## TimeExtent

Represents a time range with start and end dates.

```javascript
import TimeExtent from "@arcgis/core/TimeExtent.js";

// Create time extent
const timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31")
});

// Apply to view
view.timeExtent = timeExtent;
```

### TimeExtent Properties

```javascript
const timeExtent = new TimeExtent({
  start: new Date("2024-01-01T00:00:00Z"),
  end: new Date("2024-06-30T23:59:59Z")
});

console.log(timeExtent.start);  // Date object
console.log(timeExtent.end);    // Date object

// Check if instant (start === end)
if (timeExtent.start.getTime() === timeExtent.end.getTime()) {
  console.log("This is a time instant");
}
```

### Null TimeExtent

```javascript
// No time filter (show all data)
view.timeExtent = null;

// Instant in time
const instant = new TimeExtent({
  start: new Date("2024-06-15"),
  end: new Date("2024-06-15")
});
```

## TimeInterval

Represents a duration of time.

```javascript
import TimeInterval from "@arcgis/core/TimeInterval.js";

const interval = new TimeInterval({
  value: 1,
  unit: "months"  // milliseconds, seconds, minutes, hours, days, weeks, months, years
});
```

### TimeInterval Units

- `milliseconds`
- `seconds`
- `minutes`
- `hours`
- `days`
- `weeks`
- `months`
- `years`
- `decades`
- `centuries`

## TimeSlider

Interactive widget for controlling temporal display.

### TimeSlider Component

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
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";

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
  }
});
```

### TimeSlider with Playback

```javascript
const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view,
  mode: "time-window",  // instant, time-window, cumulative-from-start, cumulative-from-end
  fullTimeExtent: {
    start: new Date("2020-01-01"),
    end: new Date("2024-12-31")
  },
  playRate: 1000,  // Milliseconds between steps
  loop: true,
  stops: {
    interval: {
      value: 1,
      unit: "months"
    }
  }
});

// Start/stop playback
timeSlider.play();
timeSlider.stop();
```

### TimeSlider Modes

```javascript
// Instant - single point in time
const instantSlider = new TimeSlider({
  mode: "instant",
  fullTimeExtent: { start, end }
});

// Time Window - range with start and end
const windowSlider = new TimeSlider({
  mode: "time-window",
  fullTimeExtent: { start, end }
});

// Cumulative from Start - everything from start to current
const cumulativeStart = new TimeSlider({
  mode: "cumulative-from-start",
  fullTimeExtent: { start, end }
});

// Cumulative from End - everything from current to end
const cumulativeEnd = new TimeSlider({
  mode: "cumulative-from-end",
  fullTimeExtent: { start, end }
});
```

### Custom Stops

```javascript
// Interval-based stops
const timeSlider = new TimeSlider({
  stops: {
    interval: {
      value: 1,
      unit: "weeks"
    }
  }
});

// Specific dates
const timeSlider = new TimeSlider({
  stops: {
    dates: [
      new Date("2024-01-01"),
      new Date("2024-04-01"),
      new Date("2024-07-01"),
      new Date("2024-10-01")
    ]
  }
});

// Number of stops (evenly distributed)
const timeSlider = new TimeSlider({
  stops: {
    count: 12  // 12 evenly spaced stops
  }
});
```

### TimeSlider Events

```javascript
// Watch for time extent changes
timeSlider.watch("timeExtent", (timeExtent) => {
  console.log("New time extent:", timeExtent.start, "to", timeExtent.end);
  updateCharts(timeExtent);
});

// Watch for playback state
timeSlider.watch("viewModel.state", (state) => {
  console.log("State:", state);  // ready, playing, disabled
});
```

### TimeSlider Configuration

```javascript
const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view,
  fullTimeExtent: {
    start: new Date("2020-01-01"),
    end: new Date("2024-12-31")
  },

  // Display options
  layout: "auto",  // auto, compact, wide
  tickConfigs: [{
    mode: "position",
    values: [
      new Date("2021-01-01"),
      new Date("2022-01-01"),
      new Date("2023-01-01"),
      new Date("2024-01-01")
    ],
    labelsVisible: true,
    labelFormatFunction: (value) => value.getFullYear().toString()
  }],

  // Behavior
  playRate: 2000,
  loop: true,

  // Labels
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
    startField: "event_date",  // Field containing date
    endField: "end_date",      // Optional end date field
    interval: {
      value: 1,
      unit: "days"
    }
  }
});

// Check if layer supports time
if (featureLayer.timeInfo) {
  console.log("Time field:", featureLayer.timeInfo.startField);
  console.log("Full extent:", featureLayer.timeInfo.fullTimeExtent);
}
```

### TimeInfo Properties

```javascript
const timeInfo = {
  startField: "start_time",           // Required: start date field
  endField: "end_time",               // Optional: end date field (for duration)
  fullTimeExtent: {                   // Data's full time range
    start: new Date("2020-01-01"),
    end: new Date("2024-12-31")
  },
  interval: {                         // Suggested animation interval
    value: 1,
    unit: "months"
  }
};
```

### ImageryLayer with Time

```javascript
const imageryLayer = new ImageryLayer({
  url: "https://services.arcgis.com/.../ImageServer",
  timeInfo: {
    startField: "acquisition_date"
  }
});

// Multidimensional imagery
const multidimLayer = new ImageryLayer({
  url: "https://services.arcgis.com/.../ImageServer",
  multidimensionalDefinition: [{
    variableName: "temperature",
    dimensionName: "StdTime",
    values: [1609459200000]  // Epoch milliseconds
  }]
});
```

### MapImageLayer with Time

```javascript
const mapImageLayer = new MapImageLayer({
  url: "https://services.arcgis.com/.../MapServer",
  timeInfo: {
    startField: "date_field"
  }
});
```

### StreamLayer with Time

```javascript
const streamLayer = new StreamLayer({
  url: "wss://services.arcgis.com/.../StreamServer",
  timeInfo: {
    trackIdField: "vehicle_id",
    startField: "timestamp"
  },
  purgeOptions: {
    displayCount: 1000,
    age: 5  // Minutes to keep
  }
});
```

## Initializing TimeSlider from Layer

```javascript
// Auto-configure from time-aware layer
await featureLayer.load();

const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view
});

// Manually configure from layer
if (featureLayer.timeInfo) {
  timeSlider.fullTimeExtent = featureLayer.timeInfo.fullTimeExtent;
  timeSlider.stops = {
    interval: featureLayer.timeInfo.interval
  };
}
```

## TimeZoneLabel

Display time zone information.

### TimeZoneLabel Component
```html
<arcgis-map>
  <arcgis-time-zone-label slot="bottom-left"></arcgis-time-zone-label>
</arcgis-map>
```

### TimeZoneLabel Widget (Core API) - Deprecated

> **DEPRECATED since 4.33:** Use the `arcgis-time-zone-label` component shown above instead. For information on widget deprecation, see [Esri's move to web components](https://developers.arcgis.com/javascript/latest/components-transition-plan/).

```javascript
// DEPRECATED - Use arcgis-time-zone-label component instead
import TimeZoneLabel from "@arcgis/core/widgets/TimeZoneLabel.js";

const timeZoneLabel = new TimeZoneLabel({
  view: view
});

view.ui.add(timeZoneLabel, "bottom-left");
```

## Filtering by Time

### Client-Side Filter

```javascript
// Apply time filter to view
view.timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-06-30")
});

// Filter specific layer
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

// Usage
animateOverTime(
  featureLayer,
  new Date("2024-01-01"),
  new Date("2024-12-31"),
  7  // Weekly intervals
);
```

### TimeSlider with Statistics

```javascript
// Update statistics panel as time changes
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

### Synchronized TimeSliders

```javascript
// Sync multiple time sliders
const mainSlider = new TimeSlider({
  container: "mainSliderDiv",
  view: mainView
});

const compareSlider = new TimeSlider({
  container: "compareSliderDiv",
  view: compareView
});

// Sync them
mainSlider.watch("timeExtent", (timeExtent) => {
  compareSlider.timeExtent = timeExtent;
});
```

## Historical Data Visualization

### Track Lines

```javascript
// Show movement paths with time
const featureLayer = new FeatureLayer({
  url: "https://.../tracks/FeatureServer/0",
  timeInfo: {
    startField: "timestamp",
    trackIdField: "vehicle_id"
  },
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-line",
      color: "blue",
      width: 2
    }
  }
});
```

### Age-Based Styling

```javascript
// Style features based on age
const featureLayer = new FeatureLayer({
  url: "...",
  renderer: {
    type: "simple",
    symbol: { type: "simple-marker", size: 8 },
    visualVariables: [{
      type: "color",
      field: "timestamp",
      stops: [
        { value: Date.now() - 86400000, color: "red" },    // 1 day old
        { value: Date.now() - 604800000, color: "yellow" }, // 1 week old
        { value: Date.now() - 2592000000, color: "gray" }   // 30 days old
      ]
    }]
  }
});
```

## Common Patterns

### Full TimeSlider Setup

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

  // Update UI on time change
  timeSlider.watch("timeExtent", (extent) => {
    document.getElementById("currentTime").textContent =
      `${extent.start.toLocaleDateString()} - ${extent.end.toLocaleDateString()}`;
  });

  return timeSlider;
}
```

### Time-Aware Query

```javascript
async function queryByTimeRange(layer, startDate, endDate) {
  const query = layer.createQuery();
  query.timeExtent = new TimeExtent({
    start: startDate,
    end: endDate
  });
  query.outFields = ["*"];
  query.returnGeometry = true;

  return await layer.queryFeatures(query);
}

// Usage
const marchData = await queryByTimeRange(
  featureLayer,
  new Date("2024-03-01"),
  new Date("2024-03-31")
);
```

### Time-Based Highlighting

```javascript
// Highlight features from current time period
timeSlider.watch("timeExtent", async (timeExtent) => {
  // Clear previous highlights
  if (highlightHandle) {
    highlightHandle.remove();
  }

  // Query features in current time extent
  const query = featureLayer.createQuery();
  query.timeExtent = timeExtent;

  const layerView = await view.whenLayerView(featureLayer);
  const results = await featureLayer.queryFeatures(query);

  highlightHandle = layerView.highlight(results.features);
});
```

## TypeScript Usage

Time configurations use autocasting. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for time slider configuration
const timeSlider = new TimeSlider({
  view: view,
  mode: "time-window",
  stops: {
    interval: {
      value: 1,
      unit: "hours"
    }
  } as const
});

// For layer time settings
layer.timeInfo = {
  startField: "start_date",
  endField: "end_date",
  interval: {
    value: 1,
    unit: "days"
  }
} as const;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `timeslider` - Basic TimeSlider widget usage
- `timeslider-filter` - Filtering data with TimeSlider
- `timeslider-component-filter` - TimeSlider component with filtering
- `time-layer` - Working with time-aware layers

## Common Pitfalls

1. **Time Zone Issues**: Dates are affected by time zones
   ```javascript
   // Use UTC dates for consistency
   const date = new Date("2024-06-15T00:00:00Z");

   // Or specify timezone
   const localDate = new Date("2024-06-15T00:00:00-05:00");
   ```

2. **Layer Must Be Loaded**: TimeInfo is only available after loading
   ```javascript
   await layer.load();
   if (layer.timeInfo) {
     // Now timeInfo is available
   }
   ```

3. **TimeExtent Not Applied**: View's timeExtent must be set
   ```javascript
   // Set on view to filter all time-aware layers
   view.timeExtent = timeExtent;

   // Or on specific layerView for per-layer filtering
   layerView.filter = { timeExtent };
   ```

4. **Null vs Undefined**: Use null to show all data
   ```javascript
   // Show all data (no time filter)
   view.timeExtent = null;
   ```

5. **Performance**: Large time ranges can be slow
   ```javascript
   // Consider using time-based queries instead of filtering
   const query = layer.createQuery();
   query.timeExtent = smallerTimeRange;
   ```

