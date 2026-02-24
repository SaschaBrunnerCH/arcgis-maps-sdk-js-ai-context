---
name: arcgis-editing
description: Edit features with the Editor component/widget, configure forms, manage subtypes, handle attachments, and work with branch versioning.
---

# ArcGIS Editing

Use this skill for editing features including Editor configuration, form templates, subtypes, attachments, versioning, and programmatic edits.

## Import Patterns

### Direct ESM Imports
```javascript
import Editor from "@arcgis/core/widgets/Editor.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";
import FormTemplate from "@arcgis/core/form/FormTemplate.js";
```

### Dynamic Imports (CDN)
```javascript
const Editor = await $arcgis.import("@arcgis/core/widgets/Editor.js");
const FeatureForm = await $arcgis.import("@arcgis/core/widgets/FeatureForm.js");
const FormTemplate = await $arcgis.import("@arcgis/core/form/FormTemplate.js");
```

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## Editor Component

The simplest way to add editing is the `<arcgis-editor>` component.

### Basic Usage
```html
<arcgis-map item-id="YOUR_EDITABLE_WEBMAP_ID">
  <arcgis-editor slot="top-right"></arcgis-editor>
</arcgis-map>
```

### Key Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `heading-level` | number | | Heading level for accessibility |
| `hide-create-features-section` | boolean | false | Hide the create features panel |
| `hide-edit-features-section` | boolean | false | Hide the edit features panel |
| `hide-labels-toggle` | boolean | false | Hide the labels toggle |
| `hide-merge-button` | boolean | false | Hide the merge features button |
| `hide-settings-menu` | boolean | false | Hide the settings menu |
| `hide-sketch` | boolean | false | Hide the sketch tools |
| `hide-split-button` | boolean | false | Hide the split feature button |
| `hide-tooltips-toggle` | boolean | false | Hide the tooltips toggle |
| `hide-undo-redo-buttons` | boolean | false | Hide undo/redo buttons |
| `hide-zoom-to-button` | boolean | false | Hide the zoom-to button |
| `label` | string | | Component label |
| `layer-infos` | LayerInfo[] | | Layer editing configuration |
| `snapping-options` | SnappingOptions | | Snapping configuration |
| `sync-view-selection` | boolean | false | Sync selection with view |

### Key Events

| Event | Description |
|-------|-------------|
| `arcgisSketchCreate` | Fires during feature creation sketch |
| `arcgisSketchUpdate` | Fires during feature update sketch |
| `arcgisPropertyChange` | Fires when `activeWorkflow` or `state` changes |
| `arcgisReady` | Fires when the component is ready |

### Key Methods

| Method | Description |
|--------|-------------|
| `cancelWorkflow()` | Cancel the active editing workflow |
| `deleteFeatureFromWorkflow()` | Delete the feature being edited |
| `startCreateFeaturesWorkflowAtFeatureTypeSelection()` | Start creating features |
| `startUpdateWorkflowAtFeatureEdit(feature)` | Start editing a specific feature |
| `startUpdateWorkflowAtFeatureSelection()` | Start feature selection for update |

### Editor Component with Configuration

```html
<arcgis-map basemap="streets-navigation-vector">
  <arcgis-editor slot="top-right"></arcgis-editor>
</arcgis-map>

<script type="module">
  const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

  const mapElement = document.querySelector("arcgis-map");
  const view = await mapElement.view;
  await view.when();

  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/.../FeatureServer/0"
  });
  mapElement.map.add(layer);

  const editor = document.querySelector("arcgis-editor");
  editor.layerInfos = [{
    layer: layer,
    formTemplate: {
      title: "Edit Feature",
      elements: [
        { type: "field", fieldName: "name", label: "Name" },
        { type: "field", fieldName: "category", label: "Category" }
      ]
    },
    addEnabled: true,
    updateEnabled: true,
    deleteEnabled: false
  }];
</script>
```

## Editor Widget (Core API)

### Configurable Editor

```javascript
import Editor from "@arcgis/core/widgets/Editor.js";

const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    formTemplate: {
      title: "Feature Details",
      description: "Enter feature information",
      elements: [
        {
          type: "field",
          fieldName: "name",
          label: "Name",
          description: "Enter the feature name"
        },
        {
          type: "field",
          fieldName: "category",
          label: "Category"
        }
      ]
    },
    addEnabled: true,
    updateEnabled: true,
    deleteEnabled: false
  }]
});

view.ui.add(editor, "top-right");
```

### LayerInfo Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layer` | FeatureLayer | required | The layer to edit |
| `formTemplate` | FormTemplate | | Form configuration |
| `enabled` | boolean | true | Enable editing on layer |
| `addEnabled` | boolean | true | Allow creating features |
| `updateEnabled` | boolean | true | Allow updating features |
| `deleteEnabled` | boolean | true | Allow deleting features |
| `geometryUpdatesEnabled` | boolean | true | Allow geometry edits |
| `attributeUpdatesEnabled` | boolean | true | Allow attribute edits |
| `attachmentsOnCreateEnabled` | boolean | true | Allow attachments when creating |
| `attachmentsOnUpdateEnabled` | boolean | true | Allow attachments when updating |

## Feature Form

### Standalone Feature Form

```javascript
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";

const form = new FeatureForm({
  container: "formDiv",
  layer: featureLayer,
  formTemplate: {
    title: "Edit Feature",
    elements: [
      {
        type: "field",
        fieldName: "name",
        label: "Name"
      },
      {
        type: "group",
        label: "Location Details",
        elements: [
          { type: "field", fieldName: "address" },
          { type: "field", fieldName: "city" },
          { type: "field", fieldName: "zip" }
        ]
      }
    ]
  }
});

// Set feature to edit
form.feature = graphic;

// Listen for submit
form.on("submit", async () => {
  if (form.valid) {
    const values = form.getValues();
    graphic.attributes = { ...graphic.attributes, ...values };
    await featureLayer.applyEdits({
      updateFeatures: [graphic]
    });
  }
});
```

### Feature Form Component

```html
<arcgis-feature-form></arcgis-feature-form>

<script type="module">
  const featureForm = document.querySelector("arcgis-feature-form");

  // Configure the form
  featureForm.formTemplate = {
    title: "Edit Feature",
    elements: [
      { type: "field", fieldName: "name", label: "Name" },
      { type: "field", fieldName: "status", label: "Status" }
    ]
  };

  // Set feature to edit
  featureForm.feature = selectedGraphic;

  // Listen for value changes
  featureForm.addEventListener("arcgisValueChange", (event) => {
    console.log("Field changed:", event.detail.fieldName, event.detail.value);
  });

  // Listen for submit
  featureForm.addEventListener("arcgisSubmit", (event) => {
    console.log("Form submitted");
  });
</script>
```

### Form with Grouped Elements

```javascript
const formTemplate = {
  title: "Asset Details",
  elements: [
    {
      type: "group",
      label: "Basic Information",
      elements: [
        { type: "field", fieldName: "asset_id" },
        { type: "field", fieldName: "asset_name" },
        { type: "field", fieldName: "asset_type" }
      ]
    },
    {
      type: "group",
      label: "Maintenance",
      initialState: "collapsed",
      elements: [
        { type: "field", fieldName: "last_inspection" },
        { type: "field", fieldName: "next_inspection" },
        { type: "field", fieldName: "condition" }
      ]
    }
  ]
};
```

### Expression-Based Visibility

```javascript
const formTemplate = {
  expressionInfos: [
    {
      name: "type-requires-subtype",
      expression: "$feature.type == 'complex'"
    }
  ],
  elements: [
    {
      type: "field",
      fieldName: "type"
    },
    {
      type: "field",
      fieldName: "subtype",
      visibilityExpression: "type-requires-subtype"
    }
  ]
};
```

### Form Validation

```javascript
const form = new FeatureForm({
  layer: featureLayer,
  formTemplate: {
    elements: [{
      type: "field",
      fieldName: "email",
      label: "Email",
      requiredExpression: "email-required"
    }],
    expressionInfos: [{
      name: "email-required",
      expression: "$feature.contact_method == 'email'"
    }]
  }
});

// Available expression types on FieldElement:
// - visibilityExpression: controls field visibility
// - editableExpression: controls whether field is editable
// - requiredExpression: controls whether field is required
// - valueExpression: computes a calculated value for the field

if (form.valid) {
  // Submit
}
```

## Programmatic Editing (applyEdits)

```javascript
// Add features
const addResult = await featureLayer.applyEdits({
  addFeatures: [{
    attributes: {
      name: "New Feature",
      category: "Type A"
    },
    geometry: {
      type: "point",
      longitude: -118.805,
      latitude: 34.027
    }
  }]
});

// Update features
const updateResult = await featureLayer.applyEdits({
  updateFeatures: [{
    attributes: {
      OBJECTID: 123,
      name: "Updated Name"
    }
  }]
});

// Delete features
const deleteResult = await featureLayer.applyEdits({
  deleteFeatures: [{ objectId: 123 }]
});

// Check results
addResult.addFeatureResults.forEach((result) => {
  if (result.error) {
    console.error("Add failed:", result.error.message);
  } else {
    console.log("Added feature OID:", result.objectId);
  }
});
```

## Subtypes

### Working with Subtypes

```javascript
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
});

await layer.load();

const subtypeField = layer.subtypeField;
const subtypes = layer.subtypes;

subtypes.forEach(subtype => {
  console.log("Code:", subtype.code);
  console.log("Name:", subtype.name);
  console.log("Default values:", subtype.defaultValues);
});
```

### Subtype Group Layer

```javascript
import SubtypeGroupLayer from "@arcgis/core/layers/SubtypeGroupLayer.js";

const subtypeLayer = new SubtypeGroupLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
});

await subtypeLayer.load();

// Access sublayers by subtype
subtypeLayer.sublayers.forEach(sublayer => {
  console.log("Subtype:", sublayer.subtypeCode, sublayer.title);
  // Each sublayer can have different renderer/popup
});
```

### Editor with Subtype Support

```javascript
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: subtypeGroupLayer,
    addEnabled: true,
    updateEnabled: true
  }]
});
```

## Versioning

### Branch Versioning Overview

Branch versioning allows multiple users to edit the same data simultaneously without conflicts until reconciliation.

```javascript
import VersionManagementService from "@arcgis/core/versionManagement/VersionManagementService.js";

const vms = new VersionManagementService({
  url: "https://services.arcgis.com/.../VersionManagementServer"
});

await vms.load();
console.log("Default version:", vms.defaultVersionIdentifier);
```

### Get Version Information

```javascript
const versions = await vms.getVersionInfos();
versions.forEach(v => {
  console.log("Version:", v.versionName);
  console.log("  Owner:", v.versionOwner);
  console.log("  Access:", v.access);  // public, protected, private
  console.log("  Parent:", v.parentVersionName);
});
```

### Create, Alter, Delete Versions

```javascript
// Create new version
const newVersion = await vms.createVersion({
  versionName: "MyEditVersion",
  description: "Version for editing project X",
  access: "private",
  parentVersionName: "sde.DEFAULT"
});

// Alter version properties
await vms.alterVersion({
  versionName: "sde.MyEditVersion",
  description: "Updated description",
  access: "protected"
});

// Delete a version
await vms.deleteVersion({
  versionName: "sde.MyEditVersion"
});
```

### Switching Versions

```javascript
// Set version on layer at creation
const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  gdbVersion: "sde.MyEditVersion"
});

// Or change version dynamically
await featureLayer.load();
featureLayer.gdbVersion = "sde.AnotherVersion";
await featureLayer.refresh();
```

### Edit Session and Reconcile

```javascript
const versionIdentifier = version.versionIdentifier;

// Start editing session
await vms.startEditing({ versionIdentifier });

// Apply edits to feature layer
await featureLayer.applyEdits(edits);

// Reconcile with parent
const reconcileResult = await vms.reconcile({
  versionIdentifier: versionIdentifier,
  abortIfConflicts: false,
  conflictDetection: "by-attribute",
  conflictResolution: "favorEditVersion",
  withPost: false
});

if (!reconcileResult.hasConflicts) {
  await vms.post({ versionIdentifier });
}

// Stop editing
await vms.stopEditing({
  versionIdentifier: versionIdentifier,
  saveEdits: true
});
```

### Complete Version Workflow

```javascript
async function editInVersion(vms, featureLayer, edits) {
  const version = await vms.createVersion({
    versionName: `Edit_${Date.now()}`,
    description: "Temporary edit version",
    access: "private"
  });

  const versionIdentifier = version.versionIdentifier;

  try {
    featureLayer.gdbVersion = version.versionName;
    await featureLayer.refresh();

    await vms.startEditing({ versionIdentifier });
    await featureLayer.applyEdits(edits);

    const result = await vms.reconcile({
      versionIdentifier,
      abortIfConflicts: false,
      conflictResolution: "favorEditVersion",
      withPost: false
    });

    if (result.hasConflicts) {
      throw new Error("Conflicts detected during reconcile");
    }

    await vms.post({ versionIdentifier });
    await vms.stopEditing({ versionIdentifier, saveEdits: true });

  } finally {
    featureLayer.gdbVersion = vms.defaultVersionIdentifier;
    await featureLayer.refresh();
    await vms.deleteVersion({ versionName: version.versionName });
  }
}
```

## Related Records

### Query Related Records

```javascript
const relatedRecords = await layer.queryRelatedFeatures({
  outFields: ["*"],
  relationshipId: 0,
  objectIds: [selectedFeature.attributes.OBJECTID]
});

const results = relatedRecords[selectedFeature.attributes.OBJECTID];
results.features.forEach(related => {
  console.log("Related:", related.attributes);
});
```

## Attachments

### Enable Attachments in Editor

```javascript
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    attachmentsOnCreateEnabled: true,
    attachmentsOnUpdateEnabled: true
  }]
});
```

### Programmatic Attachment Handling

```javascript
// Query attachments
const attachments = await layer.queryAttachments({
  objectIds: [featureOID]
});

// Add attachment
const formData = new FormData();
formData.append("attachment", fileBlob, "photo.jpg");
await layer.addAttachment(featureOID, formData);

// Delete attachment
await layer.deleteAttachments(featureOID, [attachmentId]);
```

## Complete Example: Map Components

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <arcgis-map basemap="streets-navigation-vector" center="-118.805,34.027" zoom="13">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-editor slot="top-right"></arcgis-editor>
  </arcgis-map>

  <script type="module">
    const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

    const mapElement = document.querySelector("arcgis-map");
    const view = await mapElement.view;
    await view.when();

    const layer = new FeatureLayer({
      url: "https://services.arcgis.com/.../FeatureServer/0"
    });
    mapElement.map.add(layer);

    const editor = document.querySelector("arcgis-editor");
    editor.layerInfos = [{
      layer: layer,
      formTemplate: {
        title: "Edit Feature",
        elements: [
          {
            type: "group",
            label: "Details",
            elements: [
              { type: "field", fieldName: "name", label: "Name" },
              { type: "field", fieldName: "type", label: "Type" },
              { type: "field", fieldName: "status", label: "Status" }
            ]
          }
        ]
      },
      attachmentsOnCreateEnabled: true,
      attachmentsOnUpdateEnabled: true
    }];
  </script>
</body>
</html>
```

## Reference Samples

- `editor-basic` - Basic Editor component usage
- `widgets-editor-configurable` - Configurable Editor widget with layerInfos
- `widgets-editor-subtypes` - Editing with subtype group layers
- `widgets-editor-form-elements` - Form element configuration in Editor
- `editing-applyedits` - Programmatic editing with applyEdits
- `editing-groupedfeatureform` - Grouped feature form layout
- `editing-featureform-fieldvisibility` - Controlling field visibility
- `changing-version` - Switching geodatabase versions

## Common Pitfalls

1. **Editing permissions**: Calling `applyEdits` on a layer without checking edit capabilities causes silent failures.

   ```javascript
   // Anti-pattern: calling applyEdits without checking capabilities
   const layer = new FeatureLayer({ url: "https://services.arcgis.com/.../FeatureServer/0" });
   await layer.applyEdits({ addFeatures: [newFeature] });
   ```

   ```javascript
   // Correct: check capabilities before editing
   const layer = new FeatureLayer({ url: "https://services.arcgis.com/.../FeatureServer/0" });
   await layer.load();
   if (layer.editingEnabled && layer.capabilities?.editing?.supportsAddingFeatures) {
     await layer.applyEdits({ addFeatures: [newFeature] });
   } else {
     console.error("Layer does not support adding features");
   }
   ```

   **Impact:** The `applyEdits` call fails with a cryptic server error or silently returns an error result that is easy to miss.

2. **Version locking**: Editing branch-versioned data without proper session management causes version locks.

   ```javascript
   // Anti-pattern: editing without version management session
   layer.gdbVersion = "editor1.design_v1";
   await layer.applyEdits({ updateFeatures: [updatedFeature] });
   // Version remains locked, blocking other users
   ```

   ```javascript
   // Correct: use proper version management session
   await vms.startEditing({ versionIdentifier });
   layer.gdbVersion = "editor1.design_v1";
   await layer.applyEdits({ updateFeatures: [updatedFeature] });
   await vms.stopEditing({ versionIdentifier, saveEdits: true });
   ```

   **Impact:** The version stays locked after editing, preventing other users from accessing or editing it.

3. **applyEdits result checking**: Always inspect the result object for individual feature errors.

   ```javascript
   const result = await layer.applyEdits({ addFeatures: [feature1, feature2] });
   result.addFeatureResults.forEach((res) => {
     if (res.error) {
       console.error("Failed to add feature:", res.error.message);
     }
   });
   ```

4. **Form expression names**: Must reference expressions by name string, not by expression text.

   ```javascript
   expressionInfos: [{ name: "my-expr", expression: "$feature.type == 'A'" }],
   elements: [{
     visibilityExpression: "my-expr"  // String reference to name
   }]
   ```

5. **Subtype field**: Must match the subtype configuration in the service exactly.

## Related Skills

- See `arcgis-tables-forms` for FeatureTable and FormTemplate input types.
- See `arcgis-interaction` for hit testing and sketching.
- See `arcgis-layers` for FeatureLayer configuration.
- See `arcgis-core-maps` for autocasting guidance.
