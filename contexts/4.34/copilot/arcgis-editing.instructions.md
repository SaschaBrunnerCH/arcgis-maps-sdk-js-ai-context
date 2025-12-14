---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Editing

## Editor Component

```html
<arcgis-map item-id="YOUR_EDITABLE_WEBMAP_ID">
  <arcgis-editor slot="top-right"></arcgis-editor>
</arcgis-map>
```

## Editor Widget (Core API)

```javascript
import Editor from "@arcgis/core/widgets/Editor.js";

const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    formTemplate: {
      title: "Feature Details",
      elements: [
        { type: "field", fieldName: "name", label: "Name" },
        { type: "field", fieldName: "category", label: "Category" }
      ]
    },
    addEnabled: true,
    updateEnabled: true,
    deleteEnabled: false
  }]
});

view.ui.add(editor, "top-right");
```

## Feature Form

```javascript
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";

const form = new FeatureForm({
  container: "formDiv",
  layer: featureLayer,
  formTemplate: {
    title: "Edit Feature",
    elements: [
      { type: "field", fieldName: "name" },
      {
        type: "group",
        label: "Location",
        elements: [
          { type: "field", fieldName: "address" },
          { type: "field", fieldName: "city" }
        ]
      }
    ]
  }
});

form.feature = graphic;

form.on("submit", async () => {
  if (form.valid) {
    const values = form.getValues();
    graphic.attributes = { ...graphic.attributes, ...values };
    await layer.applyEdits({ updateFeatures: [graphic] });
  }
});
```

## Apply Edits Programmatically

```javascript
// Add features
await layer.applyEdits({
  addFeatures: [newGraphic1, newGraphic2]
});

// Update features
await layer.applyEdits({
  updateFeatures: [updatedGraphic]
});

// Delete features
await layer.applyEdits({
  deleteFeatures: [{ objectId: 123 }]
});
```

## Sketch Widget

```html
<arcgis-map basemap="streets-vector">
  <arcgis-sketch slot="top-right"></arcgis-sketch>
</arcgis-map>
```

```javascript
import Sketch from "@arcgis/core/widgets/Sketch.js";

const sketch = new Sketch({
  view: view,
  layer: graphicsLayer,
  creationMode: "update"
});

sketch.on("create", (event) => {
  if (event.state === "complete") {
    console.log("Created:", event.graphic);
  }
});
```

## SketchViewModel

```javascript
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";

const sketchVM = new SketchViewModel({
  view: view,
  layer: graphicsLayer,
  pointSymbol: { type: "simple-marker", color: "red" },
  polylineSymbol: { type: "simple-line", color: "blue" },
  polygonSymbol: { type: "simple-fill", color: [255, 255, 0, 0.5] }
});

sketchVM.create("polygon");

sketchVM.on("create", (event) => {
  if (event.state === "complete") {
    console.log("Geometry:", event.graphic.geometry);
  }
});
```

## Snapping

```javascript
sketchVM.snappingOptions = {
  enabled: true,
  featureSources: [{ layer: featureLayer }],
  selfEnabled: true
};
```

## Attachments

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

## Versioning (Branch Versioning)

```javascript
import VersionManagementService from "@arcgis/core/versionManagement/VersionManagementService.js";

const vms = new VersionManagementService({
  url: "https://services.arcgis.com/.../VersionManagementServer"
});

await vms.load();

// Create version
const version = await vms.createVersion({
  versionName: "MyEditVersion",
  access: "private"
});

// Switch layer to version
layer.gdbVersion = version.versionName;
await layer.refresh();

// Reconcile and post
const session = await vms.startEditing({ versionName: version.versionName });
await layer.applyEdits(edits);
await vms.reconcile({ sessionId: session.sessionId, withPost: true });
await vms.stopEditing({ sessionId: session.sessionId, saveEdits: true });
```

## Form Validation

```javascript
const form = new FeatureForm({
  layer: featureLayer,
  formTemplate: {
    elements: [{
      type: "field",
      fieldName: "email",
      validationExpression: {
        expression: `
          var email = $feature.email;
          return IIf(Find("@", email) > 0, true,
            { valid: false, errorMessage: "Invalid email" });
        `
      }
    }]
  }
});
```

## Expression-Based Visibility

```javascript
const formTemplate = {
  elements: [
    { type: "field", fieldName: "type" },
    {
      type: "field",
      fieldName: "subtype",
      visibilityExpression: "show-subtype"
    }
  ],
  expressionInfos: [{
    name: "show-subtype",
    expression: "$feature.type == 'complex'"
  }]
};
```

## Related Records

```javascript
const related = await layer.queryRelatedFeatures({
  outFields: ["*"],
  relationshipId: 0,
  objectIds: [selectedFeature.attributes.OBJECTID]
});

// Edit related in Editor
const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: parentLayer,
    relatedTableInfos: [{
      layer: relatedTable,
      addEnabled: true
    }]
  }]
});
```

## Common Pitfalls

1. **Editing permissions** - User must have edit permissions
2. **Subtype field** - Must match service configuration
3. **Version locking** - Versions may lock during editing
4. **Validation expressions** - Must return true/false or error object
