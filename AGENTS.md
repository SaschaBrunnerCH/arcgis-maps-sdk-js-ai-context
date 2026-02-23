# ArcGIS Maps SDK for JavaScript -- Skill Catalog

This file indexes all 31 skills for the ArcGIS Maps SDK for JavaScript (v4.34). Use it to find the right skill for a task, combine skills for complex workflows, and make quick architectural decisions.

## Skills by Category

### Core
| Skill | Purpose |
|-------|---------|
| `arcgis-core-maps` | Map/SceneView initialization, navigation, basemaps, Map Components vs Core API |
| `arcgis-starter-app` | Project scaffolding with Vite + TypeScript, production tooling, framework integration |
| `arcgis-core-utilities` | reactiveUtils, promiseUtils, esriRequest, Collection, Accessor |
| `arcgis-performance` | Bundle optimization, lazy loading, memory management, view performance tuning |

### Layers & Data
| Skill | Purpose |
|-------|---------|
| `arcgis-layers` | FeatureLayer, GeoJSONLayer, CSVLayer, GraphicsLayer, TileLayer, queries |
| `arcgis-advanced-layers` | WMS, WFS, KML, MapImageLayer, CatalogLayer, OGC layers |
| `arcgis-3d-layers` | SceneLayer, IntegratedMeshLayer, PointCloudLayer, 3D-specific layer config |
| `arcgis-tables-forms` | FeatureTable, FeatureForm, related records, tabular data workflows |

### Visualization
| Skill | Purpose |
|-------|---------|
| `arcgis-visualization` | Renderers, symbols, visual variables, labels |
| `arcgis-cim-symbols` | CIM symbol specification for advanced multi-layer symbology |
| `arcgis-smart-mapping` | Data-driven renderer/color/size generators, statistics, suggested scales |
| `arcgis-feature-effects` | Layer effects (bloom, blur, drop-shadow), blend modes, feature filters |

### Interaction
| Skill | Purpose |
|-------|---------|
| `arcgis-interaction` | Hit testing, highlighting, sketching, event handling, Draw API |
| `arcgis-popup-templates` | PopupTemplate content, Arcade expressions, custom actions, field formatting |
| `arcgis-editing` | Editor widget, FeatureForm, subtypes, versioning, applyEdits |

### Widgets & UI
| Skill | Purpose |
|-------|---------|
| `arcgis-widgets-ui` | Legend, LayerList, Search, FeatureTable, TimeSlider, Calcite layout |
| `arcgis-widgets-advanced` | Measurement, ElevationProfile, LineOfSight, Print, Swipe, Directions |

### Spatial
| Skill | Purpose |
|-------|---------|
| `arcgis-geometry-operations` | geometryEngine, buffer, intersect, union, clip, geodesic operations |
| `arcgis-spatial-analysis` | Server-side geoprocessing, spatial analysis service, ModelBuilder |
| `arcgis-coordinates-projection` | Coordinate systems, projection, spatial references, coordinate conversion |

### Services
| Skill | Purpose |
|-------|---------|
| `arcgis-rest-services` | REST API endpoints, feature service queries, geocoding, routing |
| `arcgis-portal-content` | Portal items, WebMap/WebScene loading, content management, sharing |
| `arcgis-authentication` | OAuth 2.0, API keys, IdentityManager, token management |

### Specialized
| Skill | Purpose |
|-------|---------|
| `arcgis-map-tools` | Bookmarks, measurement, printing, coordinate conversion widget |
| `arcgis-arcade` | Arcade expressions for popups, labels, renderers, calculated fields |
| `arcgis-imagery` | ImageryLayer, ImageryTileLayer, raster functions, multidimensional data |
| `arcgis-time-animation` | TimeSlider, temporal data, animation, time-aware layers |
| `arcgis-scene-environment` | Lighting, weather, atmosphere, shadows, underground navigation |
| `arcgis-utility-networks` | Utility network tracing, associations, topology validation |
| `arcgis-knowledge-graphs` | Knowledge graph exploration, link charts, entity relationships |
| `arcgis-custom-rendering` | Custom WebGL rendering, external renderers, RenderNode |

## Recommended Skill Combinations

### Build a basic map app
`arcgis-starter-app` + `arcgis-core-maps` + `arcgis-layers`

### Create a data visualization dashboard
`arcgis-visualization` + `arcgis-widgets-ui` + `arcgis-layers` + `arcgis-smart-mapping`

### Build an editing application
`arcgis-editing` + `arcgis-interaction` + `arcgis-layers` + `arcgis-tables-forms`

### 3D scene application
`arcgis-core-maps` + `arcgis-3d-layers` + `arcgis-scene-environment`

### Spatial analysis workflow
`arcgis-geometry-operations` + `arcgis-spatial-analysis` + `arcgis-layers`

### Portal content browser
`arcgis-portal-content` + `arcgis-authentication` + `arcgis-widgets-ui`

### Real-time monitoring app
`arcgis-layers` + `arcgis-time-animation` + `arcgis-widgets-ui` + `arcgis-interaction`

### Field data collection app
`arcgis-editing` + `arcgis-authentication` + `arcgis-starter-app` + `arcgis-interaction`

## Quick Decision Guides

### Map Components vs Core API

| Question | Map Components | Core API |
|----------|---------------|----------|
| Starting a new project? | Preferred | Only if you need low-level control |
| Need slot-based widget placement? | Yes, built-in | No, use `view.ui.add()` |
| Using a framework (React/Angular)? | Works as custom elements | Works, but more boilerplate |
| Need programmatic map creation? | Possible via JS properties | Native approach |
| CSS setup? | Automatic (npm) | Requires `main.css` import |
| Migrating legacy code? | May need refactoring | Existing code works |

**Default choice:** Map Components (`<arcgis-map>`, `<arcgis-scene>`). Fall back to Core API only when you need direct `MapView`/`SceneView` constructor control or are maintaining existing Core API code.

### Layer Type Selection

| Your data source | Layer to use |
|-----------------|--------------|
| ArcGIS Feature Service | `FeatureLayer` |
| GeoJSON file/URL | `GeoJSONLayer` |
| CSV with coordinates | `CSVLayer` |
| Cached map tiles | `TileLayer` |
| Vector tiles | `VectorTileLayer` |
| 3D buildings/objects | `SceneLayer` |
| Photogrammetry mesh | `IntegratedMeshLayer` |
| LiDAR point cloud | `PointCloudLayer` |
| Client-side graphics | `GraphicsLayer` |
| Raster imagery | `ImageryTileLayer` |
| WMS/WFS/OGC | See `arcgis-advanced-layers` |
| Parquet file | `ParquetLayer` |
| Real-time stream | `StreamLayer` |

### Authentication Approach

| Scenario | Approach | Skill |
|----------|----------|-------|
| Public app with basemaps/geocoding | API key via `esriConfig.apiKey` | `arcgis-authentication` |
| App that accesses user-specific content | OAuth 2.0 with `OAuthInfo` | `arcgis-authentication` |
| Enterprise portal behind firewall | OAuth 2.0 with custom `portalUrl` | `arcgis-authentication` |
| Server-to-server (no user) | App token (client credentials) | `arcgis-rest-services` |
| Quick prototype / demo | API key | `arcgis-authentication` |
