---
name: arcgis-embeddable-maps
description: Embed lightweight, self-contained maps in web pages using the Embeddable Components package. Use for quick map embeds with minimal code and built-in UI controls.
---

# ArcGIS Embeddable Maps

Use this skill when embedding a lightweight, self-contained map into a web page with minimal code. The `@arcgis/embeddable-components` package provides the `arcgis-embedded-map` web component - a single element that bundles a WebMap viewer with optional built-in UI controls (legend, bookmarks, basemap gallery, fullscreen). This is a **new component package in 5.0** with no 4.x equivalent.

> **When to use `arcgis-embedded-map` vs `arcgis-map`:** Use `arcgis-embedded-map` for simple, read-only map embeds (blogs, dashboards, reports) where you don't need custom widgets, editing, or programmatic map control. Use `arcgis-map` (see `arcgis-core-maps`) for full-featured applications.

## Import Patterns

### CDN (No Build Tools)
```html
<!-- Load ArcGIS Maps SDK -->
<script src="https://js.arcgis.com/5.0/"></script>
<!-- Load Embeddable Components -->
<script type="module" src="https://js.arcgis.com/5.0/embeddable-components/"></script>
```

### Direct ESM Imports (Build Tools)
```javascript
import "@arcgis/embeddable-components/components/arcgis-embedded-map";
```

## arcgis-embedded-map Component

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `itemId` | `item-id` | `string` | - | **Required.** Portal item ID of a WebMap |
| `portalUrl` | `portal-url` | `string` | `"https://www.arcgis.com"` | Portal URL (ArcGIS Online or Enterprise) |
| `apiKey` | `api-key` | `string` | - | API key for accessing the resource |
| `center` | `center` | `number[] \| Point` | - | View center `[longitude, latitude]` |
| `zoom` | `zoom` | `number` | - | Zoom level |
| `scale` | `scale` | `string` | - | Map scale at center |
| `extent` | - | `Extent` | - | Visible map extent (set via JS) |
| `webMap` | - | `WebMap` | - | WebMap instance (set via JS, alternative to `itemId`) |
| `theme` | `theme` | `string` | `"light"` | Component theme: `"light"` or `"dark"` |

### UI Control Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `headingEnabled` | `heading-enabled` | `boolean` | `false` | Show the WebMap title |
| `legendEnabled` | `legend-enabled` | `boolean` | `false` | Show the legend panel |
| `bookmarksEnabled` | `bookmarks-enabled` | `boolean` | `false` | Show bookmarks panel |
| `basemapGalleryEnabled` | `basemap-gallery-enabled` | `boolean` | `false` | Show basemap gallery panel |
| `informationEnabled` | `information-enabled` | `boolean` | `false` | Show information panel |
| `shareEnabled` | `share-enabled` | `boolean` | `false` | Show button to open in Map Viewer |
| `fullscreenDisabled` | `fullscreen-disabled` | `boolean` | `false` | Disable the fullscreen button |
| `scrollEnabled` | `scroll-enabled` | `boolean` | `true` | Enable mouse wheel scroll zooming |
| `timeZoneLabelEnabled` | `time-zone-label-enabled` | `boolean` | `false` | Show time zone labels |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `componentOnReady()` | `Promise<void>` | Resolves when the component is fully loaded |

## Basic Usage

### Minimal Embed
```html
<arcgis-embedded-map
  item-id="f2e9b762544945f390ca4ac3671cfa72"
  style="width: 800px; height: 600px;">
</arcgis-embedded-map>
```

### Embed with All UI Controls
```html
<arcgis-embedded-map
  item-id="f2e9b762544945f390ca4ac3671cfa72"
  heading-enabled
  legend-enabled
  bookmarks-enabled
  basemap-gallery-enabled
  information-enabled
  share-enabled
  style="width: 100%; height: 500px;">
</arcgis-embedded-map>
```

### Dark Theme
```html
<arcgis-embedded-map
  item-id="f2e9b762544945f390ca4ac3671cfa72"
  theme="dark"
  legend-enabled
  style="width: 800px; height: 600px;">
</arcgis-embedded-map>
```

### Custom Center and Zoom
```html
<arcgis-embedded-map
  item-id="f2e9b762544945f390ca4ac3671cfa72"
  center="-118.24,34.05"
  zoom="12"
  style="width: 800px; height: 600px;">
</arcgis-embedded-map>
```

### Disable Scroll Zoom (For Inline Content)
```html
<arcgis-embedded-map
  item-id="f2e9b762544945f390ca4ac3671cfa72"
  scroll-enabled="false"
  style="width: 100%; height: 400px;">
</arcgis-embedded-map>
```

### With API Key
```html
<arcgis-embedded-map
  item-id="YOUR_ITEM_ID"
  api-key="YOUR_API_KEY"
  portal-url="https://www.arcgis.com"
  legend-enabled
  style="width: 800px; height: 600px;">
</arcgis-embedded-map>
```

### Enterprise Portal
```html
<arcgis-embedded-map
  item-id="YOUR_ENTERPRISE_ITEM_ID"
  portal-url="https://your-enterprise.com/portal"
  heading-enabled
  legend-enabled
  style="width: 800px; height: 600px;">
</arcgis-embedded-map>
```

## CDN Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Embedded Map</title>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/embeddable-components/"></script>
  <style>
    body { font-family: sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
    arcgis-embedded-map { width: 100%; height: 500px; display: block; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>City Demographics</h1>
  <p>Explore population data across the region.</p>
  <arcgis-embedded-map
    item-id="f2e9b762544945f390ca4ac3671cfa72"
    heading-enabled
    legend-enabled
    bookmarks-enabled
    theme="light">
  </arcgis-embedded-map>
  <p>Data source: US Census Bureau</p>
</body>
</html>
```

## Programmatic Configuration

### Setting Extent via JavaScript
```javascript
const embeddedMap = document.querySelector("arcgis-embedded-map");
await embeddedMap.componentOnReady();

embeddedMap.extent = {
  xmin: -118.5,
  ymin: 33.8,
  xmax: -117.9,
  ymax: 34.3,
  spatialReference: { wkid: 4326 }
};
```

### Using a WebMap Instance
```javascript
const WebMap = await $arcgis.import("@arcgis/core/WebMap.js");

const webMap = new WebMap({
  portalItem: { id: "f2e9b762544945f390ca4ac3671cfa72" }
});

const embeddedMap = document.querySelector("arcgis-embedded-map");
embeddedMap.webMap = webMap;
```

## Theming with CSS Variables

The component supports Calcite Design System CSS variables:

```css
arcgis-embedded-map {
  --calcite-color-brand: #007ac2;
  --calcite-color-foreground-1: #ffffff;
  --calcite-color-text-1: #151515;
  --calcite-color-border-1: #cacaca;
}
```

## Common Pitfalls

1. **Missing `item-id`**: The component requires a WebMap portal item ID.

   ```html
   <!-- Anti-pattern: no item-id -->
   <arcgis-embedded-map style="width: 800px; height: 600px;">
   </arcgis-embedded-map>
   ```

   ```html
   <!-- Correct: provide item-id -->
   <arcgis-embedded-map
     item-id="f2e9b762544945f390ca4ac3671cfa72"
     style="width: 800px; height: 600px;">
   </arcgis-embedded-map>
   ```

   **Impact:** The component renders an empty container with no map.

2. **Missing embeddable-components script**: The package must be loaded separately.

   ```html
   <!-- Anti-pattern: only loading core SDK -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <arcgis-embedded-map item-id="abc123"></arcgis-embedded-map>
   ```

   ```html
   <!-- Correct: load embeddable-components -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <script type="module" src="https://js.arcgis.com/5.0/embeddable-components/"></script>
   <arcgis-embedded-map item-id="abc123"></arcgis-embedded-map>
   ```

   **Impact:** The element is unrecognized and renders as empty.

3. **No explicit size**: The embedded map needs width and height to render visibly.

   ```html
   <!-- Anti-pattern: no size set -->
   <arcgis-embedded-map item-id="abc123"></arcgis-embedded-map>
   ```

   ```html
   <!-- Correct: explicit dimensions -->
   <arcgis-embedded-map
     item-id="abc123"
     style="width: 100%; height: 500px; display: block;">
   </arcgis-embedded-map>
   ```

   **Impact:** The map renders with zero height and is invisible on the page.

4. **Using `arcgis-embedded-map` for interactive apps**: This component is designed for simple embeds. It does not support custom widgets, editing, layer manipulation, or programmatic view control. Use `arcgis-map` from `@arcgis/map-components` for full applications.

   **Impact:** Attempting to add widgets or edit features fails silently.

5. **Scroll zoom in long pages**: When the embedded map is inline with scrollable content, scroll zoom can trap users. Disable it for better UX.

   ```html
   <arcgis-embedded-map
     item-id="abc123"
     scroll-enabled="false"
     style="width: 100%; height: 400px;">
   </arcgis-embedded-map>
   ```

   **Impact:** Users get stuck zooming the map when they want to scroll the page.

## Reference Samples

- Search for embedded map samples demonstrating lightweight WebMap embedding.

## Related Skills

- See `arcgis-core-maps` for full-featured map applications using `arcgis-map` and `arcgis-scene`.
- See `arcgis-starter-app` for project scaffolding and CDN setup.
- See `arcgis-authentication` for API key and portal authentication.
