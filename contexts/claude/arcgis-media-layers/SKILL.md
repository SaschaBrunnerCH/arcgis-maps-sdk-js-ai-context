---
name: arcgis-media-layers
description: Overlay images, videos, and animated GIFs on maps using MediaLayer. Use for historical imagery, plan overlays, and georeferenced media content.
---

# ArcGIS Media Layers

Use this skill for overlaying images, videos, and animated content on maps.

## MediaLayer Basics

### Create MediaLayer with Images
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

### Multiple Images
```javascript
const imageInfos = [
  {
    url: "image1.png",
    extent: { xmin: -100, ymin: 30, xmax: -90, ymax: 40 }
  },
  {
    url: "image2.png",
    extent: { xmin: -95, ymin: 35, xmax: -85, ymax: 45 }
  }
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
  source: imageElements
});
```

## Georeferencing Methods

### Extent and Rotation
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

### Control Points (Corners)
```javascript
import ControlPointsGeoreference from "@arcgis/core/layers/support/ControlPointsGeoreference.js";

const georeference = new ControlPointsGeoreference({
  controlPoints: [
    {
      sourcePoint: { x: 0, y: 0 },           // Top-left of image (pixels)
      mapPoint: { x: -122.5, y: 38.0 }       // Map coordinates
    },
    {
      sourcePoint: { x: 1000, y: 0 },        // Top-right
      mapPoint: { x: -122.0, y: 38.0 }
    },
    {
      sourcePoint: { x: 1000, y: 800 },      // Bottom-right
      mapPoint: { x: -122.0, y: 37.5 }
    },
    {
      sourcePoint: { x: 0, y: 800 },         // Bottom-left
      mapPoint: { x: -122.5, y: 37.5 }
    }
  ],
  width: 1000,  // Image width in pixels
  height: 800   // Image height in pixels
});
```

## Video Elements

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
videoElement.content.currentTime = 30; // Seek to 30 seconds
```

## Animated GIF

```javascript
// Animated GIFs work like regular images
const gifElement = new ImageElement({
  image: "https://example.com/weather-animation.gif",
  georeference: new ExtentAndRotationGeoreference({
    extent: new Extent({
      xmin: -130,
      ymin: 25,
      xmax: -65,
      ymax: 50,
      spatialReference: { wkid: 4326 }
    })
  })
});

const mediaLayer = new MediaLayer({
  source: [gifElement]
});
```

## Layer Configuration

### Opacity and Blend Mode
```javascript
const mediaLayer = new MediaLayer({
  source: [imageElement],
  opacity: 0.7,
  blendMode: "multiply" // normal, multiply, luminosity, etc.
});

// Change opacity dynamically
mediaLayer.opacity = 0.5;

// Change blend mode
mediaLayer.blendMode = "luminosity";
```

### Element Opacity
```javascript
// Individual element opacity
imageElement.opacity = 0.8;

// Update dynamically
document.getElementById("opacitySlider").addEventListener("input", (e) => {
  imageElement.opacity = e.target.value / 100;
});
```

## Managing Source Elements

```javascript
// Access source
const source = mediaLayer.source;

// Add elements
source.elements.add(newImageElement);
source.elements.addMany([element1, element2]);

// Remove elements
source.elements.remove(imageElement);
source.elements.removeAll();

// Get all elements
source.elements.forEach(element => {
  console.log(element.image || element.video);
});
```

## Interactive Control Points

```javascript
// Enable editing of georeference control points
const mediaLayerView = await view.whenLayerView(mediaLayer);

// Start editing
mediaLayerView.startEditing(imageElement);

// Stop editing
mediaLayerView.stopEditing();

// Listen for georeference changes
imageElement.watch("georeference", (newGeoreference) => {
  console.log("Georeference updated:", newGeoreference);
});
```

## Complete Example

```html
<arcgis-map center="-89.93, 29.97" zoom="10">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>

<script type="module">
  import MediaLayer from "@arcgis/core/layers/MediaLayer.js";
  import ImageElement from "@arcgis/core/layers/support/ImageElement.js";
  import ExtentAndRotationGeoreference from "@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";
  import Extent from "@arcgis/core/geometry/Extent.js";
  import Map from "@arcgis/core/Map.js";

  const viewElement = document.querySelector("arcgis-map");

  // Create image elements for historical maps
  const imageElements = [
    {
      name: "1891 Map",
      url: "https://example.com/map-1891.png",
      extent: { xmin: -10047456, ymin: 3486722, xmax: -10006982, ymax: 3514468 }
    },
    {
      name: "1920 Map",
      url: "https://example.com/map-1920.png",
      extent: { xmin: -10045000, ymin: 3488000, xmax: -10008000, ymax: 3516000 }
    }
  ].map(info => new ImageElement({
    image: info.url,
    georeference: new ExtentAndRotationGeoreference({
      extent: new Extent({
        ...info.extent,
        spatialReference: { wkid: 102100 }
      })
    })
  }));

  const mediaLayer = new MediaLayer({
    source: imageElements,
    title: "Historical Maps",
    blendMode: "normal"
  });

  viewElement.map = new Map({
    basemap: "topo-vector",
    layers: [mediaLayer]
  });
</script>
```

## Common Pitfalls

1. **Coordinate systems**: Ensure extent coordinates match the spatial reference

2. **Image loading**: Large images may take time to load - consider using smaller/optimized images

3. **Control point order**: Control points must be in correct order (top-left, top-right, bottom-right, bottom-left)

4. **CORS**: Images from external servers need CORS headers

5. **Video autoplay**: Browsers may block autoplay - require user interaction first

