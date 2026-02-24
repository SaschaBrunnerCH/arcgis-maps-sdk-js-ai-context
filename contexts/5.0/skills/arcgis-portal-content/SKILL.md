---
name: arcgis-portal-content
description: Manage portal content including saving WebMaps/WebScenes, bookmarks, slides, and portal items. Use for content persistence, WebMap/WebScene configuration, and navigation presets.
---

# ArcGIS Portal Content

Use this skill for saving maps, managing bookmarks, slides, working with portal items, and configuring WebMap/WebScene structure.

## Import Patterns

### Direct ESM Imports
```javascript
import WebMap from "@arcgis/core/WebMap.js";
import WebScene from "@arcgis/core/WebScene.js";
import Portal from "@arcgis/core/portal/Portal.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
```

### Dynamic Imports (CDN)
```javascript
const WebMap = await $arcgis.import("@arcgis/core/WebMap.js");
const Portal = await $arcgis.import("@arcgis/core/portal/Portal.js");
const [PortalItem, PortalQueryParams] = await $arcgis.import([
  "@arcgis/core/portal/PortalItem.js",
  "@arcgis/core/portal/PortalQueryParams.js"
]);
```

## WebMap Structure

### WebMap Properties

```javascript
import WebMap from "@arcgis/core/WebMap.js";

const webMap = new WebMap({
  // From portal item
  portalItem: {
    id: "WEBMAP_ID",
    portal: { url: "https://www.arcgis.com" }
  }
});

// Or create from scratch
const webMap = new WebMap({
  basemap: "topo-vector",
  ground: "world-elevation",
  layers: [featureLayer, graphicsLayer],
  tables: [tableLayer],
  initialViewProperties: {
    center: [-118.805, 34.027],
    zoom: 13
  },
  bookmarks: [bookmark1, bookmark2]
});
```

### WebMap from JSON

```javascript
const webMap = WebMap.fromJSON({
  operationalLayers: [{
    id: "layer1",
    layerType: "ArcGISFeatureLayer",
    url: "https://services.arcgis.com/.../FeatureServer/0",
    title: "My Layer",
    visibility: true,
    opacity: 1
  }],
  baseMap: {
    baseMapLayers: [{
      id: "basemap",
      layerType: "VectorTileLayer",
      styleUrl: "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/topographic"
    }],
    title: "Topographic"
  },
  initialState: {
    viewpoint: {
      targetGeometry: {
        xmin: -118.9, ymin: 33.8, xmax: -118.1, ymax: 34.3,
        spatialReference: { wkid: 4326 }
      }
    }
  }
});
```

## WebScene Structure

```javascript
import WebScene from "@arcgis/core/WebScene.js";

const webScene = new WebScene({
  portalItem: { id: "WEBSCENE_ID" }
});

// Or create from scratch
const webScene = new WebScene({
  basemap: "satellite",
  ground: "world-elevation",
  layers: [sceneLayer, featureLayer],
  initialViewProperties: {
    viewpoint: {
      camera: {
        position: { x: -118.805, y: 34.027, z: 1500, spatialReference: { wkid: 4326 } },
        heading: 45,
        tilt: 65
      }
    }
  },
  presentation: {
    slides: [slide1, slide2]
  }
});
```

### Local vs Global Scene

```javascript
// Global scene (default)
const globalScene = new WebScene({
  basemap: "satellite",
  ground: "world-elevation",
  viewingMode: "global"
});

// Local scene (with clipping)
const localScene = new WebScene({
  basemap: "satellite",
  ground: "world-elevation",
  viewingMode: "local",
  clippingArea: {
    type: "extent",
    xmin: -118.9, ymin: 33.8, xmax: -118.1, ymax: 34.3,
    spatialReference: { wkid: 4326 }
  },
  clippingEnabled: true
});
```

## Saving WebMaps

### Save As New Item

```javascript
const map = new WebMap({
  portalItem: { id: "EXISTING_WEBMAP_ID" }
});

// Update map properties from view before saving
await map.updateFrom(view);

const savedItem = await map.saveAs({
  title: "My New WebMap",
  snippet: "Description of the map",
  tags: ["tag1", "tag2"]
});

console.log("Saved to:", savedItem.portal.url + "/home/item.html?id=" + savedItem.id);
```

### Save Existing WebMap

```javascript
await map.updateFrom(view);
await map.save();
```

### Map Component Save Example

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>

<script type="module">
  const viewElement = document.querySelector("arcgis-map");
  await viewElement.viewOnReady();

  document.getElementById("saveBtn").onclick = async () => {
    await viewElement.map.updateFrom(viewElement.view);
    await viewElement.map.save();
  };
</script>
```

## Saving WebScenes

```javascript
const scene = new WebScene({
  portalItem: { id: "EXISTING_WEBSCENE_ID" }
});

await scene.updateFrom(sceneView);
await scene.saveAs({
  title: "My New WebScene",
  snippet: "3D scene description"
});
```

## Bookmarks

### Bookmarks Component

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-expand slot="top-right" expanded>
    <arcgis-bookmarks
      drag-enabled
      show-add-bookmark-button
      show-edit-bookmark-button
      hide-time>
    </arcgis-bookmarks>
  </arcgis-expand>
</arcgis-map>

<script type="module">
  const bookmarks = document.querySelector("arcgis-bookmarks");

  bookmarks.addEventListener("arcgisSelect", (event) => {
    console.log("Selected:", event.detail.bookmark.name);
  });
</script>
```

### Create Bookmarks Programmatically

```javascript
import Bookmark from "@arcgis/core/webmap/Bookmark.js";

const bookmark = new Bookmark({
  name: "My Location",
  viewpoint: view.viewpoint.clone()
});

map.bookmarks.add(bookmark);

// Go to bookmark
view.goTo(bookmark.viewpoint);
```

## WebScene Slides

### Create Slide from Current View

```javascript
import Slide from "@arcgis/core/webscene/Slide.js";

const slide = await Slide.createFrom(sceneView);
slide.title = { text: "Downtown View" };

// Add to presentation
scene.presentation.slides.add(slide);
```

### Apply Slide to View

```javascript
const slide = scene.presentation.slides.getItemAt(0);

slide.applyTo(sceneView, {
  maxDuration: 3000,
  easing: "in-out-coast-cubic"
});
```

### Remove Slide

```javascript
scene.presentation.slides.remove(slide);
```

## Portal Items

### Load Portal Item

```javascript
import PortalItem from "@arcgis/core/portal/PortalItem.js";

const item = new PortalItem({ id: "ITEM_ID" });
await item.load();

console.log("Title:", item.title);
console.log("Type:", item.type);
console.log("Owner:", item.owner);
console.log("Created:", item.created);
```

### Query Portal Items

```javascript
import Portal from "@arcgis/core/portal/Portal.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

const queryParams = new PortalQueryParams({
  query: `owner:${portal.user.username} type:"Web Map"`,
  sortField: "modified",
  sortOrder: "desc",
  num: 20
});

const result = await portal.queryItems(queryParams);
result.results.forEach((item) => {
  console.log(item.title, item.id);
});
```

### Update Portal Item

```javascript
const item = new PortalItem({ id: "ITEM_ID" });
await item.load();

item.title = "Updated Title";
item.snippet = "Updated description";
item.tags = ["new", "tags"];

await item.update();
```

## Portal Groups

### Query Groups

```javascript
const portal = new Portal();
await portal.load();

const groups = await portal.queryGroups({ query: "title:GIS" });
groups.results.forEach((group) => {
  console.log(group.title, group.id);
});
```

### Query Group Content

```javascript
const group = (await portal.queryGroups({ query: `id:GROUP_ID` })).results[0];
const content = await group.queryItems();
content.results.forEach((item) => {
  console.log(item.title);
});
```

## Portal User Information

```javascript
const portal = new Portal({ authMode: "immediate" });
await portal.load();

console.log("Username:", portal.user.username);
console.log("Full name:", portal.user.fullName);
console.log("Email:", portal.user.email);
console.log("Role:", portal.user.role);
console.log("Org name:", portal.name);
```

## Portal Folders

```javascript
import PortalFolder from "@arcgis/core/portal/PortalFolder.js";

// Get user folders
const folders = await portal.user.fetchFolders();
folders.forEach((folder) => {
  console.log(folder.title, folder.id);
});

// Query items in a specific folder
const queryParams = new PortalQueryParams({
  query: `owner:${portal.user.username}`,
  sortField: "modified",
  num: 20
});
queryParams.folder = folder;

const result = await portal.queryItems(queryParams);
```

## Common Pitfalls

1. **Authentication required for saving**: Saving requires user authentication. Ensure OAuth is set up before calling `save()` or `saveAs()`.

2. **Forgetting updateFrom before save**: Always call `updateFrom(view)` before saving to capture the current view state:
   ```javascript
   // Anti-pattern: saving without updating
   await map.save(); // May save stale viewpoint

   // Correct: update from view first
   await map.updateFrom(view);
   await map.save();
   ```

3. **Enterprise portal URL**: Enterprise portals need explicit portal URL:
   ```javascript
   const portal = new Portal({
     url: "https://your-portal.com/portal"
   });
   ```

4. **Ownership restrictions**: You can only update portal items you own. Use `saveAs()` to create a copy you own.

5. **Slide thumbnails**: Generated automatically from `Slide.createFrom()` but may take time to render.

## Complete Save Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>html, body { height: 100%; margin: 0; }</style>
</head>
<body>
  <arcgis-map item-id="YOUR_WEBMAP_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-expand slot="top-right" expanded>
      <arcgis-bookmarks
        drag-enabled
        show-add-bookmark-button
        show-edit-bookmark-button>
      </arcgis-bookmarks>
    </arcgis-expand>
  </arcgis-map>

  <script type="module">
    const viewElement = document.querySelector("arcgis-map");
    await viewElement.viewOnReady();

    // Save map on button click
    document.getElementById("saveBtn").onclick = async () => {
      await viewElement.map.updateFrom(viewElement.view);
      await viewElement.map.save();
    };
  </script>
</body>
</html>
```

## Reference Samples

- `webmap-save` - Saving a WebMap to portal
- `webmap-basic` - Loading a WebMap from portal
- `webmap-swap` - Swapping between WebMaps
- `webscene-save` - Saving a WebScene to portal
- `webscene-basic` - Loading a WebScene from portal
- `webscene-slides` - Managing WebScene slides
- `webscene-slide-tour` - Slide tour through a WebScene
- `bookmarks` - Working with map bookmarks
- `widgets-bookmarks` - Bookmarks widget usage
- `basemaps-portal` - Loading basemaps from portal
- `layers-portal` - Loading layers from portal items
- `portalitem-dragndrop` - Drag and drop portal items

## Related Skills

- See `arcgis-authentication` for OAuth and API key setup.
- See `arcgis-core-maps` for map and view creation.
- See `arcgis-layers` for layer configuration.
