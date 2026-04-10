# Installing ArcGIS Maps SDK Skills for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context.git ~/.config/opencode/arcgis-maps-sdk-js-ai-context
```

### 2. Symlink skills

Create a symlink so OpenCode's native skill tool discovers the skills:

```bash
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/arcgis-maps-sdk-js-ai-context/skills ~/.config/opencode/skills/arcgis-maps-sdk-js-ai-context
```

### 3. Restart OpenCode

Restart OpenCode to discover the skills.

## Usage

### List skills

Use OpenCode's native `skill` tool:

```text
use skill tool to list skills
```

### Load a skill

```text
use skill tool to load arcgis-maps-sdk-js-ai-context/arcgis-starter-app
```

## Updating

```bash
cd ~/.config/opencode/arcgis-maps-sdk-js-ai-context && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.config/opencode/skills/arcgis-maps-sdk-js-ai-context
```

Optionally delete the clone: `rm -rf ~/.config/opencode/arcgis-maps-sdk-js-ai-context`
