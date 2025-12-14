---
name: arcgis-utility-networks
description: Work with ArcGIS Utility Networks for modeling and analyzing connected infrastructure. Use for network tracing, associations, and utility asset management.
---

# ArcGIS Utility Networks

Use this skill for working with utility networks, tracing, and associations visualization.

## Utility Network Basics

Utility networks model connected infrastructure like electric, gas, water, and telecom systems. Key concepts:
- **Network tracing** - Follow connectivity through the network
- **Associations** - Relationships between network features (connectivity, containment, structural attachment)
- **Subnetworks** - Isolated portions of the network

## Map Components Approach

### Utility Network Trace Component
```html
<arcgis-map item-id="471eb0bf37074b1fbb972b1da70fb310">
  <arcgis-utility-network-trace slot="top-right"></arcgis-utility-network-trace>
</arcgis-map>
```

### Utility Network Associations Component
```html
<arcgis-map item-id="e53b1054b29f4579baf878dcf2effe7a">
  <arcgis-utility-network-associations slot="top-right"></arcgis-utility-network-associations>
</arcgis-map>
```

## Core API Approach

### UtilityNetworkTrace Widget
```javascript
import WebMap from "@arcgis/core/WebMap.js";
import MapView from "@arcgis/core/views/MapView.js";
import UtilityNetworkTrace from "@arcgis/core/widgets/UtilityNetworkTrace.js";
import esriConfig from "@arcgis/core/config.js";

// Configure portal (required for secured utility network services)
esriConfig.portalUrl = "https://www.arcgis.com";

// Load WebMap containing utility network
const webmap = new WebMap({
  portalItem: {
    id: "YOUR_WEBMAP_ID"
  }
});

const view = new MapView({
  container: "viewDiv",
  map: webmap
});

// Create trace widget
const utilityNetworkTrace = new UtilityNetworkTrace({
  view: view
});

view.ui.add(utilityNetworkTrace, "top-right");
```

### UtilityNetworkAssociations Widget
```javascript
import WebMap from "@arcgis/core/WebMap.js";
import MapView from "@arcgis/core/views/MapView.js";
import UtilityNetworkAssociations from "@arcgis/core/widgets/UtilityNetworkAssociations.js";
import TileInfo from "@arcgis/core/layers/support/TileInfo.js";

const webMap = new WebMap({
  portalItem: {
    id: "YOUR_WEBMAP_ID"
  }
});

// Create TileInfo for high zoom levels (required to see associations)
const tileInfo = TileInfo.create({
  spatialReference: { wkid: 102100 },
  numLODs: 32
});

const view = new MapView({
  container: "viewDiv",
  map: webMap,
  zoom: 25,
  constraints: {
    lods: tileInfo.lods,
    snapToZoom: false
  }
});

view.when(async () => {
  await webMap.load();

  // Check if webMap contains utility networks
  if (webMap.utilityNetworks.length > 0) {
    const utilityNetwork = webMap.utilityNetworks.getItemAt(0);
    await utilityNetwork.load();

    const unAssociations = new UtilityNetworkAssociations({
      view,
      utilityNetwork
    });

    view.ui.add(unAssociations, "top-right");
  }
});
```

## Accessing Utility Networks

### Get Utility Network from WebMap
```javascript
await webMap.load();

// Check for utility networks
if (webMap.utilityNetworks && webMap.utilityNetworks.length > 0) {
  const utilityNetwork = webMap.utilityNetworks.getItemAt(0);
  await utilityNetwork.load();

  console.log("Network name:", utilityNetwork.networkName);
  console.log("Tier definitions:", utilityNetwork.definition.tierDefinitions);
}
```

### Utility Network Properties
```javascript
const utilityNetwork = webMap.utilityNetworks.getItemAt(0);
await utilityNetwork.load();

// Access network definition
const definition = utilityNetwork.definition;
console.log("Domain networks:", definition.domainNetworks);
console.log("Terminal configurations:", definition.terminalConfigurations);
console.log("Network attributes:", definition.networkAttributes);
```

## Associations Widget Configuration

### Visible Elements
```javascript
const unAssociations = new UtilityNetworkAssociations({
  view,
  utilityNetwork,
  visibleElements: {
    maxAllowableAssociationsSlider: true,
    connectivityAssociationsSettings: {
      arrowsToggle: false,
      capSelect: false,
      colorPicker: true,
      stylePicker: true,
      widthInput: true
    },
    structuralAttachmentAssociationsSettings: {
      arrowsToggle: false,
      capSelect: false,
      colorPicker: true,
      stylePicker: true,
      widthInput: true
    }
  }
});
```

### Association Types
```javascript
// Connectivity - electrical/flow connections
// Containment - features inside other features
// Structural Attachment - features attached to structures

const unAssociations = new UtilityNetworkAssociations({
  view,
  utilityNetwork,
  associationTypes: ["connectivity", "structural-attachment"]
});
```

## Network Tracing

### Trace Widget Configuration
```javascript
const utilityNetworkTrace = new UtilityNetworkTrace({
  view: view,
  // Optional: specify which traces are available
  showSelectionAttributes: true,
  selectOnComplete: true
});
```

### Trace Types
Common trace types available in utility networks:
- **Connected** - Find all connected features
- **Upstream** - Trace toward sources
- **Downstream** - Trace away from sources
- **Subnetwork** - Find features in same subnetwork
- **Isolation** - Find isolation points
- **Loops** - Find loops in network

## High Zoom Level Support

Associations are only visible at high zoom levels. Configure additional LODs:

```javascript
import TileInfo from "@arcgis/core/layers/support/TileInfo.js";

// Create tile info with 32 LODs for extreme zoom
const tileInfo = TileInfo.create({
  spatialReference: { wkid: 102100 },
  numLODs: 32
});

const view = new MapView({
  container: "viewDiv",
  map: webMap,
  zoom: 25, // High zoom to see associations
  constraints: {
    lods: tileInfo.lods,
    snapToZoom: false
  }
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Utility Network</title>
  <link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/4.34/"></script>
  <style>
    html, body, #viewDiv { height: 100%; margin: 0; }
  </style>
  <script type="module">
    import WebMap from "@arcgis/core/WebMap.js";
    import MapView from "@arcgis/core/views/MapView.js";
    import UtilityNetworkTrace from "@arcgis/core/widgets/UtilityNetworkTrace.js";
    import UtilityNetworkAssociations from "@arcgis/core/widgets/UtilityNetworkAssociations.js";
    import TileInfo from "@arcgis/core/layers/support/TileInfo.js";

    const webMap = new WebMap({
      portalItem: { id: "YOUR_WEBMAP_ID" }
    });

    const tileInfo = TileInfo.create({
      spatialReference: { wkid: 102100 },
      numLODs: 32
    });

    const view = new MapView({
      container: "viewDiv",
      map: webMap,
      constraints: {
        lods: tileInfo.lods,
        snapToZoom: false
      }
    });

    view.when(async () => {
      await webMap.load();

      if (webMap.utilityNetworks.length > 0) {
        const utilityNetwork = webMap.utilityNetworks.getItemAt(0);
        await utilityNetwork.load();

        // Add trace widget
        const trace = new UtilityNetworkTrace({ view });
        view.ui.add(trace, "top-right");

        // Add associations widget
        const associations = new UtilityNetworkAssociations({
          view,
          utilityNetwork
        });
        view.ui.add(associations, "bottom-right");
      }
    });
  </script>
</head>
<body>
  <div id="viewDiv"></div>
</body>
</html>
```

## Common Pitfalls

1. **Authentication required**: Utility network services typically require authentication

2. **WebMap required**: Utility networks must be accessed through a WebMap - they cannot be created client-side

3. **High zoom for associations**: Associations only display at very high zoom levels (use TileInfo with 32+ LODs)

4. **Load order**: Must load WebMap, then load UtilityNetwork before using widgets

5. **Enterprise portals**: Often hosted on ArcGIS Enterprise - configure `esriConfig.portalUrl`

