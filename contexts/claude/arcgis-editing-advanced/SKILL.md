---
name: arcgis-editing-advanced
description: Advanced editing features including subtypes, feature forms, versioning, and configurable editors. Use for complex data entry workflows.
---

# ArcGIS Advanced Editing

Use this skill for advanced editing features including subtypes, forms, versioning, and editor configuration.

> **Note:** For basic editing, use the `arcgis-editor` component. This skill covers advanced configurations that require the Core API.

## Editor Component (Basic)

```html
<arcgis-map item-id="YOUR_EDITABLE_WEBMAP_ID">
  <arcgis-editor slot="top-right"></arcgis-editor>
</arcgis-map>
```

## Editor Configuration (Advanced)

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
    // Enable/disable operations
    addEnabled: true,
    updateEnabled: true,
    deleteEnabled: false
  }]
});

view.ui.add(editor, "top-right");
```

### Editor with Field Configuration
```javascript
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    fieldConfig: [
      {
        name: "status",
        label: "Status",
        editable: true,
        required: true
      },
      {
        name: "created_date",
        label: "Created",
        editable: false  // Read-only
      },
      {
        name: "comments",
        label: "Comments",
        editable: true,
        maxLength: 500
      }
    ]
  }]
});
```

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
  ],
  expressionInfos: [{
    name: "type-requires-subtype",
    expression: "$feature.type == 'complex'"
  }]
};
```

## Subtypes

### Working with Subtypes
```javascript
// Layer with subtypes
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0"
});

await layer.load();

// Get subtype info
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
    // Editor automatically handles subtypes
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

console.log("Default version:", vms.defaultVersionName);
console.log("Supports versioning:", vms.supportsVersioning);
```

### Get Version Information

```javascript
// Get all versions
const versions = await vms.getVersionInfos();
versions.forEach(v => {
  console.log("Version:", v.versionName);
  console.log("  Owner:", v.versionOwner);
  console.log("  Description:", v.description);
  console.log("  Access:", v.access);  // public, protected, private
  console.log("  Parent:", v.parentVersionName);
  console.log("  Created:", v.creationDate);
  console.log("  Modified:", v.modifiedDate);
});

// Get specific version info
const versionInfo = await vms.getVersionInfo({
  versionName: "sde.MyVersion"
});
```

### Create Version

```javascript
// Create new version
const newVersion = await vms.createVersion({
  versionName: "MyEditVersion",
  description: "Version for editing project X",
  access: "private",  // public, protected, private
  parentVersionName: "sde.DEFAULT"  // Optional, defaults to DEFAULT
});

console.log("Created version:", newVersion.versionName);
console.log("Version GUID:", newVersion.versionGuid);
```

### Delete Version

```javascript
// Delete a version (must be owner or admin)
await vms.deleteVersion({
  versionName: "sde.MyEditVersion"
});
```

### Alter Version

```javascript
// Modify version properties
await vms.alterVersion({
  versionName: "sde.MyEditVersion",
  description: "Updated description",
  access: "protected",  // Change access level
  ownerName: "newOwner"  // Transfer ownership (admin only)
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

// Switch all layers in map
map.layers.forEach(layer => {
  if (layer.gdbVersion !== undefined) {
    layer.gdbVersion = "sde.MyEditVersion";
    layer.refresh();
  }
});
```

### Start/Stop Edit Session

```javascript
// Start editing session
const session = await vms.startReading({
  versionName: "sde.MyEditVersion"
});
const sessionId = session.sessionId;

// For write access
const writeSession = await vms.startEditing({
  versionName: "sde.MyEditVersion"
});

// Stop session when done
await vms.stopEditing({
  sessionId: sessionId,
  saveEdits: true  // or false to discard
});
```

### Version Reconcile and Post

```javascript
// Reconcile version with parent
const reconcileResult = await vms.reconcile({
  sessionId: sessionId,
  abortIfConflicts: false,
  conflictDetection: "byAttribute",  // byAttribute, byObject
  withPost: false,
  conflictResolution: "favorEditVersion"  // favorEditVersion, favorTargetVersion
});

console.log("Has conflicts:", reconcileResult.hasConflicts);
console.log("Conflicts removed:", reconcileResult.conflictsRemoved);

if (!reconcileResult.hasConflicts) {
  // Post changes to parent version
  await vms.post({ sessionId });
  console.log("Changes posted successfully");
}
```

### Conflict Detection and Resolution

```javascript
// Check for conflicts before reconcile
const conflictResult = await vms.reconcile({
  sessionId: sessionId,
  abortIfConflicts: true,  // Stop if conflicts found
  conflictDetection: "byAttribute"
});

if (conflictResult.hasConflicts) {
  // Get conflict details
  console.log("Conflicts found, manual resolution needed");

  // Resolve conflicts by favoring edit version
  const resolveResult = await vms.reconcile({
    sessionId: sessionId,
    abortIfConflicts: false,
    conflictResolution: "favorEditVersion",
    withPost: true
  });
}
```

### Version Differences

```javascript
// Get differences between versions
const differences = await vms.getVersionDifferences({
  sessionId: sessionId,
  fromMoment: "commonAncestor",  // commonAncestor, now
  layers: ["0", "1"]  // Layer IDs to compare
});

differences.forEach(diff => {
  console.log("Layer:", diff.layerId);
  console.log("Inserts:", diff.inserts);
  console.log("Updates:", diff.updates);
  console.log("Deletes:", diff.deletes);
});
```

### Version Lock Management

```javascript
// Get lock status
const lockInfo = await vms.getLockInfo({
  versionName: "sde.MyEditVersion"
});

console.log("Is locked:", lockInfo.isLocked);
console.log("Locked by:", lockInfo.lockOwner);
console.log("Lock type:", lockInfo.lockType);

// Acquire exclusive lock
await vms.acquireLock({
  versionName: "sde.MyEditVersion",
  lockType: "exclusive"  // shared, exclusive
});

// Release lock
await vms.releaseLock({
  versionName: "sde.MyEditVersion"
});
```

### Validate Network Topology

```javascript
// For utility networks - validate topology after edits
const validateResult = await vms.validateNetworkTopology({
  sessionId: sessionId,
  validateArea: extent,  // Optional extent to validate
  validationType: "normal"  // normal, rebuild
});

console.log("Validation success:", validateResult.success);
console.log("Dirty areas remaining:", validateResult.dirtyAreaCount);
```

### Complete Version Workflow

```javascript
async function editInVersion(vms, featureLayer, edits) {
  // 1. Create version
  const version = await vms.createVersion({
    versionName: `Edit_${Date.now()}`,
    description: "Temporary edit version",
    access: "private"
  });

  try {
    // 2. Switch layer to version
    featureLayer.gdbVersion = version.versionName;
    await featureLayer.refresh();

    // 3. Start edit session
    const session = await vms.startEditing({
      versionName: version.versionName
    });

    // 4. Apply edits
    await featureLayer.applyEdits(edits);

    // 5. Reconcile with parent
    const reconcileResult = await vms.reconcile({
      sessionId: session.sessionId,
      abortIfConflicts: false,
      conflictResolution: "favorEditVersion",
      withPost: false
    });

    if (reconcileResult.hasConflicts) {
      throw new Error("Conflicts detected during reconcile");
    }

    // 6. Post to parent
    await vms.post({ sessionId: session.sessionId });

    // 7. Stop editing
    await vms.stopEditing({
      sessionId: session.sessionId,
      saveEdits: true
    });

    console.log("Edits posted successfully");

  } finally {
    // 8. Switch back to default and delete temp version
    featureLayer.gdbVersion = vms.defaultVersionName;
    await featureLayer.refresh();

    await vms.deleteVersion({
      versionName: version.versionName
    });
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

relatedRecords[selectedObjectId].features.forEach(related => {
  console.log("Related:", related.attributes);
});
```

### Edit Related Records in Form
```javascript
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: parentLayer,
    // Include related tables
    relatedTableInfos: [{
      layer: relatedTable,
      addEnabled: true,
      updateEnabled: true,
      deleteEnabled: true
    }]
  }]
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

## Validation

### Form Validation
```javascript
const form = new FeatureForm({
  layer: featureLayer,
  formTemplate: {
    elements: [{
      type: "field",
      fieldName: "email",
      label: "Email",
      validationExpression: {
        expression: `
          var email = $feature.email;
          return IIf(Find("@", email) > 0, true, { valid: false, errorMessage: "Invalid email" });
        `
      }
    }]
  }
});

// Check validity before submit
if (form.valid) {
  // Submit
} else {
  // Show validation errors
}
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://js.arcgis.com/4.34/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/4.34/"></script>
  <style>
    html, body, #viewDiv { height: 100%; margin: 0; }
    #formPanel { position: absolute; top: 10px; right: 10px; width: 300px; }
  </style>
  <script type="module">
    import Map from "@arcgis/core/Map.js";
    import MapView from "@arcgis/core/views/MapView.js";
    import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
    import Editor from "@arcgis/core/widgets/Editor.js";

    const layer = new FeatureLayer({
      url: "https://services.arcgis.com/.../FeatureServer/0"
    });

    const map = new Map({
      basemap: "streets-navigation-vector",
      layers: [layer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map
    });

    const editor = new Editor({
      view: view,
      layerInfos: [{
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
      }]
    });

    view.ui.add(editor, "top-right");
  </script>
</head>
<body>
  <div id="viewDiv"></div>
</body>
</html>
```

## TypeScript Usage

Form elements use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety in editor configurations
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    formTemplate: {
      title: "Feature Details",
      elements: [
        { type: "field", fieldName: "name" },
        { type: "field", fieldName: "category" }
      ]
    } as const
  }]
});
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Common Pitfalls

1. **Editing permissions**: User must have edit permissions on the layer

2. **Subtype field**: Must match the subtype configuration in the service

3. **Version locking**: Branch versions may lock during editing sessions

4. **Validation expressions**: Must return true/false or error object

5. **Related records**: Require proper relationship configuration in service

