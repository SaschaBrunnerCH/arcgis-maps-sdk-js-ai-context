---
name: arcgis-advanced-layers
description: Work with advanced layer types including WMS, WFS, WMTS, OGCFeatureLayer, KMLLayer, MapImageLayer, CatalogLayer, and MediaLayer. Use for OGC services, server-side rendering, and georeferenced media content.
---

# ArcGIS Advanced Layers

Use this skill for working with OGC services (WMS, WFS, WMTS, OGC API Features), KML/KMZ files, MapImageLayer, CatalogLayer, MediaLayer, and dynamic data layers.

> **Related skills:** See `arcgis-layers` for common layer types (FeatureLayer, GraphicsLayer, GeoJSONLayer, etc.).

## Import Patterns

### Direct ESM Imports
```javascript
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer.js";
import OGCFeatureLayer from "@arcgis/core/layers/OGCFeatureLayer.js";
import KMLLayer from "@arcgis/core/layers/KMLLayer.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import CatalogLayer from "@arcgis/core/layers/CatalogLayer.js";
import MediaLayer from "@arcgis/core/layers/MediaLayer.js";
```

### Dynamic Imports (CDN)
```javascript
const WMSLayer = await $arcgis.import("@arcgis/core/layers/WMSLayer.js");
const [WFSLayer, wfsUtils] = await $arcgis.import([
  "@arcgis/core/layers/WFSLayer.js",
  "@arcgis/core/layers/ogc/wfsUtils.js"
]);
const MapImageLayer = await $arcgis.import("@arcgis/core/layers/MapImageLayer.js");
```

## Layer Type Comparison

| Layer Type | Use Case | Data Source |
|------------|----------|-------------|
| WMSLayer | Raster imagery from OGC WMS | WMS 1.1.1 / 1.3.0 |
| WFSLayer | Vector features from OGC WFS | WFS 2.0.0 |
| WMTSLayer | Cached tiles from OGC WMTS | WMTS 1.0.0 |
| OGCFeatureLayer | Vector from OGC API - Features | OGC API |
| KMLLayer | KML/KMZ geographic data | KML files |
| MapImageLayer | Server-rendered imagery | ArcGIS MapServer |
| CatalogLayer | Collection of layers | ArcGIS Catalog Service |
| MediaLayer | Georeferenced images, video, GIFs | Local/remote media |

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
      title: "WMS Basemap"
    }
  };
</script>
```

### WMSLayer with Custom Parameters
```javascript
const layer = new WMSLayer({
  url: "https://example.com/wms",
  sublayers: [{
    name: "LayerName",
    visible: true
  }],
  customParameters: {
    TRANSPARENT: "TRUE",
    FORMAT: "image/png"
  },
  imageFormat: "png",
  version: "1.3.0"
});
```

## WFSLayer (Web Feature Service)

### Basic WFSLayer
```javascript
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";

const layer = new WFSLayer({
  url: "https://geobretagne.fr/geoserver/ows",
  name: "fma:bvme_zhp_vs_culture",
  copyright: "GeoBretagne"
});

map.add(layer);
```

### WFS Capabilities Discovery
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

### WFSLayer with Renderer
```javascript
const layer = new WFSLayer({
  url: "https://geobretagne.fr/geoserver/ows",
  name: "fma:bvme_zhp_vs_culture",
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [76, 129, 64, 0.6],
      outline: { color: "white", width: 1 }
    }
  },
  popupTemplate: {
    title: "{nom}",
    content: "Type: {type_cultu}"
  }
});
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
  copyright: "Instituto Geografico Nacional"
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
      activeLayer: {
        id: "IGNBase-gris",
        tileMatrixSetId: "GoogleMapsCompatible"
      },
      serviceMode: "KVP"
    })
  ]
});

const map = new Map({ basemap: wmtsBasemap });
```

## OGCFeatureLayer (OGC API - Features)

### Basic OGCFeatureLayer
```javascript
import OGCFeatureLayer from "@arcgis/core/layers/OGCFeatureLayer.js";

const layer = new OGCFeatureLayer({
  url: "https://demo.ldproxy.net/vineyards",
  collectionId: "vineyards",
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

## KMLLayer

### Basic KMLLayer
```javascript
import KMLLayer from "@arcgis/core/layers/KMLLayer.js";

const layer = new KMLLayer({
  url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month_age_animated.kml"
});

map.add(layer);
```

### KMLLayer with Sublayers
```javascript
const layer = new KMLLayer({
  url: "https://example.com/data.kml"
});

await layer.load();

// Access KML sublayers
layer.sublayers.forEach(sublayer => {
  console.log(sublayer.title, sublayer.visible);
});

// Toggle sublayer visibility
const sublayer = layer.sublayers.getItemAt(0);
sublayer.visible = false;
```

### KMLLayer from Local File
```javascript
const layer = new KMLLayer({
  url: "/data/places.kml",
  title: "Places of Interest"
});

map.add(layer);
```

## MapImageLayer

### Basic MapImageLayer
```javascript
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";

// From URL
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
});

// From portal item
const portalLayer = new MapImageLayer({
  portalItem: {
    id: "d7892b3c13b44391992ecd42bfa92d01"
  }
});

map.add(layer);
```

### MapImageLayer with Sublayers
```javascript
const layer = new MapImageLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
  sublayers: [
    { id: 2, visible: true },
    { id: 1, visible: true },
    { id: 0, visible: true }
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
        leftTableSource: {
          type: "map-layer",
          mapLayerId: 3
        },
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
        { minValue: 0, maxValue: 0.01, symbol: { type: "simple-fill", color: "#f8e3c2" } },
        { minValue: 0.01, maxValue: 0.05, symbol: { type: "simple-fill", color: "#d86868" } }
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
    type: "text",
    color: "white",
    font: { size: 10 }
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
```html
<arcgis-map id="mapView">
  <arcgis-layer-list slot="top-right"></arcgis-layer-list>
</arcgis-map>

<script type="module">
  import CatalogLayer from "@arcgis/core/layers/CatalogLayer.js";
  import catalogUtils from "@arcgis/core/layers/catalog/catalogUtils.js";

  const viewElement = document.querySelector("arcgis-map");
  const layerList = document.querySelector("arcgis-layer-list");

  const catalogLayer = new CatalogLayer({
    portalItem: { id: "YOUR_CATALOG_ITEM_ID" }
  });

  viewElement.map.add(catalogLayer);

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
</script>
```

## MediaLayer

### MediaLayer with Images
```javascript
import MediaLayer from "@arcgis/core/layers/MediaLayer.js";
import ImageElement from "@arcgis/core/layers/support/ImageElement.js";
import ExtentAndRotationGeoreference from "@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";
import Extent from "@arcgis/core/geometry/Extent.js";

const imageElement = new ImageElement({
  image: "https://example.com/historical-map.png",
  georeference: new ExtentAndRotationGeoreference({
    extent: new Extent({
      xmin: -10047456,
      ymin: 3486722,
      xmax: -10006982,
      ymax: 3514468,
      spatialReference: { wkid: 102100 }
    })
  })
});

const mediaLayer = new MediaLayer({
  source: [imageElement],
  title: "Historical Map"
});

map.add(mediaLayer);
```

### MediaLayer with Multiple Images
```javascript
const imageInfos = [
  { url: "image1.png", extent: { xmin: -100, ymin: 30, xmax: -90, ymax: 40 } },
  { url: "image2.png", extent: { xmin: -95, ymin: 35, xmax: -85, ymax: 45 } }
];

const imageElements = imageInfos.map(info => new ImageElement({
  image: info.url,
  georeference: new ExtentAndRotationGeoreference({
    extent: new Extent({
      ...info.extent,
      spatialReference: { wkid: 4326 }
    })
  })
}));

const mediaLayer = new MediaLayer({
  source: imageElements,
  title: "Image Collection"
});
```

### Georeferencing with Rotation
```javascript
const georeference = new ExtentAndRotationGeoreference({
  extent: new Extent({
    xmin: -122.5,
    ymin: 37.5,
    xmax: -122.0,
    ymax: 38.0,
    spatialReference: { wkid: 4326 }
  }),
  rotation: 15 // Degrees clockwise
});
```

### Georeferencing with Control Points
```javascript
import ControlPointsGeoreference from "@arcgis/core/layers/support/ControlPointsGeoreference.js";

const georeference = new ControlPointsGeoreference({
  controlPoints: [
    {
      sourcePoint: { x: 0, y: 0 },         // Top-left of image (pixels)
      mapPoint: { x: -122.5, y: 38.0 }     // Map coordinates
    },
    {
      sourcePoint: { x: 1000, y: 0 },      // Top-right
      mapPoint: { x: -122.0, y: 38.0 }
    },
    {
      sourcePoint: { x: 1000, y: 800 },    // Bottom-right
      mapPoint: { x: -122.0, y: 37.5 }
    },
    {
      sourcePoint: { x: 0, y: 800 },       // Bottom-left
      mapPoint: { x: -122.5, y: 37.5 }
    }
  ],
  width: 1000,
  height: 800
});
```

### MediaLayer with Video
```javascript
import VideoElement from "@arcgis/core/layers/support/VideoElement.js";

const videoElement = new VideoElement({
  video: "https://example.com/timelapse.mp4",
  georeference: new ExtentAndRotationGeoreference({
    extent: new Extent({
      xmin: -122.5,
      ymin: 37.5,
      xmax: -122.0,
      ymax: 38.0,
      spatialReference: { wkid: 4326 }
    })
  })
});

const mediaLayer = new MediaLayer({
  source: [videoElement]
});

// Control video playback
videoElement.content.play();
videoElement.content.pause();
videoElement.content.currentTime = 30;
```

### MediaLayer with Opacity and Blend Mode
```javascript
const mediaLayer = new MediaLayer({
  source: [imageElement],
  opacity: 0.7,
  blendMode: "multiply" // normal, multiply, luminosity, etc.
});

// Change dynamically
mediaLayer.opacity = 0.5;
mediaLayer.blendMode = "luminosity";

// Individual element opacity
imageElement.opacity = 0.8;
```

### Interactive Control Points
```javascript
// Enable interactive editing of georeference control points
const mediaLayerView = await view.whenLayerView(mediaLayer);
mediaLayerView.interactive = true;

// Disable when done
mediaLayerView.interactive = false;
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://js.arcgis.com/calcite-components/3.3.3/calcite.esm.js"></script>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <calcite-shell>
    <calcite-navigation slot="header">
      <calcite-navigation-logo slot="logo" heading="Advanced Layers"></calcite-navigation-logo>
    </calcite-navigation>

    <calcite-shell-panel slot="panel-start">
      <calcite-panel heading="Layers">
        <arcgis-layer-list reference-element="mapView"></arcgis-layer-list>
      </calcite-panel>
    </calcite-shell-panel>

    <arcgis-map id="mapView" center="-89.93, 29.97" zoom="10">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-legend slot="bottom-left"></arcgis-legend>
    </arcgis-map>
  </calcite-shell>

  <script type="module">
    import Map from "@arcgis/core/Map.js";
    import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
    import MediaLayer from "@arcgis/core/layers/MediaLayer.js";
    import ImageElement from "@arcgis/core/layers/support/ImageElement.js";
    import ExtentAndRotationGeoreference from "@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";
    import Extent from "@arcgis/core/geometry/Extent.js";

    const viewElement = document.querySelector("arcgis-map");
    await viewElement.viewOnReady();

    // Add a WMS layer
    const wmsLayer = new WMSLayer({
      url: "https://ows.terrestris.de/osm/service",
      title: "OpenStreetMap WMS"
    });

    // Add a media layer for a historical map overlay
    const imageElement = new ImageElement({
      image: "https://example.com/historical-map.png",
      georeference: new ExtentAndRotationGeoreference({
        extent: new Extent({
          xmin: -10047456,
          ymin: 3486722,
          xmax: -10006982,
          ymax: 3514468,
          spatialReference: { wkid: 102100 }
        })
      })
    });

    const mediaLayer = new MediaLayer({
      source: [imageElement],
      title: "Historical Map",
      opacity: 0.7
    });

    viewElement.map.addMany([wmsLayer, mediaLayer]);
  </script>
</body>
</html>
```

## Reference Samples

- `layers-wms` - Adding and configuring WMS layers
- `layers-wfs` - Working with WFS layers
- `layers-ogcfeaturelayer` - OGC Features API layer usage
- `layers-mapimagelayer` - Dynamic MapImageLayer configuration
- `layers-mapimagelayer-dynamic-data` - Dynamic data layers with joins
- `layers-kml` - Loading KML/KMZ files
- `layers-cataloglayer` - Using CatalogLayer to browse portal content
- `layers-medialayer-images` - Displaying images with MediaLayer
- `layers-medialayer-video` - Video playback in MediaLayer
- `layers-medialayer-control-points` - Control point placement for media

## Common Pitfalls

1. **WFS version requirement**: WFSLayer requires WFS 2.0.0 with GeoJSON output format. Older WFS versions or services without GeoJSON support will fail.

2. **CORS on OGC services**: External OGC services (WMS, WFS, WMTS) need CORS headers enabled or a proxy configuration. Without CORS, the browser blocks cross-origin requests silently.

3. **MapImageLayer sublayer IDs**: Sublayer `id` values must exactly match the service layer IDs. Using incorrect IDs results in empty or missing sublayers.

4. **Dynamic data sources require registered workspaces**: Data layer sources (`source.type: "data-layer"`) only work with workspace IDs registered on the ArcGIS Server. The workspace must be preconfigured by the server administrator.

5. **CatalogLayer portal URL**: For non-ArcGIS Online items, you must specify the `portal.url` in the `portalItem` configuration. Omitting it defaults to ArcGIS Online.

6. **Field name prefixes in joined tables**: When using table joins in MapImageLayer, field names must be prefixed with the table name (e.g., `ancestry.Norwegian`, `states.POP2007`).

7. **Media CORS**: Images and videos loaded in MediaLayer from external servers require CORS headers. Without them, the image loads but cannot be rendered on the map canvas.

8. **Video autoplay restrictions**: Browsers may block autoplay of video elements in MediaLayer. Require user interaction (e.g., a button click) before calling `videoElement.content.play()`.

9. **KMLLayer network links**: KML files with network links make additional HTTP requests. Ensure all linked URLs are accessible and CORS-enabled.

10. **WMSLayer sublayer selection**: After loading a WMSLayer, all sublayers are visible by default. Explicitly set `layer.sublayers` to only the sublayers you need, or performance may suffer with services that have many layers.

## Related Skills

- See `arcgis-layers` for common layer types (FeatureLayer, GraphicsLayer, GeoJSONLayer, etc.)
- See `arcgis-imagery` for imagery-specific layers (ImageryLayer, ImageryTileLayer)
- See `arcgis-visualization` for renderer and symbol configuration
- See `arcgis-3d-layers` for 3D-specific layer types (SceneLayer, IntegratedMeshLayer)
