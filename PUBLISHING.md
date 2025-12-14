# Publishing to npm

Instructions for maintainers to publish new versions to npm.

## 1. Prerequisites

```bash
# Login to npm (one-time)
npm login
```

## 2. Pre-publish Checks

```bash
# Verify package.json is correct
npm pack --dry-run

# Test the CLI locally
node bin/cli.js --help
node bin/cli.js list
```

## 3. Publish

```bash
# First publish (public package)
npm publish --access public
```

## 4. Future Updates

```bash
# Bump version (patch: 0.0.1 → 0.0.2)
npm version patch

# Or minor: 0.0.x → 0.1.0
npm version minor

# Then publish
npm publish

# Push version tag to GitHub
git push && git push --tags
```

## 5. Verify

After publishing:

```bash
# Test installation
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context --help
npx @saschabrunnerch/arcgis-maps-sdk-js-ai-context list
```
