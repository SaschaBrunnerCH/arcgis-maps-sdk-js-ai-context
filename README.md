# arcgis-maps-sdk-js-ai-context

> [!CAUTION]
> **This is work in progress and not yet tested extensively. Use at your own risk.**

[Agent Skills](https://agentskills.io) for [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) (SDK 5.0). 35 skills covering maps, layers, visualization, spatial analysis, widgets, editing, 3D, and more.

## Installation

The simplest path works for every supported agent — use the [`skills` CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context
```

It auto-detects which coding agents you have installed and copies the skills to the correct location for each. To target a specific agent, use `-a`:

```bash
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context -a claude-code
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context -a cursor
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context -a github-copilot
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context -a opencode
```

Install individual skills instead of the full set:

```bash
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/arcgis-starter-app
npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/arcgis-core-maps
```

### Native agent workflows

Some agents ship first-party plugin marketplaces with a nicer in-agent UX than the CLI.

#### Claude Code

Register the marketplace, then install the plugin:

```text
/plugin marketplace add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context
/plugin install arcgis-maps-sdk-js-ai-context@arcgis-maps-sdk-js-skills
```

#### Cursor

Cursor 2.5+ ships a [plugin marketplace](https://cursor.com/marketplace) and reads plugins from repos containing `.cursor-plugin/plugin.json` (which this repo provides). Install via **Cursor Settings → Plugins → Add plugin**, or browse [cursor.com/marketplace](https://cursor.com/marketplace). See the [Cursor plugin docs](https://cursor.com/docs/plugins) for details.

If you prefer the CLI, `npx skills add SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context -a cursor` also works.

#### VS Code with GitHub Copilot

GitHub Copilot auto-discovers skills from `.github/skills/`, `.claude/skills/`, and `.agents/skills/` in your project (configurable via the `chat.skillsLocations` setting). Install via the Skills CLI above, or type `/skills` in Copilot Chat to open the **Configure Skills** menu.

See [Use Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills) for details.

### Manual install

#### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/refs/heads/master/.codex/INSTALL.md
```

**Detailed docs:** [.codex/INSTALL.md](.codex/INSTALL.md)

#### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/refs/heads/master/.opencode/INSTALL.md
```

**Detailed docs:** [.opencode/INSTALL.md](.opencode/INSTALL.md)

### Verify Installation

Start a new session in your agent and ask it to help with an ArcGIS Maps SDK task (for example, "create a map with a FeatureLayer"). The agent should automatically use the relevant ArcGIS skill.

## Skills (35)

See [skills/README.md](skills/README.md) for the full index by category.

| Category      | Skills                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core          | `arcgis-core-maps`, `arcgis-starter-app`, `arcgis-core-utilities`, `arcgis-performance`                                                                                                     |
| Layers & Data | `arcgis-layers`, `arcgis-advanced-layers`, `arcgis-3d-layers`, `arcgis-tables-forms`                                                                                                        |
| Visualization | `arcgis-visualization`, `arcgis-cim-symbols`, `arcgis-smart-mapping`, `arcgis-feature-effects`                                                                                              |
| Interaction   | `arcgis-interaction`, `arcgis-popup-templates`, `arcgis-editing`                                                                                                                            |
| Widgets & UI  | `arcgis-widgets-ui`, `arcgis-widgets-advanced`                                                                                                                                              |
| Spatial       | `arcgis-geometry-operations`, `arcgis-spatial-analysis`, `arcgis-coordinates-projection`                                                                                                    |
| Services      | `arcgis-rest-services`, `arcgis-portal-content`, `arcgis-authentication`                                                                                                                    |
| Specialized   | `arcgis-map-tools`, `arcgis-arcade`, `arcgis-imagery`, `arcgis-time-animation`, `arcgis-scene-environment`, `arcgis-utility-networks`, `arcgis-knowledge-graphs`, `arcgis-custom-rendering` |
| New in 5.0    | `arcgis-ai-components`, `arcgis-charts`, `arcgis-coding-components`, `arcgis-embeddable-maps`                                                                                               |

## What skills provide

After installing, your AI agent automatically gets ArcGIS-specific knowledge:

- Correct import patterns for ESM and Map Components
- Best practices for TypeScript with autocasting
- Code examples for common tasks
- Reference samples linking to official SDK sample code
- Common pitfalls and how to avoid them
- Cross-references between related skills

## Supported AI Agents

- [VS Code with GitHub Copilot](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Claude](https://claude.ai/) / [Claude Code](https://claude.ai/claude-code)
- [Codex](https://openai.com/index/introducing-codex/)
- [OpenCode](https://opencode.ai/)
- [Cursor](https://cursor.com/)
- Any agent supporting the [Agent Skills specification](https://agentskills.io)

## Updating

For Claude Code:

```bash
/plugin update arcgis-maps-sdk-js-ai-context
```

For Codex/OpenCode, pull the latest in the cloned directory:

```bash
git pull
```

For the Skills CLI, re-run the `npx skills add` command to get the latest version.

## Legacy SDK 4.34

Skills for SDK 4.34 are preserved on the [`sdk-4.34`](https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/tree/sdk-4.34) branch. That branch includes the original CLI installer:

```bash
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context skills --sdk 4.34
```

## Source

Skills are based on the official ArcGIS Maps SDK for JavaScript documentation:

- **Documentation:** <https://developers.arcgis.com/javascript/latest/downloads/>
- **Folders used:** `api-reference`, `sample-code`, and `map-components`

## AI Assistance Declaration

This project was primarily developed using AI coding assistants. The maintainer directed the development through prompts and reviewed all generated code.

## License

MIT

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## Related

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- [Agent Skills Specification](https://agentskills.io)
- [Skills CLI (vercel-labs/skills)](https://github.com/vercel-labs/skills)
- [Anthropic Skills](https://github.com/anthropics/skills)
