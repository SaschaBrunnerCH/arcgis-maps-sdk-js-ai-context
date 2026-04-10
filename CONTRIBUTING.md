# Contributing

Contributions are welcome! This guide covers development setup and skill authoring.

## Development Setup

```bash
git clone https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context.git
cd arcgis-maps-sdk-js-ai-context
npm install      # installs devDependencies and sets up git hooks
```

Requires Node.js 20+ (see `.nvmrc`).

## Quality Checks

```bash
npm run check           # runs all checks below
npm run format:check    # prettier formatting
npm run spellcheck      # cspell spell check
npm run lint:markdown   # markdownlint
npm run validate:skills # skill frontmatter and structure
```

Format all files:

```bash
npm run format
```

A pre-push git hook runs `npm run check` automatically.

## Creating a New Skill

1. Create a directory under `skills/` with an `arcgis-` prefix:

   ```text
   skills/arcgis-my-feature/
   └── SKILL.md
   ```

2. Add YAML frontmatter to `SKILL.md`:

   ```yaml
   ---
   name: arcgis-my-feature
   description: Brief one-line description of the skill
   ---
   ```

3. The `name` field must match the directory name exactly.

4. Aim for under 500 lines per SKILL.md. If a skill outgrows that, move detail into a `references/` subdirectory for progressive disclosure — the validator warns (non-failing) above 500 lines.

5. Reference other skills in a `## Related Skills` section using backtick-quoted names like `` `arcgis-core-maps` ``.

6. Add an `AGENTS.md` file if the skill needs agent-specific instructions (optional but must not be empty if present).

7. Run `npm run check` to validate before committing.

## Skill Quality Standards

- Correct import patterns for ESM and Map Components
- TypeScript examples with proper typing
- Links to official ArcGIS SDK samples where applicable
- Common pitfalls section
- Cross-references to related skills

## Spell Check

If `cspell` flags a legitimate ArcGIS term, add it to the `words` array in `cspell.config.json`.

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes and ensure `npm run check` passes
4. Submit a pull request

## Releasing

When cutting a new release, bump the version in all four places so the plugin marketplaces stay in sync:

1. `package.json`
2. `.claude-plugin/plugin.json`
3. `.claude-plugin/marketplace.json` (under `plugins[0].version`)
4. `.cursor-plugin/plugin.json`

Then tag and push:

```bash
git commit -am "vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

Semver guidance:

- **Patch** (`x.y.Z`) — doc fixes, typo corrections, validator tweaks
- **Minor** (`x.Y.0`) — new skills, non-breaking description changes
- **Major** (`X.0.0`) — removing or renaming skills, changing install paths, changing frontmatter schema

The repo no longer publishes to npm; releases are consumed directly from GitHub via `npx skills add` or the per-agent plugin marketplaces.

## Questions

Open an issue at <https://github.com/SaschaBrunnerCH/arcgis-maps-sdk-js-ai-context/issues>.
