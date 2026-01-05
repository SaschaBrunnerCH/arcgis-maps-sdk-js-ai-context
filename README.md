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

Installs Agent Skills to `.github/skills/` in your project:

```bash
# Install for latest SDK version
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills

# Install for specific SDK version
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills --sdk 4.34
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
| arcgis-starter-app | Scaffold minimal TypeScript/Vite app with Map Components |
| arcgis-starter-app-extended | Extended starter app with additional features |
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

## Usage

After installing skills, your AI agent will automatically have access to ArcGIS-specific knowledge when working in your project. The skills provide:

- Correct import patterns for ESM and CDN usage
- Best practices for TypeScript with autocasting
- Code examples for common tasks
- API reference guidance

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
- [Agent Skills Specification](https://agentskills.io)
- [Claude](https://claude.ai/)
