---
name: arcgis-portal-content
description: Manage portal content including saving WebMaps/WebScenes, bookmarks, slides, and portal items. Use for content persistence, WebMap/WebScene configuration, and navigation presets.
---

# ArcGIS Portal Content

Use this skill for saving maps, managing bookmarks, slides, working with portal items, and configuring WebMap/WebScene structure.

## WebMap Structure

### WebMap Properties

```javascript
import WebMap from "@arcgis/core/WebMap.js";

const webMap = new WebMap({
  // Portal item reference
  portalItem: {
    id: "WEBMAP_ID",
    portal: { url: "https://www.arcgis.com" }
  },

  // Or create from scratch
  basemap: "topo-vector",
  ground: "world-elevation",

  // Layers
  layers: [featureLayer, graphicsLayer],

  // Tables (non-spatial)
  tables: [tableLayer],

  // Initial viewpoint
  initialViewProperties: {
    center: [-118.805, 34.027],
    zoom: 13,
    rotation: 0
  },

  // Bookmarks
  bookmarks: [bookmark1, bookmark2],

  // Application properties
  applicationProperties: {
    viewing: {
      search: {
        enabled: true,
        hintText: "Search for places"
      }
    }
  }
});
```

### WebMap from JSON

```javascript
import WebMap from "@arcgis/core/WebMap.js";

// Create WebMap from JSON specification
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
  },
  version: "2.31"
});
```

### WebMap Initial State

```javascript
const webMap = new WebMap({
  basemap: "streets-vector",
  initialViewProperties: {
    // Viewpoint
    viewpoint: {
      targetGeometry: {
        type: "extent",
        xmin: -13050000, ymin: 3980000,
        xmax: -13000000, ymax: 4050000,
        spatialReference: { wkid: 102100 }
      },
      rotation: 45
    },
    // Or simpler
    center: [-118.805, 34.027],
    zoom: 12,
    scale: 50000,

    // Constraints
    constraints: {
      minZoom: 8,
      maxZoom: 18,
      minScale: 5000000,
      maxScale: 1000,
      rotationEnabled: false
    },

    // Time extent
    timeExtent: {
      start: new Date("2024-01-01"),
      end: new Date("2024-12-31")
    }
  }
});
```

## WebScene Structure

### WebScene Properties

```javascript
import WebScene from "@arcgis/core/WebScene.js";

const webScene = new WebScene({
  // Portal item
  portalItem: { id: "WEBSCENE_ID" },

  // Or create from scratch
  basemap: "satellite",
  ground: "world-elevation",

  // Layers
  layers: [sceneLayer, featureLayer],

  // Initial viewpoint
  initialViewProperties: {
    viewpoint: {
      camera: {
        position: {
          x: -118.805,
          y: 34.027,
          z: 1500,
          spatialReference: { wkid: 4326 }
        },
        heading: 45,
        tilt: 65
      }
    }
  },

  // Presentation (slides)
  presentation: {
    slides: [slide1, slide2]
  },

  // Clipping area (local scenes)
  clippingArea: extent,
  clippingEnabled: true
});
```

### WebScene Environment

```javascript
const webScene = new WebScene({
  basemap: "satellite",
  ground: "world-elevation",

  // Environment settings
  environment: {
    // Lighting
    lighting: {
      type: "sun",  // sun, virtual
      date: new Date("2024-06-21T12:00:00"),
      directShadowsEnabled: true,
      ambientOcclusionEnabled: true
    },

    // Atmosphere
    atmosphere: {
      quality: "high"  // low, high
    },

    // Background
    background: {
      type: "color",
      color: [0, 0, 0, 1]
    },

    // Stars
    starsEnabled: true,

    // Weather
    weather: {
      type: "sunny",  // sunny, cloudy, rainy, snowy, foggy
      cloudCover: 0.3
    }
  }
});
```

### WebScene Presentation

```javascript
import Slide from "@arcgis/core/webscene/Slide.js";

// Access existing slides
const slides = webScene.presentation.slides;

// Create new slide
const slide = await Slide.createFrom(sceneView);
slide.title = { text: "Downtown View" };
slide.description = { text: "Overview of downtown area" };

// Slide properties captured
console.log(slide.viewpoint);           // Camera position
console.log(slide.visibleLayers);       // Layer visibility
console.log(slide.environment);         // Environment settings
console.log(slide.thumbnail);           // Auto-generated thumbnail

// Add to presentation
webScene.presentation.slides.add(slide);

// Reorder slides
webScene.presentation.slides.reorder(slide, 0);
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

## Application Properties

### WebMap Application Properties

```javascript
const webMap = new WebMap({
  applicationProperties: {
    // Viewing properties
    viewing: {
      // Search configuration
      search: {
        enabled: true,
        disablePlaceFinder: false,
        hintText: "Find address or place",
        layers: [{
          id: "search-layer",
          field: { name: "Name", exactMatch: false }
        }]
      }
    }
  }
});

// Access application properties
const searchEnabled = webMap.applicationProperties?.viewing?.search?.enabled;
```

### WebScene Application Properties

```javascript
const webScene = new WebScene({
  applicationProperties: {
    viewing: {
      search: {
        enabled: true
      }
    }
  },

  // Presentation settings
  presentation: {
    slides: [],
    useViewFor: "slideshow"  // slideshow, comparison
  }
});
```

## Saving WebMaps

### Save WebMap As New Item
```javascript
import WebMap from "@arcgis/core/WebMap.js";

const map = new WebMap({
  portalItem: { id: "EXISTING_WEBMAP_ID" }
});

// Update map properties from view before saving
await map.updateFrom(view);

// Save as new item
const item = {
  title: "My New WebMap",
  snippet: "Description of the map",
  tags: ["tag1", "tag2"]
};

const savedItem = await map.saveAs(item);
console.log("Saved to:", savedItem.portal.url + "/home/item.html?id=" + savedItem.id);
```

### Save Existing WebMap
```javascript
// Update and save existing webmap
await map.updateFrom(view);
await map.save();
console.log("WebMap saved");
```

### Map Component Save Example
```html
<arcgis-map>
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <calcite-panel slot="top-right">
    <calcite-input id="webMapTitle" value="My WebMap"></calcite-input>
    <calcite-button id="saveWebMap">Save</calcite-button>
  </calcite-panel>
</arcgis-map>

<script type="module">
  import WebMap from "@arcgis/core/WebMap.js";

  const viewElement = document.querySelector("arcgis-map");
  const map = new WebMap({ portalItem: { id: "YOUR_WEBMAP_ID" } });
  viewElement.map = map;

  await viewElement.viewOnReady();

  document.getElementById("saveWebMap").onclick = async () => {
    const title = document.getElementById("webMapTitle").value;

    await map.updateFrom(viewElement.view);
    const item = await map.saveAs({ title });

    alert(`Saved as: ${item.id}`);
  };
</script>
```

## Saving WebScenes

### Save WebScene
```javascript
import WebScene from "@arcgis/core/WebScene.js";

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
    const bookmark = event.detail.bookmark;
    console.log("Selected bookmark:", bookmark.name);
  });
</script>
```

### Bookmarks Widget (Core API)
```javascript
import Bookmarks from "@arcgis/core/widgets/Bookmarks.js";

const bookmarks = new Bookmarks({
  view: view,
  visibleElements: {
    addBookmarkButton: true,
    editBookmarkButton: true,
    time: false
  }
});

view.ui.add(bookmarks, "top-right");

// Listen for bookmark selection
bookmarks.on("bookmark-select", (event) => {
  console.log("Selected:", event.bookmark.name);
});
```

### Create Bookmarks Programmatically
```javascript
import Bookmark from "@arcgis/core/webmap/Bookmark.js";

// Create bookmark from current view
const bookmark = new Bookmark({
  name: "My Location",
  viewpoint: view.viewpoint.clone()
});

// Add to map's bookmarks
map.bookmarks.add(bookmark);

// Go to bookmark
view.goTo(bookmark.viewpoint);
```

### Bookmarks with Feature Effect
```javascript
const bookmarks = document.querySelector("arcgis-bookmarks");

bookmarks.addEventListener("arcgisSelect", (event) => {
  const bookmarkName = event.detail.bookmark.name.toUpperCase();

  layer.featureEffect = {
    filter: {
      where: `Name = '${bookmarkName}'`
    },
    excludedEffect: "grayscale(100%) opacity(30%)"
  };
});
```

## WebScene Slides

### Slides Component Example
```html
<arcgis-scene item-id="YOUR_WEBSCENE_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <calcite-panel slot="top-right" heading="Slides">
    <calcite-list id="slidesDiv"></calcite-list>
  </calcite-panel>
</arcgis-scene>

<script type="module">
  import Slide from "@arcgis/core/webscene/Slide.js";

  const viewElement = document.querySelector("arcgis-scene");
  await viewElement.viewOnReady();

  const slides = viewElement.map.presentation.slides;

  // Render existing slides
  slides.forEach(slide => createSlideUI(slide));

  function createSlideUI(slide) {
    const item = document.createElement("calcite-list-item");
    item.label = slide.title.text;
    item.innerHTML = `<img slot="content-start" src="${slide.thumbnail.url}">`;

    item.addEventListener("calciteListItemSelect", () => {
      slide.applyTo(viewElement.view, {
        maxDuration: 3000,
        easing: "in-out-coast-cubic"
      });
    });

    document.getElementById("slidesDiv").appendChild(item);
  }
</script>
```

### Create Slide Programmatically
```javascript
import Slide from "@arcgis/core/webscene/Slide.js";

// Create slide from current view
const slide = await Slide.createFrom(sceneView);
slide.title.text = "My Slide";

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

const item = new PortalItem({
  id: "ITEM_ID"
});

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

result.results.forEach(item => {
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

### Share Portal Item
```javascript
// Use the Portal sharing API
import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

// Share via PortalSharingResource or REST API
// Access sharing is managed through the portal sharing endpoint
```

## Portal Groups

### Query Groups
```javascript
import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal();
await portal.load();

const groups = await portal.queryGroups({
  query: "title:GIS"
});

groups.results.forEach(group => {
  console.log(group.title, group.id);
});
```

### Query Group Content
```javascript
const group = await portal.queryGroups({
  query: `id:GROUP_ID`
});

const content = await group.results[0].queryItems();
content.results.forEach(item => {
  console.log(item.title);
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
  <script src="https://js.arcgis.com/4.34/"></script>
  <script type="module" src="https://js.arcgis.com/4.34/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
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
    <calcite-button slot="bottom-right" id="saveBtn">Save Map</calcite-button>
  </arcgis-map>

  <script type="module">
    const viewElement = document.querySelector("arcgis-map");
    await viewElement.viewOnReady();

    document.getElementById("saveBtn").onclick = async () => {
      await viewElement.map.updateFrom(viewElement.view);
      await viewElement.map.save();
      alert("Map saved!");
    };
  </script>
</body>
</html>
```

## Reference Samples

- `webmap-save` - Saving a WebMap to portal
- `webscene-save` - Saving a WebScene to portal
- `bookmarks` - Working with map bookmarks
- `webscene-slides` - Managing WebScene slides
- `layers-portal` - Loading layers from portal items

## Common Pitfalls

1. **Authentication required**: Saving requires user authentication

2. **updateFrom before save**: Always call `updateFrom(view)` before saving

3. **Portal URL**: Enterprise portals need explicit portal URL configuration

4. **Ownership**: Can only update items you own

5. **Slide thumbnails**: Generated automatically but may take time

