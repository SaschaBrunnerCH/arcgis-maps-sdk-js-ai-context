# Agent Guide: arcgis-layers

Quick-reference decisions, checklists, and tables for choosing and configuring layers.

## Layer Type Selection Flowchart

Start here with your data source:

1. **Is it an ArcGIS service URL?**
   - Feature Service (`/FeatureServer/N`) --> `FeatureLayer`
   - Map Service (`/MapServer`) with cached tiles --> `TileLayer`
   - Map Service (`/MapServer`) with dynamic rendering --> `MapImageLayer` (see `arcgis-advanced-layers`)
   - Scene Service (`/SceneServer`) --> `SceneLayer`
   - Image Service (`/ImageServer`) --> `ImageryTileLayer`
   - Stream Service (WebSocket) --> `StreamLayer`
   - Vector Tile Service (`/VectorTileServer`) --> `VectorTileLayer`

2. **Is it a file or URL to raw data?**
   - `.geojson` / GeoJSON URL --> `GeoJSONLayer`
   - `.csv` with lat/lon columns --> `CSVLayer`
   - `.parquet` --> `ParquetLayer`
   - `.kml` / `.kmz` --> `KMLLayer` (see `arcgis-advanced-layers`)
   - GeoRSS feed --> `GeoRSSLayer`

3. **Is it an OGC service?**
   - WMS --> `WMSLayer` (see `arcgis-advanced-layers`)
   - WFS --> `WFSLayer` (see `arcgis-advanced-layers`)
   - OGC Feature API --> `OGCFeatureLayer` (see `arcgis-advanced-layers`)

4. **Is it client-side data (in-memory)?**
   - Temporary graphics, no queries needed --> `GraphicsLayer`
   - Need queries, filters, renderers on client data --> `FeatureLayer` with `source` array

5. **Is it a third-party tile service?**
   - XYZ/TMS tiles --> `WebTileLayer`

## Query Method Reference

| Method | Returns | Use When |
|--------|---------|----------|
| `queryFeatures(query)` | `FeatureSet` (graphics with geometry + attributes) | You need the actual feature data |
| `queryObjectIds(query)` | `number[]` (OIDs only) | You only need IDs for highlighting or further queries |
| `queryFeatureCount(query)` | `number` | You need a count without fetching data |
| `queryExtent(query)` | `{ count, extent }` | You want to zoom to matching features |
| `queryRelatedFeatures(params)` | Related feature sets keyed by OID | You need related table records |

**Server vs Client-side queries:**

| Aspect | `featureLayer.queryFeatures()` | `layerView.queryFeatures()` |
|--------|-------------------------------|----------------------------|
| Runs on | Server | Client (browser) |
| Data scope | All features in service | Only features currently in view/cache |
| Network cost | HTTP request per call | No network (already loaded) |
| Use when | Need full dataset, pagination, stats | Need fast filtering of visible features |

## FeatureLayer Config Checklist

- [ ] Set `url` or `portalItem.id` or `source` (client-side)
- [ ] Set `outFields: ["*"]` (or list specific fields) to access attributes
- [ ] Add `popupTemplate` for click interaction
- [ ] Add `renderer` for custom symbology (or rely on service defaults)
- [ ] Set `definitionExpression` if you need a server-side SQL filter
- [ ] Set `minScale` / `maxScale` if the layer should only appear at certain zoom levels
- [ ] Set `visible: false` if the layer should start hidden
- [ ] For client-side layers: provide `fields`, `objectIdField`, `geometryType`, `spatialReference`
- [ ] Await `layer.load()` before accessing metadata (`fields`, `fullExtent`)
- [ ] For TypeScript: use `as const` on renderer/symbol objects for type safety

## Common Query Patterns

### Filter then display
```
definitionExpression --> server filters before sending data
```

### Query then process
```
queryFeatures() --> iterate result.features
```

### Highlight from query
```
queryObjectIds() --> layerView.highlight(oids)
```

### Zoom to results
```
queryExtent() --> view.goTo(result.extent)
```
