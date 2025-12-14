# arcgis-maps-sdk-js-ai-context

> **DISCLAIMER:** This is work in progress and not yet tested extensively. Use at your own risk.

Install AI assistant context files for [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) development. Supports Claude skills and GitHub Copilot instructions.

## Features

- **Claude Skills**: Comprehensive skill files for Claude AI assistant covering all major ArcGIS Maps SDK features
- **GitHub Copilot Instructions**: Context files for GitHub Copilot to improve code suggestions
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Zero dependencies**: Uses only built-in Node.js modules

## Installation

No installation required! Run directly with npx:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context <command>
```

## Commands

### Install Claude Skills

Installs Claude skill files to `.claude/skills/arcgis-maps-sdk-js/` in your project:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context claude
```

### Install GitHub Copilot Instructions

Installs Copilot instruction files to `.github/instructions/` in your project:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context copilot
```

### Install All

Installs both Claude skills and Copilot instructions:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context all
```

### List Available Contexts

Shows all available context files included in the package:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context list
```

### Help

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context --help
```

## Claude Skills Included

The package includes 28 comprehensive Claude skills covering:

| Skill | Description |
|-------|-------------|
| arcgis-core-maps | 2D and 3D map creation, views, navigation |
| arcgis-layers | FeatureLayer, TileLayer, GeoJSONLayer, and more |
| arcgis-visualization | Renderers, symbols, and visual variables |
| arcgis-popup-templates | Popup configuration and content |
| arcgis-widgets-ui | Built-in widgets and UI components |
| arcgis-geometry-operations | Geometry engine and spatial operations |
| arcgis-coordinates-projection | Coordinate systems and projections |
| arcgis-authentication | OAuth, API keys, and identity management |
| arcgis-portal-content | Portal items, groups, and content management |
| arcgis-smart-mapping | Smart mapping and data-driven visualization |
| arcgis-editing-advanced | Feature editing and sketching |
| arcgis-analysis-services | Spatial analysis and geoprocessing |
| arcgis-3d-advanced | 3D visualization and SceneView |
| arcgis-scene-effects | 3D effects, lighting, and atmosphere |
| arcgis-cim-symbols | CIM symbol specification |
| arcgis-arcade | Arcade expressions |
| arcgis-time-animation | Time-aware layers and animation |
| arcgis-feature-effects | Feature effects and filters |
| arcgis-custom-rendering | Custom WebGL rendering |
| arcgis-interaction | View interaction and events |
| arcgis-map-tools | Measurement, print, and utility tools |
| arcgis-tables-forms | Attribute tables and feature forms |
| arcgis-media-layers | Media and image layers |
| arcgis-advanced-layers | Specialized layer types |
| arcgis-imagery | Imagery and raster analysis |
| arcgis-knowledge-graphs | Knowledge graph integration |
| arcgis-utility-networks | Utility network analysis |
| arcgis-core-utilities | Core utilities and helpers |

## GitHub Copilot Instructions

The package includes 16 comprehensive Copilot instruction files covering all topics:

| File | Coverage |
|------|----------|
| arcgis-core-maps.instructions.md | Maps, views, navigation, imports |
| arcgis-layers.instructions.md | All layer types, queries, management |
| arcgis-visualization.instructions.md | Renderers, symbols, visual variables, labels |
| arcgis-widgets-ui.instructions.md | Widgets, Calcite Design System |
| arcgis-popup-templates.instructions.md | Popup content, charts, expressions |
| arcgis-geometry.instructions.md | Geometry operators, spatial operations, projection |
| arcgis-authentication.instructions.md | OAuth, API keys, identity |
| arcgis-editing.instructions.md | Editor, Sketch, forms, versioning |
| arcgis-3d.instructions.md | SceneView, 3D layers, weather, lighting, effects |
| arcgis-arcade.instructions.md | Arcade expressions for all contexts |
| arcgis-analysis.instructions.md | Analysis tools, measurement, print |
| arcgis-smart-mapping.instructions.md | Auto-generated renderers, statistics |
| arcgis-time-animation.instructions.md | TimeSlider, temporal data |
| arcgis-cim-symbols.instructions.md | Advanced CIM symbology |
| arcgis-portal-advanced.instructions.md | Portal, imagery, media layers, utility networks, knowledge graphs |
| arcgis-core-utilities.instructions.md | reactiveUtils, Collection, hit testing, highlighting, events |

Each file provides:
- Import patterns and best practices
- Comprehensive code examples
- TypeScript guidance with `as const`
- Common pitfalls to avoid

## Usage with Claude

After installing Claude skills, Claude will automatically have access to ArcGIS-specific knowledge when working in your project. The skills provide:

- Correct import patterns for ESM and CDN usage
- Best practices for TypeScript with autocasting
- Code examples for common tasks
- API reference guidance

## Usage with GitHub Copilot

After installing Copilot instructions, GitHub Copilot will provide better suggestions for:

- ArcGIS API imports
- Map and view initialization
- Layer configuration
- Widget setup
- Common patterns

## Requirements

- Node.js 14.0.0 or higher

## Source

The context files in this package are based on the official ArcGIS Maps SDK for JavaScript documentation:

- **Documentation:** https://developers.arcgis.com/javascript/latest/downloads/
- **Folders used:** `api-reference` and `sample-code`

## AI Assistance Declaration

This project was primarily developed using AI coding assistants. The maintainer directed the development through prompts and reviewed all generated code.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests at:

https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context

## Related

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- [Claude](https://claude.ai/)
- [GitHub Copilot](https://github.com/features/copilot)
