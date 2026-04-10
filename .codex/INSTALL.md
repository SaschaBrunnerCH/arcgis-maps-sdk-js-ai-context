# Installing ArcGIS Maps SDK Skills for Codex

## Prerequisites

- Git

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context.git ~/.codex/arcgis-maps-sdk-js-ai-context
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/arcgis-maps-sdk-js-ai-context/skills ~/.agents/skills/arcgis-maps-sdk-js-ai-context
   ```

   **Windows (PowerShell):**

   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\arcgis-maps-sdk-js-ai-context" "$env:USERPROFILE\.codex\arcgis-maps-sdk-js-ai-context\skills"
   ```

3. **Restart Codex** to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/arcgis-maps-sdk-js-ai-context
```

You should see a symlink pointing to the skills directory with 35 ArcGIS skill folders.

## Updating

```bash
cd ~/.codex/arcgis-maps-sdk-js-ai-context && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/arcgis-maps-sdk-js-ai-context
```

Optionally delete the clone: `rm -rf ~/.codex/arcgis-maps-sdk-js-ai-context`
