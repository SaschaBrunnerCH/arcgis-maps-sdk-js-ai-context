---
name: arcgis-tables-forms
description: Configure FeatureTable for tabular data display and FormTemplate with input elements for feature editing forms.
---

# ArcGIS Tables & Forms

Use this skill for configuring FeatureTable components/widgets and FormTemplate with various input elements.

## Import Patterns

### Direct ESM Imports
```javascript
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";
import FormTemplate from "@arcgis/core/form/FormTemplate.js";
import FieldColumnTemplate from "@arcgis/core/widgets/FeatureTable/support/FieldColumnTemplate.js";
```

### Dynamic Imports (CDN)
```javascript
const FeatureTable = await $arcgis.import("@arcgis/core/widgets/FeatureTable.js");
const FeatureForm = await $arcgis.import("@arcgis/core/widgets/FeatureForm.js");
const FormTemplate = await $arcgis.import("@arcgis/core/form/FormTemplate.js");
const FieldColumnTemplate = await $arcgis.import("@arcgis/core/widgets/FeatureTable/support/FieldColumnTemplate.js");
```

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## FeatureTable Component

### Basic Usage

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>

<arcgis-feature-table reference-element="arcgis-map"></arcgis-feature-table>

<script type="module">
  const map = document.querySelector("arcgis-map");
  const table = document.querySelector("arcgis-feature-table");

  const view = await map.view;
  await view.when();

  const layer = view.map.layers.find(l => l.type === "feature");
  table.layer = layer;
</script>
```

### Key Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layer` | FeatureLayer | | The layer to display |
| `attribute-table-template` | AttributeTableTemplate | | Table configuration (new in 5.0) |
| `editing-enabled` | boolean | false | Enable inline editing |
| `filter-by-selection-enabled` | boolean | false | Filter by selected features |
| `highlight-disabled` | boolean | false | Disable row highlighting |
| `hide-header` | boolean | false | Hide the table header |
| `hide-menu` | boolean | false | Hide the table menu |
| `hide-selection-column` | boolean | false | Hide the selection column |
| `multiple-selection-disabled` | boolean | false | Disable multi-row selection |
| `multiple-sort-enabled` | boolean | false | Enable multi-column sorting |
| `page-size` | number | | Rows per page |
| `auto-save-disabled` | boolean | false | Disable auto-saving edits |
| `definition-expression` | string | | Filter expression |
| `time-zone` | string | | Time zone for dates |

#### Hide Menu Items

| Property | Description |
|----------|-------------|
| `hide-menu-items-clear-selection` | Hide clear selection menu item |
| `hide-menu-items-delete-selection` | Hide delete selection menu item |
| `hide-menu-items-export-selection-to-csv` | Hide export to CSV menu item |
| `hide-menu-items-refresh-data` | Hide refresh data menu item |
| `hide-menu-items-toggle-columns` | Hide toggle columns menu item |
| `hide-menu-items-zoom-to-selection` | Hide zoom to selection menu item |

### Key Events

| Event | Description |
|-------|-------------|
| `arcgisSelectionChange` | Fires when row selection changes |
| `arcgisCellClick` | Fires when a cell is clicked |
| `arcgisCellKeydown` | Fires on keyboard interaction in a cell |
| `arcgisCellPointerover` | Fires when pointer enters a cell |
| `arcgisCellPointerout` | Fires when pointer leaves a cell |
| `arcgisColumnReorder` | Fires when columns are reordered |
| `arcgisPropertyChange` | Fires when a property changes |
| `arcgisReady` | Fires when the component is ready |

### Component with Configuration

```html
<arcgis-feature-table
  reference-element="arcgis-map"
  editing-enabled
  multiple-sort-enabled
  page-size="50"
  hide-menu-items-delete-selection
></arcgis-feature-table>

<script type="module">
  const table = document.querySelector("arcgis-feature-table");
  table.layer = featureLayer;

  table.addEventListener("arcgisSelectionChange", (event) => {
    console.log("Selection changed");
  });
</script>
```

## FeatureTable Widget (Core API)

### Basic Widget

```javascript
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv"
});
```

### Configured Widget

```javascript
const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",
  editingEnabled: true,
  multiSortEnabled: true,
  highlightEnabled: true,
  attachmentsEnabled: true,
  relatedRecordsEnabled: true,
  pageSize: 50,
  filterGeometry: view.extent
});
```

### Column Templates

```javascript
import FieldColumnTemplate from "@arcgis/core/widgets/FeatureTable/support/FieldColumnTemplate.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  tableTemplate: {
    columnTemplates: [
      new FieldColumnTemplate({
        fieldName: "name",
        label: "Name",
        initialSortPriority: 0,
        direction: "asc"
      }),
      new FieldColumnTemplate({
        fieldName: "status",
        label: "Status"
      }),
      new FieldColumnTemplate({
        fieldName: "value",
        label: "Value ($)",
        textAlign: "right"
      })
    ]
  }
});
```

#### FieldColumnTemplate Properties

| Property | Type | Description |
|----------|------|-------------|
| `fieldName` | string | Field to display |
| `label` | string | Column header text |
| `editable` | boolean | Allow editing |
| `visible` | boolean | Column visibility |
| `frozen` | boolean | Freeze column to left |
| `frozenToEnd` | boolean | Freeze column to right |
| `resizable` | boolean | Allow column resizing |
| `autoWidth` | boolean | Auto-size column width |
| `width` | number | Column width in pixels |
| `textAlign` | string | Text alignment |
| `textWrap` | boolean | Wrap text in cells |
| `initialSortPriority` | number | Sort priority |

### Group Column Template

```javascript
import GroupColumnTemplate from "@arcgis/core/widgets/FeatureTable/support/GroupColumnTemplate.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  tableTemplate: {
    columnTemplates: [
      new GroupColumnTemplate({
        label: "Location",
        columnTemplates: [
          new FieldColumnTemplate({ fieldName: "city", label: "City" }),
          new FieldColumnTemplate({ fieldName: "state", label: "State" }),
          new FieldColumnTemplate({ fieldName: "country", label: "Country" })
        ]
      }),
      new GroupColumnTemplate({
        label: "Details",
        columnTemplates: [
          new FieldColumnTemplate({ fieldName: "name", label: "Name" }),
          new FieldColumnTemplate({ fieldName: "type", label: "Type" })
        ]
      })
    ]
  }
});
```

## AttributeTableTemplate (New in 5.0)

Configure table display using `AttributeTableTemplate`, which can be set on a layer or on the feature table component.

```javascript
import AttributeTableTemplate from "@arcgis/core/tables/AttributeTableTemplate.js";

const tableTemplate = new AttributeTableTemplate({
  elements: [
    {
      type: "field",
      fieldName: "name",
      label: "Name"
    },
    {
      type: "field",
      fieldName: "status",
      label: "Status"
    },
    {
      type: "group",
      label: "Location",
      elements: [
        { type: "field", fieldName: "city", label: "City" },
        { type: "field", fieldName: "state", label: "State" }
      ]
    }
  ],
  orderByFields: [
    { field: "name", order: "asc" }
  ]
});

// Set on the feature table component
const table = document.querySelector("arcgis-feature-table");
table.attributeTableTemplate = tableTemplate;

// Or set on the layer
featureLayer.attributeTableTemplate = tableTemplate;
```

### AttributeTableTemplate Element Types

| Type | Class | Description |
|------|-------|-------------|
| `field` | AttributeTableFieldElement | Individual field column |
| `group` | AttributeTableGroupElement | Group of columns |
| `relationship` | AttributeTableRelationshipElement | Related records |
| `attachment` | AttributeTableAttachmentElement | Attachment column |

## Selection and Highlighting

### Programmatic Selection

```javascript
// Select by ObjectIDs
featureTable.highlightIds.add(123);
featureTable.highlightIds.addMany([124, 125, 126]);

// Clear selection
featureTable.highlightIds.removeAll();

// Select from query
const results = await featureLayer.queryObjectIds({
  where: "status = 'active'"
});
featureTable.highlightIds.addMany(results);
```

### Watch Selection Changes

```javascript
featureTable.highlightIds.on("change", (event) => {
  console.log("Added IDs:", event.added);
  console.log("Removed IDs:", event.removed);

  const selectedIds = featureTable.highlightIds.toArray();
  console.log("All selected:", selectedIds);
});
```

### Sync with Map Selection

```javascript
// Map click selects in table
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  const feature = response.results.find(r => r.graphic.layer === featureLayer);

  if (feature) {
    featureTable.highlightIds.removeAll();
    featureTable.highlightIds.add(feature.graphic.attributes.OBJECTID);
  }
});

// Table selection highlights on map
let highlightHandle;

featureTable.highlightIds.on("change", async () => {
  const layerView = await view.whenLayerView(featureLayer);

  if (highlightHandle) {
    highlightHandle.remove();
  }

  const objectIds = featureTable.highlightIds.toArray();
  if (objectIds.length > 0) {
    highlightHandle = layerView.highlight(objectIds);
  }
});
```

### Filter and Refresh

```javascript
// Filter by geometry
featureTable.filterGeometry = view.extent;

// Filter by expression
featureTable.layer.definitionExpression = "category = 'A'";

// Refresh data
featureTable.refresh();

// Clear filters
featureTable.filterGeometry = null;
featureTable.layer.definitionExpression = null;
```

## FormTemplate

Configure edit forms for features.

### Basic FormTemplate

```javascript
import FormTemplate from "@arcgis/core/form/FormTemplate.js";

const formTemplate = new FormTemplate({
  title: "Edit Feature",
  description: "Update the feature attributes",
  elements: [
    {
      type: "field",
      fieldName: "name",
      label: "Name"
    },
    {
      type: "field",
      fieldName: "category",
      label: "Category"
    },
    {
      type: "field",
      fieldName: "description",
      label: "Description"
    }
  ]
});

featureLayer.formTemplate = formTemplate;
```

### FormTemplate Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Form title |
| `description` | string | Form description |
| `elements` | FormElement[] | Array of form elements |
| `expressionInfos` | ExpressionInfo[] | Arcade expression definitions |
| `preserveFieldValuesWhenHidden` | boolean | Keep hidden field values |

### Form Element Types

| Type | Description |
|------|-------------|
| `field` | FieldElement - Edit a specific field |
| `group` | GroupElement - Group of elements |
| `text` | TextElement - Static text/HTML content |
| `relationship` | RelationshipElement - Related records |
| `attachment` | AttachmentElement - File attachments |

### Field Elements

```javascript
{
  type: "field",
  fieldName: "name",
  label: "Name",
  description: "Enter the feature name",
  hint: "Required field",
  requiredExpression: "always-required",
  editableExpression: "$feature.status != 'locked'",
  visibilityExpression: "$feature.type != 'hidden'"
}
```

### Group Elements

```javascript
{
  type: "group",
  label: "Location",
  description: "Address information",
  initialState: "collapsed",  // expanded, collapsed
  elements: [
    { type: "field", fieldName: "address", label: "Address" },
    { type: "field", fieldName: "city", label: "City" },
    { type: "field", fieldName: "state", label: "State" }
  ]
}
```

### Text Elements

```javascript
{
  type: "text",
  text: "<h3>Important Instructions</h3><p>Please fill out all required fields.</p>"
}
```

### Relationship Elements

```javascript
{
  type: "relationship",
  relationshipId: 0,
  label: "Related Inspections",
  description: "View and manage related inspection records",
  displayCount: 5,
  orderByFields: [{
    field: "inspection_date",
    order: "desc"
  }],
  editableExpression: "true"
}
```

## Input Types

### TextBox Input
```javascript
{
  type: "field",
  fieldName: "name",
  label: "Name",
  input: {
    type: "text-box",
    maxLength: 100,
    minLength: 1
  }
}
```

### TextArea Input
```javascript
{
  type: "field",
  fieldName: "description",
  label: "Description",
  input: {
    type: "text-area",
    maxLength: 1000,
    minLength: 0
  }
}
```

### ComboBox Input
```javascript
{
  type: "field",
  fieldName: "category",
  label: "Category",
  input: {
    type: "combo-box",
    showNoValueOption: true,
    noValueOptionLabel: "Select a category..."
  }
}
// Works with coded value domains - values auto-populate from domain
```

### Radio Buttons Input
```javascript
{
  type: "field",
  fieldName: "priority",
  label: "Priority",
  input: {
    type: "radio-buttons",
    showNoValueOption: false
  }
}
```

### Switch Input
```javascript
{
  type: "field",
  fieldName: "is_active",
  label: "Active",
  input: {
    type: "switch",
    offValue: 0,
    onValue: 1
  }
}
```

### DatePicker Input
```javascript
{
  type: "field",
  fieldName: "start_date",
  label: "Start Date",
  input: {
    type: "date-picker",
    min: new Date("2020-01-01"),
    max: new Date("2030-12-31"),
    includeTime: false
  }
}
```

### DateTimePicker Input
```javascript
{
  type: "field",
  fieldName: "event_datetime",
  label: "Event Date/Time",
  input: {
    type: "datetime-picker",
    min: new Date("2020-01-01T00:00:00"),
    max: new Date("2030-12-31T23:59:59"),
    includeTime: true
  }
}
```

### TimePicker Input
```javascript
{
  type: "field",
  fieldName: "event_time",
  label: "Event Time",
  input: {
    type: "time-picker"
  }
}
```

### Barcode Scanner Input
```javascript
{
  type: "field",
  fieldName: "barcode",
  label: "Barcode",
  input: {
    type: "barcode-scanner"
  }
}
```

## Expression-Based Configuration

### Visibility Expressions

```javascript
const formTemplate = new FormTemplate({
  expressionInfos: [
    {
      name: "show-commercial-fields",
      expression: "$feature.property_type == 'commercial'"
    },
    {
      name: "show-residential-fields",
      expression: "$feature.property_type == 'residential'"
    }
  ],
  elements: [
    { type: "field", fieldName: "property_type", label: "Property Type" },
    {
      type: "group",
      label: "Commercial Details",
      visibilityExpression: "show-commercial-fields",
      elements: [
        { type: "field", fieldName: "business_name", label: "Business Name" },
        { type: "field", fieldName: "num_employees", label: "Employees" }
      ]
    },
    {
      type: "group",
      label: "Residential Details",
      visibilityExpression: "show-residential-fields",
      elements: [
        { type: "field", fieldName: "num_bedrooms", label: "Bedrooms" },
        { type: "field", fieldName: "num_bathrooms", label: "Bathrooms" }
      ]
    }
  ]
});
```

### Required and Editable Expressions

```javascript
// Conditionally required
{
  type: "field",
  fieldName: "inspection_notes",
  label: "Inspection Notes",
  requiredExpression: "notes-required"
}

// Conditionally editable
{
  type: "field",
  fieldName: "approved_by",
  label: "Approved By",
  editableExpression: "is-pending"
}
```

## FeatureForm Widget

```javascript
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js";

const featureForm = new FeatureForm({
  container: "formDiv",
  layer: featureLayer,
  formTemplate: formTemplate
});

// Set feature to edit
featureForm.feature = selectedGraphic;

// Listen for submit
featureForm.on("submit", () => {
  if (featureForm.feature) {
    const updated = featureForm.getValues();

    featureLayer.applyEdits({
      updateFeatures: [{
        attributes: {
          ...featureForm.feature.attributes,
          ...updated
        },
        geometry: featureForm.feature.geometry
      }]
    });
  }
});

// Handle value changes
featureForm.on("value-change", (event) => {
  console.log(`${event.fieldName} changed to ${event.value}`);
});
```

## Complete Example: FeatureTable with Map

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://js.arcgis.com/5.0/"></script>
  <script type="module" src="https://js.arcgis.com/5.0/map-components/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
    #container { display: flex; flex-direction: column; height: 100%; }
    arcgis-map { flex: 1; }
    #tableDiv { height: 300px; }
  </style>
</head>
<body>
  <div id="container">
    <arcgis-map basemap="streets-navigation-vector" center="-118.805,34.027" zoom="11">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
    </arcgis-map>
    <arcgis-feature-table reference-element="arcgis-map" editing-enabled></arcgis-feature-table>
  </div>

  <script type="module">
    const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

    const mapElement = document.querySelector("arcgis-map");
    const view = await mapElement.view;
    await view.when();

    const featureLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
    });
    mapElement.map.add(featureLayer);

    const table = document.querySelector("arcgis-feature-table");
    table.layer = featureLayer;

    // Highlight table selection on map
    let highlightHandle;

    table.addEventListener("arcgisSelectionChange", async () => {
      const layerView = await view.whenLayerView(featureLayer);

      if (highlightHandle) {
        highlightHandle.remove();
      }

      const objectIds = table.highlightIds?.toArray();
      if (objectIds && objectIds.length > 0) {
        highlightHandle = layerView.highlight(objectIds);
      }
    });
  </script>
</body>
</html>
```

## Complete Example: FormTemplate with Editor

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
        title: "Property Information",
        description: "Enter property details",
        preserveFieldValuesWhenHidden: true,
        expressionInfos: [{
          name: "is-commercial",
          expression: "$feature.type == 'commercial'"
        }],
        elements: [
          {
            type: "field",
            fieldName: "name",
            label: "Property Name",
            input: { type: "text-box", maxLength: 100 }
          },
          {
            type: "field",
            fieldName: "type",
            label: "Property Type",
            input: { type: "combo-box" }
          },
          {
            type: "group",
            label: "Commercial Details",
            visibilityExpression: "is-commercial",
            elements: [
              { type: "field", fieldName: "business_type", label: "Business Type" },
              { type: "field", fieldName: "sqft", label: "Square Footage" }
            ]
          },
          {
            type: "field",
            fieldName: "inspection_date",
            label: "Last Inspection",
            input: { type: "date-picker" }
          },
          {
            type: "field",
            fieldName: "notes",
            label: "Notes",
            input: { type: "text-area", maxLength: 500 }
          }
        ]
      }
    }];
  </script>
</body>
</html>
```

## Reference Samples

- `feature-table` - FeatureTable component usage
- `widgets-featuretable-editing` - Editing with FeatureTable
- `widgets-featuretable-map` - FeatureTable with map integration
- `widgets-featuretable-relates` - FeatureTable with related records
- `editing-groupedfeatureform` - Grouped feature form layout
- `editing-featureform-fieldvisibility` - Controlling field visibility in forms

## Common Pitfalls

1. **Field names must match**: `fieldName` must exactly match the layer field name (case-sensitive).
   ```javascript
   // Layer has field "PropertyName"
   { fieldName: "PropertyName" }  // Correct
   { fieldName: "propertyname" }  // Wrong - case sensitive
   ```

2. **Coded value domains**: ComboBox automatically populates from domain values.
   ```javascript
   // If field has coded value domain, values come from domain
   { type: "field", fieldName: "status", input: { type: "combo-box" } }
   // Dropdown shows domain values automatically - no manual options needed
   ```

3. **Expression names**: Reference expressions by name string, not expression text.
   ```javascript
   expressionInfos: [{ name: "my-expr", expression: "..." }],
   elements: [{
     visibilityExpression: "my-expr"  // String reference to name
   }]
   ```

4. **Layer must be editable**: Check capabilities before enabling editing.
   ```javascript
   await layer.load();
   if (layer.capabilities?.editing?.supportsUpdateByOthers) {
     featureTable.editingEnabled = true;
   }
   ```

5. **Container size**: FeatureTable widget needs explicit height on its container.
   ```css
   #tableDiv {
     height: 400px;  /* Required - table won't render without explicit height */
     width: 100%;
   }
   ```

6. **Highlight ID type**: `highlightIds` expects ObjectID numbers, not strings.
   ```javascript
   featureTable.highlightIds.add(123);      // Correct - number
   featureTable.highlightIds.add("123");    // Wrong - string
   ```

## Related Skills

- See `arcgis-editing` for Editor configuration, applyEdits, and versioning.
- See `arcgis-popup-templates` for PopupTemplate configuration.
- See `arcgis-interaction` for hit testing and map selection.
- See `arcgis-layers` for FeatureLayer configuration.
