---
name: arcgis-coding-components
description: Embed an Arcade expression editor in applications using the Coding Components package. Use for building Arcade authoring, testing, and debugging interfaces.
---

# ArcGIS Coding Components

Use this skill when embedding an Arcade expression editor into a web application. The `@arcgis/coding-components` package provides the `arcgis-arcade-editor` web component - a full-featured code editor for writing, testing, and debugging Arcade expressions. This is a **new component package in 5.0** with no 4.x equivalent.

## Import Patterns

### CDN (No Build Tools)
```html
<!-- Load ArcGIS Maps SDK -->
<script src="https://js.arcgis.com/5.0/"></script>
<!-- Load Coding Components -->
<script type="module" src="https://js.arcgis.com/5.0/coding-components/"></script>
```

### Direct ESM Imports (Build Tools)
```javascript
import "@arcgis/coding-components/components/arcgis-arcade-editor";
```

## arcgis-arcade-editor Component

A rich code editor for Arcade expressions with syntax highlighting, diagnostics, code suggestions, and a documentation side panel.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `script` | `script` | `string` | `""` | The Arcade script content (read/write) |
| `profile` | - | `IEditorProfileDefinition` | - | Profile metadata defining the editing context (set via JS) |
| `testData` | - | `IEditorTestContext` | - | Test data context for expression validation (set via JS) |
| `snippets` | - | `ApiSnippet[]` | - | Collection of code snippets to show in the snippets panel (set via JS) |
| `suggestions` | - | `IEditorCodeSuggestion[]` | - | Code suggestions shown to the user (set via JS) |
| `editorOptions` | - | `IEditorOptions & IGlobalEditorOptions` | - | Monaco-style editor options (set via JS) |
| `hideSideBar` | `hide-side-bar` | `boolean` | `false` | Hide the side action bar for a minimal UI |
| `hideDocumentationActions` | - | `boolean` | `false` | Hide the documentation action in the side panel |
| `openedSidePanel` | `opened-side-panel` | `string` | `"none"` | Name of the currently opened side panel |
| `sideActionBarExpanded` | `side-action-bar-expanded` | `boolean` | `false` | Whether the side action bar is expanded |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setFocus()` | `void` | Set focus on the editor |
| `componentOnReady()` | `Promise<void>` | Resolves when the component is fully loaded |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `arcgisScriptChange` | `string` | Fired when the script content changes (debounced) |
| `arcgisDiagnosticsChange` | `Diagnostic[]` | Fired when diagnostics (errors/warnings) change |

## Basic Usage

### Minimal Editor
```html
<arcgis-arcade-editor
  script="return $feature.Population * 2;"
  style="width: 600px; height: 400px;">
</arcgis-arcade-editor>
```

### Listening for Script Changes
```html
<arcgis-arcade-editor id="editor" style="width: 600px; height: 400px;">
</arcgis-arcade-editor>

<script type="module">
  const editor = document.querySelector("#editor");
  editor.script = "return $feature.Name;";

  editor.addEventListener("arcgisScriptChange", (event) => {
    const newScript = event.detail;
    console.log("Script updated:", newScript);
  });

  editor.addEventListener("arcgisDiagnosticsChange", (event) => {
    const diagnostics = event.detail;
    const errors = diagnostics.filter(d => d.severity === "error");
    if (errors.length > 0) {
      console.warn("Script has errors:", errors);
    }
  });
</script>
```

### Editor with Profile Context
```javascript
const editor = document.querySelector("arcgis-arcade-editor");

// Define the editing profile - tells the editor what variables are available
editor.profile = {
  id: "popup",
  title: "Popup Expression",
  description: "Expression for popup content",
  variables: [
    {
      name: "$feature",
      type: "Feature",
      description: "The current feature"
    },
    {
      name: "$layer",
      type: "FeatureSet",
      description: "The feature's parent layer"
    }
  ]
};
```

### Editor with Test Data
```javascript
const editor = document.querySelector("arcgis-arcade-editor");

// Provide test data for expression validation
editor.testData = {
  spatialReference: { wkid: 4326 },
  features: [
    {
      attributes: {
        Name: "Test Feature",
        Population: 50000,
        Area: 125.5
      },
      geometry: {
        type: "point",
        x: -118.24,
        y: 34.05
      }
    }
  ],
  fields: [
    { name: "Name", type: "esriFieldTypeString", alias: "Name" },
    { name: "Population", type: "esriFieldTypeInteger", alias: "Population" },
    { name: "Area", type: "esriFieldTypeDouble", alias: "Area" }
  ]
};
```

### Editor with Custom Snippets
```javascript
const editor = document.querySelector("arcgis-arcade-editor");

editor.snippets = [
  {
    name: "Format Currency",
    description: "Format a number as US currency",
    code: 'Text($feature.Value, "$#,###.00")'
  },
  {
    name: "Concatenate Fields",
    description: "Join two text fields with a separator",
    code: 'Concatenate([$feature.FirstName, $feature.LastName], " ")'
  }
];
```

### Minimal Editor (No Side Bar)
```html
<arcgis-arcade-editor
  hide-side-bar
  script="return Round($feature.Value, 2);"
  style="width: 400px; height: 200px;">
</arcgis-arcade-editor>
```

## Full Example with Map Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Arcade Editor</title>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/coding-components/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; display: flex; flex-direction: column; }
    arcgis-map { flex: 1; }
    #editor-panel { height: 300px; border-top: 1px solid #ccc; }
  </style>
</head>
<body>
  <arcgis-map id="map" item-id="YOUR_WEBMAP_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
  </arcgis-map>
  <div id="editor-panel">
    <arcgis-arcade-editor id="editor"></arcgis-arcade-editor>
  </div>

  <script type="module">
    const mapElement = document.querySelector("#map");
    const editor = document.querySelector("#editor");

    await mapElement.viewOnReady();
    const view = mapElement.view;
    const layer = view.map.layers.getItemAt(0);
    await layer.load();

    // Set initial script
    editor.script = 'return $feature.Name + " (" + $feature.Type + ")"';

    // Configure profile from layer fields
    editor.profile = {
      id: "popup",
      title: "Popup Expression",
      variables: [
        { name: "$feature", type: "Feature", description: "Current feature" }
      ]
    };

    // Listen for changes and apply to popup
    editor.addEventListener("arcgisScriptChange", (event) => {
      console.log("Expression:", event.detail);
    });
  </script>
</body>
</html>
```

## Common Pitfalls

1. **Missing coding-components script**: The `arcgis-arcade-editor` element must be loaded separately from the core SDK.

   ```html
   <!-- Anti-pattern: only loading core SDK -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <arcgis-arcade-editor></arcgis-arcade-editor>
   ```

   ```html
   <!-- Correct: load coding-components too -->
   <script src="https://js.arcgis.com/5.0/"></script>
   <script type="module" src="https://js.arcgis.com/5.0/coding-components/"></script>
   <arcgis-arcade-editor></arcgis-arcade-editor>
   ```

   **Impact:** The element is unrecognized and renders as empty.

2. **No size on the editor**: The editor needs explicit width and height to render.

   ```html
   <!-- Anti-pattern: no size -->
   <arcgis-arcade-editor></arcgis-arcade-editor>
   ```

   ```html
   <!-- Correct: explicit size -->
   <arcgis-arcade-editor style="width: 600px; height: 400px;"></arcgis-arcade-editor>
   ```

   **Impact:** The editor renders with zero height and is invisible.

3. **Setting `profile` or `testData` as HTML attributes**: These properties accept complex objects and must be set via JavaScript.

   **Impact:** Values are silently ignored; the editor lacks context for autocompletion and validation.

4. **Not debouncing `arcgisScriptChange`**: The event fires on every keystroke (debounced internally but can still be frequent). Avoid expensive operations in the handler.

   ```javascript
   // Anti-pattern: expensive operation on every change
   editor.addEventListener("arcgisScriptChange", async (event) => {
     await compileAndExecuteArcade(event.detail); // too frequent
   });
   ```

   ```javascript
   // Correct: add your own debounce for expensive operations
   let timeout;
   editor.addEventListener("arcgisScriptChange", (event) => {
     clearTimeout(timeout);
     timeout = setTimeout(() => {
       compileAndExecuteArcade(event.detail);
     }, 500);
   });
   ```

   **Impact:** UI freezes or excessive server requests during typing.

## Reference Samples

- Search for Arcade-related samples that demonstrate expression editing workflows.

## Related Skills

- See `arcgis-arcade` for Arcade expression language syntax and usage patterns.
- See `arcgis-widgets-ui` for layout components to host the editor panel.
- See `arcgis-popup-templates` for using Arcade expressions in popup content.
- See `arcgis-visualization` for Arcade-driven visual variables and renderers.
