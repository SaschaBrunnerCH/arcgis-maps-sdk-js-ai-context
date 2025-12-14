---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Time & Animation

Work with temporal data, time-aware layers, and animation controls.

## TimeExtent

```javascript
import TimeExtent from "@arcgis/core/TimeExtent.js";

const timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31")
});

view.timeExtent = timeExtent;
```

## TimeSlider Component

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-time-slider slot="bottom-left" mode="time-window" loop></arcgis-time-slider>
</arcgis-map>
```

## TimeSlider Widget (Core API)

```javascript
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";

const timeSlider = new TimeSlider({
  container: "timeSliderDiv",
  view: view,
  fullTimeExtent: {
    start: new Date("2020-01-01"),
    end: new Date("2024-12-31")
  },
  mode: "time-window",  // instant, time-window, cumulative-from-start, cumulative-from-end
  playRate: 1000,
  loop: true,
  stops: {
    interval: { value: 1, unit: "months" }
  }
});

// Playback controls
timeSlider.play();
timeSlider.stop();

// Watch for changes
timeSlider.watch("timeExtent", (timeExtent) => {
  console.log("Time:", timeExtent.start, timeExtent.end);
});
```

## Time-Aware Layers

```javascript
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  timeInfo: {
    startField: "event_date",
    endField: "end_date",
    interval: { value: 1, unit: "days" }
  }
});

await layer.load();
if (layer.timeInfo) {
  timeSlider.fullTimeExtent = layer.timeInfo.fullTimeExtent;
}
```

## Query with Time

```javascript
const query = layer.createQuery();
query.timeExtent = new TimeExtent({
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31")
});

const results = await layer.queryFeatures(query);
```

## Custom Stops

```javascript
// Interval-based
stops: { interval: { value: 1, unit: "weeks" } }

// Specific dates
stops: { dates: [new Date("2024-01-01"), new Date("2024-04-01")] }

// Even count
stops: { count: 12 }
```

## TimeInterval Units

`milliseconds`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`

## Common Pitfalls

1. **Time zone issues** - Use UTC for consistency
2. **Layer must be loaded** - TimeInfo available after load()
3. **Null for all data** - Set `view.timeExtent = null` to show all
4. **Performance** - Large time ranges can be slow
