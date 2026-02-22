---
name: arcgis-tables-forms
description: Configure FeatureTable widget and FormTemplate with input elements. Use for displaying attribute data in tables, customizing edit forms, and configuring field inputs.
---

# ArcGIS Tables & Forms

Use this skill for configuring FeatureTable widgets and FormTemplate with various input elements.

## FeatureTable

Display feature attributes in an interactive table.

### FeatureTable Component

```html
<arcgis-map item-id="YOUR_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
</arcgis-map>

<arcgis-feature-table reference-element="arcgis-map"></arcgis-feature-table>

<script type="module">
  const map = document.querySelector("arcgis-map");
  const table = document.querySelector("arcgis-feature-table");

  await map.viewOnReady();

  // Set the layer for the table
  const layer = map.view.map.layers.find(l => l.type === "feature");
  table.layer = layer;
</script>
```

### FeatureTable Widget (Core API)

```javascript
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv"
});
```

### FeatureTable Configuration

```javascript
const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",

  // Display options
  visibleElements: {
    header: true,
    menu: true,
    menuItems: {
      clearSelection: true,
      refreshData: true,
      toggleColumns: true,
      selectedRecordsShowAllToggle: true,
      selectedRecordsShowSelectedToggle: true,
      zoomToSelection: true
    },
    selectionColumn: true,
    columnMenus: true
  },

  // Table behavior
  multiSortEnabled: true,
  editingEnabled: true,
  highlightEnabled: true,
  attachmentsEnabled: true,
  relatedRecordsEnabled: true,

  // Pagination
  pageSize: 50,

  // Initial state
  filterGeometry: view.extent,  // Only show features in view
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
        sortable: true,
        initialSortPriority: 0,
        direction: "asc"
      }),
      new FieldColumnTemplate({
        fieldName: "status",
        label: "Status",
        menuConfig: {
          items: [{
            label: "Custom Action",
            iconClass: "esri-icon-settings",
            clickFunction: (event) => {
              console.log("Custom action on:", event.feature);
            }
          }]
        }
      }),
      new FieldColumnTemplate({
        fieldName: "value",
        label: "Value ($)",
        textAlign: "right",
        formatFunction: (info) => {
          return `$${info.value.toLocaleString()}`;
        }
      })
    ]
  }
});
```

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

### FeatureTable Events

```javascript
// Watch for selection changes using highlightIds
featureTable.highlightIds.on("change", (event) => {
  console.log("Added IDs:", event.added);
  console.log("Removed IDs:", event.removed);

  const selectedIds = featureTable.highlightIds.toArray();
  console.log("All selected:", selectedIds);
});
```

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

### Sync with Map Selection

```javascript
// Map click selects in table
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  const feature = response.results.find(r => r.layer === featureLayer);

  if (feature) {
    featureTable.highlightIds.removeAll();
    featureTable.highlightIds.add(feature.graphic.attributes.OBJECTID);
  }
});

// Table selection highlights on map
featureTable.highlightIds.on("change", async (event) => {
  const layerView = await view.whenLayerView(featureLayer);

  if (highlightHandle) {
    highlightHandle.remove();
  }

  const objectIds = featureTable.highlightIds.toArray();
  if (objectIds.length > 0) {
    const query = featureLayer.createQuery();
    query.objectIds = objectIds;
    const results = await featureLayer.queryFeatures(query);
    highlightHandle = layerView.highlight(results.features);
  }
});
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

### Field Elements

```javascript
import FieldElement from "@arcgis/core/form/elements/FieldElement.js";

const fieldElement = new FieldElement({
  fieldName: "name",
  label: "Name",
  description: "Enter the feature name",
  hint: "Required field",
  requiredExpression: "true",
  editableExpression: "$feature.status != 'locked'",
  visibilityExpression: "$feature.type != 'hidden'"
});
```

### Group Elements

```javascript
import GroupElement from "@arcgis/core/form/elements/GroupElement.js";

const formTemplate = new FormTemplate({
  elements: [
    new GroupElement({
      label: "Basic Information",
      description: "Enter basic details",
      elements: [
        { type: "field", fieldName: "name", label: "Name" },
        { type: "field", fieldName: "type", label: "Type" }
      ]
    }),
    new GroupElement({
      label: "Location",
      initialState: "collapsed",  // expanded, collapsed
      elements: [
        { type: "field", fieldName: "address", label: "Address" },
        { type: "field", fieldName: "city", label: "City" },
        { type: "field", fieldName: "state", label: "State" }
      ]
    })
  ]
});
```

### Text Elements

```javascript
import TextElement from "@arcgis/core/form/elements/TextElement.js";

const formTemplate = new FormTemplate({
  elements: [
    new TextElement({
      type: "text",
      text: "<h3>Important Instructions</h3><p>Please fill out all required fields.</p>"
    }),
    { type: "field", fieldName: "name", label: "Name" },
    new TextElement({
      text: "<hr><small>Fields below are optional</small>"
    }),
    { type: "field", fieldName: "notes", label: "Notes" }
  ]
});
```

### Relationship Elements

```javascript
import RelationshipElement from "@arcgis/core/form/elements/RelationshipElement.js";

const formTemplate = new FormTemplate({
  elements: [
    { type: "field", fieldName: "name", label: "Name" },
    new RelationshipElement({
      relationshipId: 0,
      label: "Related Inspections",
      description: "View and manage related inspection records",
      displayCount: 5,
      orderByFields: [{
        field: "inspection_date",
        order: "desc"
      }],
      editableExpression: "true"
    })
  ]
});
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

// Works with coded value domains
// Domain values automatically populate the combo box
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

### Required Expressions

```javascript
{
  type: "field",
  fieldName: "inspection_notes",
  label: "Inspection Notes",
  requiredExpression: "$feature.inspection_result == 'failed'"
}
```

### Editable Expressions

```javascript
{
  type: "field",
  fieldName: "approved_by",
  label: "Approved By",
  editableExpression: "$feature.status == 'pending'"
}
```

## FeatureForm Widget

Widget for editing feature attributes.

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

## AttributeTableTemplate

Configure attribute table in Editor widget.

```javascript
import AttributeTableTemplate from "@arcgis/core/form/support/AttributeTableTemplate.js";
import AttributeTableFieldElement from "@arcgis/core/form/support/AttributeTableFieldElement.js";

const tableTemplate = new AttributeTableTemplate({
  elements: [
    new AttributeTableFieldElement({
      fieldName: "name",
      label: "Name",
      editable: true
    }),
    new AttributeTableFieldElement({
      fieldName: "status",
      label: "Status",
      editable: true
    })
  ]
});
```

## Editor Widget Integration

```javascript
import Editor from "@arcgis/core/widgets/Editor.js";

const editor = new Editor({
  view: view,
  layerInfos: [{
    layer: featureLayer,
    formTemplate: formTemplate,
    enabled: true,
    addEnabled: true,
    updateEnabled: true,
    deleteEnabled: true
  }]
});

view.ui.add(editor, "top-right");
```

## Common Patterns

### Complete Form Setup

```javascript
const formTemplate = new FormTemplate({
  title: "Property Information",
  description: "Enter property details",
  preserveFieldValuesWhenHidden: true,
  expressionInfos: [
    {
      name: "is-commercial",
      expression: "$feature.type == 'commercial'"
    }
  ],
  elements: [
    // Header text
    {
      type: "text",
      text: "<b>Basic Information</b>"
    },
    // Required field
    {
      type: "field",
      fieldName: "name",
      label: "Property Name",
      requiredExpression: "true",
      input: { type: "text-box", maxLength: 100 }
    },
    // Dropdown
    {
      type: "field",
      fieldName: "type",
      label: "Property Type",
      input: { type: "combo-box" }
    },
    // Conditional group
    {
      type: "group",
      label: "Commercial Details",
      visibilityExpression: "is-commercial",
      elements: [
        { type: "field", fieldName: "business_type", label: "Business Type" },
        { type: "field", fieldName: "sqft", label: "Square Footage" }
      ]
    },
    // Date field
    {
      type: "field",
      fieldName: "inspection_date",
      label: "Last Inspection",
      input: { type: "date-picker" }
    },
    // Long text
    {
      type: "field",
      fieldName: "notes",
      label: "Notes",
      input: { type: "text-area", maxLength: 500 }
    }
  ]
});
```

### FeatureTable with Editing

```javascript
import FieldColumnTemplate from "@arcgis/core/widgets/FeatureTable/support/FieldColumnTemplate.js";

const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",
  editingEnabled: true,
  tableTemplate: {
    columnTemplates: [
      new FieldColumnTemplate({
        fieldName: "name",
        label: "Name"
      }),
      new FieldColumnTemplate({
        fieldName: "status",
        label: "Status"
      }),
      new FieldColumnTemplate({
        fieldName: "created_date",
        label: "Created"
      })
    ]
  }
});
```

### Responsive Table Layout

```javascript
const featureTable = new FeatureTable({
  view: view,
  layer: featureLayer,
  container: "tableDiv",
  autoRefreshEnabled: true,
  pageSize: 25
});

// Resize handling
window.addEventListener("resize", () => {
  featureTable.refresh();
});

// Toggle visibility
function toggleTable(visible) {
  document.getElementById("tableDiv").style.display = visible ? "block" : "none";
  if (visible) {
    featureTable.refresh();
  }
}
```

## TypeScript Usage

Form elements use autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety in form templates
const formTemplate = {
  title: "Edit Feature",
  elements: [
    {
      type: "field",
      fieldName: "name",
      label: "Name"
    },
    {
      type: "group",
      label: "Address",
      elements: [
        { type: "field", fieldName: "street" },
        { type: "field", fieldName: "city" }
      ]
    }
  ]
} as const;

// For input types
const formElement = {
  type: "field",
  fieldName: "status",
  input: { type: "combo-box" }
} as const;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `widgets-featuretable` - Basic FeatureTable widget usage
- `widgets-featuretable-editing` - Editing with FeatureTable
- `widgets-featuretable-map` - FeatureTable with map integration
- `widgets-featuretable-relates` - FeatureTable with related records
- `feature-table` - FeatureTable component usage

## Common Pitfalls

1. **Field Names Must Match**: fieldName must exactly match layer field
   ```javascript
   // Layer has field "PropertyName"
   { fieldName: "PropertyName" }  // Correct
   { fieldName: "propertyname" }  // Wrong - case sensitive
   ```

2. **Coded Value Domains**: ComboBox auto-populates from domain
   ```javascript
   // If field has coded value domain, values come from domain
   { type: "field", fieldName: "status", input: { type: "combo-box" } }
   // Dropdown shows domain values automatically
   ```

3. **Expression Names**: Reference expressions by name string
   ```javascript
   expressionInfos: [{ name: "my-expr", expression: "..." }],
   elements: [{
     visibilityExpression: "my-expr"  // String reference
   }]
   ```

4. **Layer Must Be Editable**: For edit features to work
   ```javascript
   // Layer capabilities must include editing
   if (layer.capabilities.editing.supportsUpdateByOthers) {
     featureTable.editingEnabled = true;
   }
   ```

5. **Container Size**: Table needs explicit height
   ```css
   #tableDiv {
     height: 400px;  /* Required */
     width: 100%;
   }
   ```

