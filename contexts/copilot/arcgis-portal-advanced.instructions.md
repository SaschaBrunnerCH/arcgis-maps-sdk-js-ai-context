---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Portal, Imagery & Advanced Features

## Portal Operations

### Load Portal
```javascript
import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

console.log("User:", portal.user.username);
console.log("Org:", portal.name);
```

### Query Portal Items
```javascript
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";

const queryParams = new PortalQueryParams({
  query: `owner:${portal.user.username} type:"Web Map"`,
  sortField: "modified",
  sortOrder: "desc",
  num: 20
});

const result = await portal.queryItems(queryParams);
result.results.forEach(item => console.log(item.title, item.id));
```

### Create/Save WebMap
```javascript
import WebMap from "@arcgis/core/WebMap.js";

const webmap = new WebMap({ basemap: "topo-vector" });
webmap.add(layer);

await webmap.save({
  title: "My WebMap",
  description: "Description",
  tags: ["tag1", "tag2"]
});
```

### PortalItem Operations
```javascript
import PortalItem from "@arcgis/core/portal/PortalItem.js";

const item = new PortalItem({ id: "ITEM_ID" });
await item.load();

console.log(item.title, item.type, item.owner);

// Update item
item.title = "New Title";
await item.update();
```

## Imagery Layers

### ImageryLayer
```javascript
import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";

const imageryLayer = new ImageryLayer({
  url: "https://services.arcgis.com/.../ImageServer",
  format: "jpgpng",
  renderingRule: {
    functionName: "NDVI"  // or "Hillshade", "Stretch", etc.
  }
});
```

### ImageryTileLayer
```javascript
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer.js";

const tileLayer = new ImageryTileLayer({
  url: "https://services.arcgis.com/.../ImageServer"
});
```

### Multidimensional Imagery
```javascript
const imageryLayer = new ImageryLayer({
  url: "...",
  multidimensionalDefinition: [{
    variableName: "temperature",
    dimensionName: "StdTime",
    values: [1609459200000]
  }]
});
```

### Raster Functions
```javascript
imageryLayer.renderingRule = {
  functionName: "Stretch",
  functionArguments: {
    StretchType: 5,  // Standard deviation
    NumberOfStandardDeviations: 2
  }
};
```

## Media Layers

### MediaLayer
```javascript
import MediaLayer from "@arcgis/core/layers/MediaLayer.js";
import ImageElement from "@arcgis/core/layers/support/ImageElement.js";

const mediaLayer = new MediaLayer({
  source: [
    new ImageElement({
      image: "https://example.com/image.png",
      georeference: {
        type: "corners",
        topLeft: { x: -118.5, y: 34.5 },
        topRight: { x: -117.5, y: 34.5 },
        bottomRight: { x: -117.5, y: 33.5 },
        bottomLeft: { x: -118.5, y: 33.5 }
      }
    })
  ]
});
```

### VideoElement
```javascript
import VideoElement from "@arcgis/core/layers/support/VideoElement.js";

const videoElement = new VideoElement({
  video: videoUrl,
  georeference: { /* extent */ }
});
```

## Advanced Layer Types

### SubtypeGroupLayer
```javascript
import SubtypeGroupLayer from "@arcgis/core/layers/SubtypeGroupLayer.js";

const subtypeLayer = new SubtypeGroupLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
});

await subtypeLayer.load();
subtypeLayer.sublayers.forEach(sublayer => {
  console.log("Subtype:", sublayer.subtypeCode, sublayer.title);
});
```

### GroupLayer
```javascript
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";

const groupLayer = new GroupLayer({
  title: "My Group",
  layers: [layer1, layer2, layer3],
  visibilityMode: "independent"  // independent, inherited, exclusive
});
```

### WMSLayer
```javascript
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";

const wmsLayer = new WMSLayer({
  url: "https://services.example.com/wms",
  sublayers: [{ name: "layer_name" }]
});
```

### WFSLayer
```javascript
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";

const wfsLayer = new WFSLayer({
  url: "https://services.example.com/wfs",
  name: "feature_type_name"
});
```

### OGCFeatureLayer
```javascript
import OGCFeatureLayer from "@arcgis/core/layers/OGCFeatureLayer.js";

const ogcLayer = new OGCFeatureLayer({
  url: "https://services.example.com/ogcapi/collections/features"
});
```

## Knowledge Graphs

```javascript
import KnowledgeGraphLayer from "@arcgis/core/layers/KnowledgeGraphLayer.js";

const kgLayer = new KnowledgeGraphLayer({
  url: "https://services.arcgis.com/.../knowledgeGraphServer"
});

// Query knowledge graph
const query = {
  openCypherQuery: "MATCH (n:Person) RETURN n LIMIT 10"
};
const results = await kgLayer.queryKnowledge(query);
```

## Utility Networks

```javascript
import UtilityNetwork from "@arcgis/core/networks/UtilityNetwork.js";

const utilityNetwork = new UtilityNetwork({
  url: "https://services.arcgis.com/.../FeatureServer"
});

await utilityNetwork.load();

// Trace
const traceResult = await utilityNetwork.trace({
  traceType: "upstream",
  traceLocations: [{ /* start point */ }]
});
```

## Feature Effects

```javascript
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";

layerView.featureEffect = new FeatureEffect({
  filter: { where: "population > 100000" },
  includedEffect: "bloom(1, 0.5px, 0.2)",
  excludedEffect: "grayscale(100%) opacity(30%)"
});
```

## Custom WebGL Rendering

```javascript
import CustomRenderer from "@arcgis/core/renderers/experimental/CustomRenderer.js";

const customRenderer = {
  type: "custom",
  setup: (context) => { /* WebGL setup */ },
  draw: (context) => { /* WebGL draw calls */ }
};
```

## Layer Effects

```javascript
// CSS-like effects
layer.effect = "drop-shadow(2px 2px 3px gray)";
layer.effect = "blur(2px)";
layer.effect = "grayscale(100%)";
layer.effect = "brightness(150%) contrast(120%)";

// Blend modes
layer.blendMode = "multiply";  // normal, multiply, screen, overlay, darken, lighten
```

## Common Pitfalls

1. **Portal auth** - Set `authMode: "immediate"` for user content
2. **Imagery rendering rules** - Check available functions
3. **Knowledge graphs** - Requires ArcGIS Enterprise
4. **Utility networks** - Requires proper network configuration
