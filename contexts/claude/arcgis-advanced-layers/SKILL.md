---
name: arcgis-advanced-layers
description: Work with advanced layer types including WMS, WFS, WMTS, OGCFeatureLayer, MapImageLayer, CatalogLayer, and dynamic data layers. Use for OGC services and server-side rendering.
---

# ArcGIS Advanced Layers

Use this skill for working with OGC services, MapImageLayer, CatalogLayer, and dynamic data layers.

## WMSLayer (Web Map Service)

### Basic WMSLayer
```javascript
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";

const layer = new WMSLayer({
  url: "https://ows.terrestris.de/osm/service"
});

await layer.load();

// Find and use a specific sublayer
const sublayer = layer.findSublayerByName("OSM-WMS");
if (sublayer) {
  layer.sublayers = [sublayer];
}

map.add(layer);
```

### WMSLayer as Basemap (Map Component)
```html
<arcgis-scene>
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-scene>

<script type="module">
  import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
  const viewElement = document.querySelector("arcgis-scene");

  const layer = new WMSLayer({
    url: "https://ows.terrestris.de/osm/service"
  });

  await layer.load();
  const sublayer = layer.findSublayerByName("OSM-WMS");
  if (sublayer) {
    layer.sublayers = [sublayer];
  }

  viewElement.map = {
    basemap: {
      baseLayers: [layer],
      title: "WMS Layer"
    }
  };
</script>
```

## WFSLayer (Web Feature Service)

### Basic WFSLayer
```javascript
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";

const layer = new WFSLayer({
  url: "https://geobretagne.fr/geoserver/ows",
  name: "fma:bvme_zhp_vs_culture",
  copyright: "GéoBretagne"
});

map.add(layer);
```

### WFS Capabilities
```javascript
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";
import wfsUtils from "@arcgis/core/layers/ogc/wfsUtils.js";

// Get capabilities from WFS endpoint
const capabilities = await wfsUtils.getCapabilities("https://geobretagne.fr/geoserver/ows");

// List available feature types
capabilities.featureTypes.forEach(featureType => {
  console.log(featureType.title, featureType.name);
});

// Create layer from specific feature type
const layerInfo = await wfsUtils.getWFSLayerInfo(capabilities, "featureTypeName");
const layer = WFSLayer.fromWFSLayerInfo(layerInfo);
map.add(layer);
```

## WMTSLayer (Web Map Tile Service)

### Basic WMTSLayer
```javascript
import WMTSLayer from "@arcgis/core/layers/WMTSLayer.js";

const layer = new WMTSLayer({
  url: "https://www.ign.es/wmts/ign-base",
  activeLayer: {
    id: "IGNBase-gris",
    tileMatrixSetId: "GoogleMapsCompatible"
  },
  serviceMode: "KVP",
  copyright: "Instituto Geográfico Nacional"
});

map.add(layer);
```

### WMTSLayer as Basemap
```javascript
import Basemap from "@arcgis/core/Basemap.js";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer.js";

const wmtsBasemap = new Basemap({
  baseLayers: [
    new WMTSLayer({
      url: "https://www.ign.es/wmts/ign-base",
      activeLayer: { id: "IGNBase-gris", tileMatrixSetId: "GoogleMapsCompatible" },
      serviceMode: "KVP"
    })
  ],
  thumbnailUrl: "https://example.com/thumbnail.jpg"
});

const map = new Map({
  basemap: wmtsBasemap
});
```

## OGCFeatureLayer

### Basic OGCFeatureLayer
```javascript
import OGCFeatureLayer from "@arcgis/core/layers/OGCFeatureLayer.js";

const layer = new OGCFeatureLayer({
  url: "https://demo.ldproxy.net/vineyards",  // OGC API landing page
  collectionId: "vineyards",                   // Collection ID
  minScale: 5000000,
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [76, 129, 64, 0.6]
    }
  },
  popupTemplate: {
    title: "{name}",
    content: "Area: {area_ha} hectares"
  }
});

map.add(layer);
```

### OGCFeatureLayer with Labeling
```javascript
const layer = new OGCFeatureLayer({
  url: "https://demo.ldproxy.net/vineyards",
  collectionId: "vineyards",
  labelingInfo: [{
    labelExpressionInfo: {
      expression: "$feature.NAME"
    },
    symbol: {
      type: "text",
      color: "#4a6741",
      haloSize: 1,
      haloColor: "white",
      font: {
        family: "Arial",
        style: "italic"
      }
    },
    minScale: 100000
  }]
});
```

## MapImageLayer

### Basic MapImageLayer
```javascript
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";

// From portal item
const layer = new MapImageLayer({
  portalItem: {
    id: "d7892b3c13b44391992ecd42bfa92d01"
  }
});

// From URL
const layer2 = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
});

map.add(layer);
```

### MapImageLayer with Sublayers
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
  sublayers: [
    { id: 2, visible: true },   // States
    { id: 1, visible: true },   // Highways
    { id: 0, visible: true }    // Cities
  ]
});

// Toggle sublayer visibility
layer.when(() => {
  const sublayer = layer.findSublayerById(1);
  sublayer.visible = !sublayer.visible;
});
```

### MapImageLayer with Definition Expression
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
  sublayers: [{
    id: 0,
    definitionExpression: "pop2000 > 100000"
  }]
});
```

### MapImageLayer with Custom Renderer
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
  sublayers: [{
    id: 2,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 100, 200, 0.5],
        outline: { color: "white", width: 1 }
      }
    }
  }]
});
```

## Dynamic Data Layers

### Data Layer from Table
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
  sublayers: [{
    id: 4,
    title: "Railroads",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        color: [255, 255, 255, 0.5],
        width: 0.75,
        style: "long-dash-dot-dot"
      }
    },
    source: {
      type: "data-layer",
      dataSource: {
        type: "table",
        workspaceId: "MyDatabaseWorkspaceIDSSR2",
        dataSourceName: "ss6.gdb.Railroads"
      }
    }
  }]
});
```

### Data Layer with Table Join
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
  sublayers: [{
    id: 0,
    opacity: 0.75,
    source: {
      type: "data-layer",
      dataSource: {
        type: "join-table",
        // Left table: map layer with geometries
        leftTableSource: {
          type: "map-layer",
          mapLayerId: 3
        },
        // Right table: data table in workspace
        rightTableSource: {
          type: "data-layer",
          dataSource: {
            type: "table",
            workspaceId: "CensusFileGDBWorkspaceID",
            dataSourceName: "ancestry"
          }
        },
        leftTableKey: "STATE_NAME",
        rightTableKey: "State",
        joinType: "left-outer-join"
      }
    },
    renderer: {
      type: "class-breaks",
      field: "ancestry.Norwegian",
      normalizationField: "states.POP2007",
      classBreakInfos: [
        { minValue: 0, maxValue: 0.01, symbol: createSymbol("#f8e3c2") },
        { minValue: 0.01, maxValue: 0.05, symbol: createSymbol("#d86868") }
      ]
    }
  }]
});
```

## CatalogLayer

### Basic CatalogLayer
```javascript
import CatalogLayer from "@arcgis/core/layers/CatalogLayer.js";

const layer = new CatalogLayer({
  portalItem: {
    id: "487cc66d305145d3b67fed383456af48",
    portal: {
      url: "https://jsapi.maps.arcgis.com/"
    }
  }
});

map.add(layer);
```

### Working with CatalogLayer Footprints
```javascript
import CatalogLayer from "@arcgis/core/layers/CatalogLayer.js";
import catalogUtils from "@arcgis/core/layers/catalog/catalogUtils.js";

const layer = new CatalogLayer({
  portalItem: { id: "YOUR_CATALOG_ITEM_ID" }
});

map.add(layer);

const layerView = await view.whenLayerView(layer);

// Query all footprints
const result = await layer.queryFeatures({
  where: "1=1",
  returnGeometry: true,
  outFields: ["*"],
  orderByFields: [layer.itemNameField]
});

// Add labels to footprint layer
layer.footprintLayer.labelingInfo = [{
  labelExpressionInfo: {
    expression: "$feature." + layer.itemNameField
  },
  symbol: {
    type: "label-3d",
    symbolLayers: [{
      type: "text",
      material: { color: "white" },
      size: 10
    }]
  }
}];

// Highlight a footprint
const highlight = layerView.footprintLayerView.highlight(feature);

// Create layer from footprint
const footprint = layer.createFootprintFromLayer(selectedLayer);
const newLayer = await layer.createLayerFromFootprint(footprint);
map.add(newLayer);
```

### CatalogLayer with LayerList
```javascript
const layerList = document.querySelector("arcgis-layer-list");

layerList.catalogOptions = {
  selectionMode: "single"
};

layerList.listItemCreatedFunction = (event) => {
  if (catalogUtils.isLayerFromCatalog(event.item.layer)) {
    event.item.actionsSections = [[{
      title: "Add layer to map",
      icon: "add-layer",
      id: "add-layer"
    }]];
  }
};
```

## Layer Comparison

| Layer Type | Use Case | Data Source |
|------------|----------|-------------|
| WMSLayer | Raster imagery from OGC WMS | WMS 1.1.1/1.3.0 |
| WFSLayer | Vector features from OGC WFS | WFS 2.0.0 |
| WMTSLayer | Cached tiles from OGC WMTS | WMTS 1.0.0 |
| OGCFeatureLayer | Vector from OGC API - Features | OGC API |
| MapImageLayer | Server-rendered imagery | ArcGIS Map Service |
| CatalogLayer | Collection of layers | ArcGIS Catalog Service |

## Common Pitfalls

1. **WFS version**: WFSLayer requires WFS 2.0.0 with GeoJSON output format

2. **CORS**: OGC services need CORS headers or proxy configuration

3. **Sublayer IDs**: MapImageLayer sublayer IDs must match service layer IDs

4. **Dynamic data sources**: Require registered workspaces on the server

5. **CatalogLayer portal**: Must specify portal URL for non-ArcGIS Online items

6. **Field prefixes**: In joined tables, prefix field names with table name (e.g., `ancestry.Norwegian`)

