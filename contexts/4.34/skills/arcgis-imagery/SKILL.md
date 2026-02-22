---
name: arcgis-imagery
description: Work with raster and imagery data including ImageryLayer, ImageryTileLayer, multidimensional data, pixel filtering, and raster analysis. Use for satellite imagery, elevation data, and scientific raster datasets.
---

# ArcGIS Imagery

Use this skill for working with raster imagery, pixel-level operations, and multidimensional data.

## ImageryLayer

### Basic ImageryLayer
```javascript
import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";

const imageryLayer = new ImageryLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ScientificData/SeaTemperature/ImageServer"
});

map.add(imageryLayer);
```

### ImageryLayer with Popup
```javascript
const imageryLayer = new ImageryLayer({
  url: "...",
  popupTemplate: {
    title: "Raster Value",
    content: "{Raster.ServicePixelValue}"
  }
});
```

## ImageryTileLayer

### Basic ImageryTileLayer
```javascript
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer.js";

const imageryTileLayer = new ImageryTileLayer({
  url: "https://tiledimageservices.arcgis.com/..."
});

map.add(imageryTileLayer);
```

### Cloud Optimized GeoTIFF (COG)
```javascript
const imageryTileLayer = new ImageryTileLayer({
  url: "https://example.com/image.tif",
  title: "COG Layer"
});
```

## Multidimensional Data

### DimensionalDefinition
```javascript
import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";
import DimensionalDefinition from "@arcgis/core/layers/support/DimensionalDefinition.js";
import MosaicRule from "@arcgis/core/layers/support/MosaicRule.js";

// Define dimensions (depth, time, etc.)
const dimInfo = [];

// Depth dimension
dimInfo.push(new DimensionalDefinition({
  dimensionName: "StdZ",
  values: [0], // Surface level
  isSlice: true
}));

// Time dimension
dimInfo.push(new DimensionalDefinition({
  dimensionName: "StdTime",
  values: [1396828800000], // Timestamp in milliseconds
  isSlice: true
}));

const mosaicRule = new MosaicRule({
  multidimensionalDefinition: dimInfo
});

const layer = new ImageryLayer({
  url: "...",
  mosaicRule: mosaicRule
});
```

### Accessing Multidimensional Info
```javascript
await imageryLayer.load();

// Get available dimensions
const dimensions = imageryLayer.multidimensionalInfo.dimensions;

dimensions.forEach(dim => {
  console.log("Dimension:", dim.name);
  console.log("Values:", dim.values);
  console.log("Unit:", dim.unit);
});
```

## Pixel Filtering

### Custom Pixel Filter
```javascript
const imageryLayer = new ImageryLayer({
  url: "...",
  pixelFilter: processPixels
});

function processPixels(pixelData) {
  if (!pixelData || !pixelData.pixelBlock) return;

  const pixelBlock = pixelData.pixelBlock;
  const pixels = pixelBlock.pixels;
  let mask = pixelBlock.mask;
  const numPixels = pixelBlock.width * pixelBlock.height;

  // Get statistics
  const minVal = pixelBlock.statistics[0].minValue;
  const maxVal = pixelBlock.statistics[0].maxValue;
  const factor = 255 / (maxVal - minVal);

  // Original single-band data
  const band = pixels[0];

  // Create RGB bands
  const rBand = new Uint8Array(numPixels);
  const gBand = new Uint8Array(numPixels);
  const bBand = new Uint8Array(numPixels);

  if (!mask) {
    mask = new Uint8Array(numPixels);
    mask.fill(1);
    pixelBlock.mask = mask;
  }

  // Process each pixel
  for (let i = 0; i < numPixels; i++) {
    if (mask[i] === 0) continue;

    const value = band[i];
    const normalized = (value - minVal) * factor;

    // Create color ramp (blue to red)
    rBand[i] = normalized;
    gBand[i] = 0;
    bBand[i] = 255 - normalized;
  }

  // Update pixel block
  pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
  pixelData.pixelBlock.statistics = null;
  pixelData.pixelBlock.pixelType = "u8";
}
```

### Masking Pixels by Value
```javascript
let minThreshold = 0;
let maxThreshold = 100;

function maskPixels(pixelData) {
  if (!pixelData || !pixelData.pixelBlock) return;

  const pixelBlock = pixelData.pixelBlock;
  const pixels = pixelBlock.pixels[0];
  let mask = pixelBlock.mask;

  if (!mask) {
    mask = new Uint8Array(pixels.length);
    mask.fill(1);
    pixelBlock.mask = mask;
  }

  for (let i = 0; i < pixels.length; i++) {
    // Hide pixels outside threshold range
    mask[i] = (pixels[i] >= minThreshold && pixels[i] <= maxThreshold) ? 1 : 0;
  }
}

// Update thresholds and redraw
function updateThresholds(min, max) {
  minThreshold = min;
  maxThreshold = max;
  imageryLayer.redraw();
}
```

## Rendering Rules

### Apply Rendering Rule
```javascript
import RasterFunction from "@arcgis/core/layers/support/RasterFunction.js";

// Hillshade rendering
const hillshadeFunction = new RasterFunction({
  functionName: "Hillshade",
  functionArguments: {
    azimuth: 315,
    altitude: 45,
    zFactor: 1
  }
});

imageryLayer.rasterFunction = hillshadeFunction;
```

### Common Rendering Rules
```javascript
// Stretch
const stretchFunction = new RasterFunction({
  functionName: "Stretch",
  functionArguments: {
    stretchType: 3, // Standard Deviation
    numberOfStandardDeviations: 2
  }
});

// Colormap
const colormapFunction = new RasterFunction({
  functionName: "Colormap",
  functionArguments: {
    colormap: [[1, 255, 0, 0], [2, 0, 255, 0], [3, 0, 0, 255]]
  }
});

// NDVI
const ndviFunction = new RasterFunction({
  functionName: "NDVI",
  functionArguments: {
    visibleBandID: 3,
    infraredBandID: 4
  }
});
```

## Band Combinations

```javascript
// Select specific bands
imageryLayer.bandIds = [4, 3, 2]; // NIR, Red, Green (False color)

// Common band combinations
// Natural color: [1, 2, 3] (R, G, B)
// False color: [4, 3, 2] (NIR, R, G)
// SWIR: [7, 5, 4] (SWIR, NIR, R)
```

## Identify (Query Pixel Values)

```javascript
view.on("click", async (event) => {
  const result = await imageryLayer.identify({
    geometry: event.mapPoint,
    returnGeometry: false,
    returnCatalogItems: true
  });

  console.log("Pixel value:", result.value);
  console.log("Catalog items:", result.catalogItems);
});
```

## Export Image

```javascript
// Export visible extent as image
const imageParams = {
  bbox: view.extent,
  width: view.width,
  height: view.height,
  format: "png",
  f: "image"
};

const imageUrl = imageryLayer.url + "/exportImage?" +
  Object.entries(imageParams).map(([k, v]) => `${k}=${v}`).join("&");
```

## Raster Statistics

```javascript
await imageryLayer.load();

// Get layer statistics from serviceRasterInfo
const stats = imageryLayer.serviceRasterInfo.statistics;
console.log("Min:", stats[0].min);
console.log("Max:", stats[0].max);
console.log("Mean:", stats[0].avg);
console.log("StdDev:", stats[0].stddev);
```

### Imagery Components

| Component | Purpose |
|-----------|---------|
| `arcgis-oriented-imagery-viewer` | View and navigate oriented imagery |
| `arcgis-video-player` | Play video feeds from video services |

## Reference Samples

- `layers-imagerylayer` - Basic ImageryLayer usage
- `layers-imagery-pixelvalues` - Querying pixel values from imagery
- `layers-imagery-multidimensional` - Multidimensional imagery data
- `layers-imagerytilelayer` - ImageryTileLayer usage
- `layers-imagerytilelayer-cog` - Cloud-Optimized GeoTIFF with ImageryTileLayer

## Common Pitfalls

1. **Pixel filter performance**: Complex pixel filters can slow rendering - optimize loops

2. **Band array indices**: Band IDs are often 1-based in services but 0-based in arrays

3. **Coordinate systems**: Imagery may need reprojection to match the view

4. **Memory with large images**: Use tiled imagery layers for large datasets

5. **Pixel type conversion**: Be careful when changing pixelType in pixel filters

