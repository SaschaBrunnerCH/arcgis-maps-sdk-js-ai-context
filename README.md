# arcgis-maps-sdk-js-ai-context

> **DISCLAIMER:** This is work in progress and not yet tested extensively. Use at your own risk.

Install [Agent Skills](https://agentskills.io) for [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) development. Compatible with Claude, VS Code, Cursor, and other AI agents.

## Features

- **Agent Skills**: Comprehensive skill files following the open [Agent Skills specification](https://agentskills.io/specification)
- **Cross-platform AI support**: Works with Claude, VS Code Copilot, Cursor, OpenCode, and other compatible agents
- **SDK Version Selection**: Choose skills for specific ArcGIS Maps SDK versions
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Zero dependencies**: Uses only built-in Node.js modules

## Installation

No installation required! Run directly with npx:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context <command>
```

## Commands

### Install Agent Skills

Installs 30 Agent Skills directly to `.github/skills/` in your project:

```bash
# Install for latest SDK version
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills

# Install for specific SDK version
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills --sdk 4.34
```

This creates the following structure (all skills are prefixed with `arcgis-` to avoid conflicts with other packages):

```
your-project/
└── .github/
    └── skills/
        ├── arcgis-starter-app/
        │   └── SKILL.md
        ├── arcgis-core-maps/
        │   └── SKILL.md
        ├── arcgis-layers/
        │   └── SKILL.md
        ├── arcgis-widgets-ui/
        │   └── SKILL.md
        └── ... (30 skill directories total)
```

### List Available Skills

Shows all available SDK versions and skills:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context list
```

### Help

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context --help
```

## SDK Version Selection

Use the `--sdk` flag to install skills for a specific ArcGIS Maps SDK version:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills --sdk 4.34
```

Available versions can be viewed with the `list` command. If no version is specified, the latest available version is used.

| SDK Version | Status |
|-------------|--------|
| 4.34 | Available |

## Skills Included

The package includes 30 comprehensive Agent Skills covering:

| Skill | Description |
|-------|-------------|
| arcgis-starter-app | Scaffold TypeScript/Vite apps (minimal and production-ready setups) |
| arcgis-core-maps | 2D and 3D map creation, views, navigation, arcgis-video |
| arcgis-layers | FeatureLayer, TileLayer, GeoJSONLayer, and more |
| arcgis-advanced-layers | WMS, WFS, WMTS, OGC, MapImageLayer, CatalogLayer, MediaLayer |
| arcgis-visualization | Renderers, symbols, labels, and visual variables |
| arcgis-smart-mapping | Smart mapping and data-driven visualization |
| arcgis-popup-templates | Popup configuration and content |
| arcgis-widgets-ui | Built-in widgets and UI components |
| arcgis-widgets-advanced | BuildingExplorer, FloorFilter, Track, Locate, ScaleBar, and more |
| arcgis-geometry-operations | Geometry operators and spatial operations |
| arcgis-coordinates-projection | Coordinate systems and projections |
| arcgis-spatial-analysis | Spatial analysis, feature reduction, and analysis objects |
| arcgis-rest-services | REST service wrappers for routing, geocoding, printing, places |
| arcgis-3d-layers | VoxelLayer, PointCloudLayer, glTF imports, 3D analysis components |
| arcgis-scene-environment | SceneView environment, shadows, lighting, atmosphere |
| arcgis-feature-effects | Feature effects, filters, and blend modes |
| arcgis-cim-symbols | CIM symbol specification |
| arcgis-arcade | Arcade expressions |
| arcgis-time-animation | Time-aware layers and animation |
| arcgis-editing | Editor widget, forms, subtypes, versioning |
| arcgis-interaction | Hit testing, highlighting, sketching, and events |
| arcgis-map-tools | Measurement, print, directions, and utility tools |
| arcgis-tables-forms | Attribute tables and feature forms |
| arcgis-custom-rendering | Custom WebGL rendering and LayerView architecture |
| arcgis-imagery | Imagery and raster analysis |
| arcgis-authentication | OAuth, API keys, and identity management |
| arcgis-portal-content | Portal items, groups, and content management |
| arcgis-knowledge-graphs | Knowledge graph integration and link charts |
| arcgis-utility-networks | Utility network analysis |
| arcgis-core-utilities | Accessor, Collection, reactiveUtils, intl, and workers |

## Usage

After installing skills, your AI agent will automatically have access to ArcGIS-specific knowledge when working in your project. The skills provide:

- Correct import patterns for ESM and Map Components
- Best practices for TypeScript with autocasting
- Code examples for common tasks
- Reference samples linking to official SDK sample code
- Common pitfalls and how to avoid them
- Cross-references between related skills

### Supported AI Agents

- [Claude](https://claude.ai/) / [Claude Code](https://claude.ai/claude-code)
- [VS Code with Copilot](https://code.visualstudio.com/)
- [Cursor](https://cursor.com/)
- [OpenCode](https://opencode.ai/)
- Any agent supporting the [Agent Skills specification](https://agentskills.io)

## Requirements

- Node.js 14.0.0 or higher

## Source

The skills in this package are based on the official ArcGIS Maps SDK for JavaScript documentation:

- **Documentation:** https://developers.arcgis.com/javascript/latest/downloads/
- **Folders used:** `api-reference` and `sample-code` and `map-components`

## AI Assistance Declaration

This project was primarily developed using AI coding assistants. The maintainer directed the development through prompts and reviewed all generated code.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests at:

https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context

## Related

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- [Agent Skills Specification](https://agentskills.io)
- [Claude](https://claude.ai/)
