---
name: arcgis-popup-templates
description: Configure rich popup content with text, fields, media, charts, attachments, and related records.
---

# ArcGIS Popup Templates

Use this skill for creating and customizing popup templates with various content types.

## Import Patterns

### Direct ESM Imports
```javascript
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import CustomContent from "@arcgis/core/popup/content/CustomContent.js";
```

### Dynamic Imports (CDN)
```javascript
const PopupTemplate = await $arcgis.import("@arcgis/core/PopupTemplate.js");
const CustomContent = await $arcgis.import("@arcgis/core/popup/content/CustomContent.js");
```

> **Note:** The examples in this skill use Direct ESM imports. For CDN usage, replace `import X from "path"` with `const X = await $arcgis.import("path")`.

## PopupTemplate Overview

| Content Type | Purpose |
|--------------|---------|
| TextContent | HTML or plain text |
| FieldsContent | Attribute table |
| MediaContent | Charts and images |
| AttachmentsContent | File attachments |
| ExpressionContent | Arcade expression results |
| CustomContent | Custom HTML/JavaScript |
| RelationshipContent | Related records |

### PopupTemplate Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string \| Function \| object | Title with field substitution (`{fieldName}`) |
| `content` | string \| Array \| Function \| Promise | Content definition |
| `fieldInfos` | FieldInfo[] | Default field formatting |
| `expressionInfos` | ExpressionInfo[] | Arcade expression definitions |
| `outFields` | string[] | Fields to retrieve for popup |
| `actions` | ActionButton[] \| ActionToggle[] | Custom action buttons |
| `overwriteActions` | boolean | Replace default popup actions |
| `returnGeometry` | boolean | Include geometry in popup results |

## Basic PopupTemplate

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "Population: {population}<br>Area: {area} sq mi"
};
```

### With Field Substitution

```javascript
layer.popupTemplate = {
  title: "{city_name}, {state}",
  content: `
    <h3>Demographics</h3>
    <p>Population: {population:NumberFormat(places: 0)}</p>
    <p>Median Income: {median_income:NumberFormat(digitSeparator: true, places: 0)}</p>
    <p>Founded: {founded_date:DateFormat(selector: 'date', datePattern: 'MMMM d, yyyy')}</p>
  `
};
```

## Content Array (Multiple Content Types)

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: [
    {
      type: "text",
      text: "<b>Overview</b><br>{description}"
    },
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "population", label: "Population" },
        { fieldName: "area", label: "Area (sq mi)" }
      ]
    },
    {
      type: "media",
      mediaInfos: [{
        type: "pie-chart",
        title: "Demographics",
        value: {
          fields: ["white", "black", "asian", "other"]
        }
      }]
    }
  ]
};
```

## Content Types

### TextContent

```javascript
{
  type: "text",
  text: `
    <div style="padding: 10px;">
      <h2>{name}</h2>
      <p>{description}</p>
      <a href="{website}" target="_blank">Visit Website</a>
    </div>
  `
}
```

### FieldsContent

```javascript
{
  type: "fields",
  fieldInfos: [
    {
      fieldName: "name",
      label: "Name"
    },
    {
      fieldName: "population",
      label: "Population",
      format: {
        digitSeparator: true,
        places: 0
      }
    },
    {
      fieldName: "date_created",
      label: "Created",
      format: {
        dateFormat: "short-date"
      }
    }
  ]
}
```

#### Date Formats

- `short-date` - 12/30/2024
- `short-date-short-time` - 12/30/2024, 3:30 PM
- `short-date-long-time` - 12/30/2024, 3:30:45 PM
- `long-month-day-year` - December 30, 2024
- `day-short-month-year` - 30 Dec 2024
- `year` - 2024

### MediaContent

```javascript
{
  type: "media",
  mediaInfos: [
    {
      title: "Sales by Quarter",
      type: "column-chart",  // bar-chart, pie-chart, line-chart, column-chart, image
      value: {
        fields: ["q1_sales", "q2_sales", "q3_sales", "q4_sales"],
        normalizeField: "total_sales"  // Optional
      }
    }
  ]
}
```

#### Chart Types

| Type | Use Case |
|------|----------|
| `bar-chart` | Horizontal bars for categorical comparison |
| `pie-chart` | Proportional distribution |
| `line-chart` | Trends over series |
| `column-chart` | Vertical bars for comparison |
| `image` | Display images from URL fields |

**Image MediaInfo:**
```javascript
{
  type: "image",
  title: "Property Photo",
  value: {
    sourceURL: "{image_url}",
    linkURL: "{detail_page_url}"
  }
}
```

### AttachmentsContent

```javascript
{
  type: "attachments",
  displayType: "preview",  // preview, list, auto
  title: "Photos"
}
```

### ExpressionContent

```javascript
layer.popupTemplate = {
  expressionInfos: [
    {
      name: "population-density",
      title: "Population Density",
      expression: "Round($feature.population / $feature.area, 2)"
    },
    {
      name: "age-category",
      title: "Age Category",
      expression: `
        var age = $feature.building_age;
        if (age < 25) return "New";
        if (age < 50) return "Moderate";
        return "Historic";
      `
    }
  ],
  content: [
    {
      type: "expression",
      expressionInfo: {
        name: "population-density"
      }
    }
  ]
};
```

### CustomContent

```javascript
import CustomContent from "@arcgis/core/popup/content/CustomContent.js";

const customContent = new CustomContent({
  outFields: ["*"],
  creator: (event) => {
    const div = document.createElement("div");
    const graphic = event.graphic;

    div.innerHTML = `
      <div class="custom-popup">
        <h3>${graphic.attributes.name}</h3>
        <canvas id="chart-${graphic.attributes.OBJECTID}"></canvas>
      </div>
    `;

    return div;
  }
});

layer.popupTemplate = {
  title: "{name}",
  content: [customContent]
};
```

### RelationshipContent

```javascript
{
  type: "relationship",
  relationshipId: 0,
  title: "Related Inspections",
  displayCount: 5,
  orderByFields: [
    {
      field: "inspection_date",
      order: "desc"
    }
  ]
}
```

## Popup Component

The `<arcgis-popup>` component provides popup display control.

**Key Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `actions` | Collection | Custom action buttons |
| `content` | string \| Node \| Widget | Popup content |
| `dock-options` | object | Docking behavior configuration |
| `features` | Graphic[] | Features to display |
| `heading` | string | Popup heading text |
| `heading-level` | number | Heading level (1-6) |
| `include-default-actions-disabled` | boolean | Disable default zoom-to action |
| `initial-display-mode` | string | Initial display mode |
| `location` | Point | Popup anchor location |
| `open` | boolean | Whether popup is open |
| `selected-feature` | Graphic | Currently selected feature |
| `selected-feature-index` | number | Index of selected feature |

**Key Events:**

| Event | Description |
|-------|-------------|
| `arcgisTriggerAction` | Fires when a custom action is clicked |

## Actions

Add custom buttons to popups.

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  actions: [
    {
      id: "zoom-to",
      title: "Zoom To",
      className: "esri-icon-zoom-in-magnifying-glass"
    },
    {
      id: "edit",
      title: "Edit",
      className: "esri-icon-edit"
    }
  ]
};

// Handle action clicks using reactiveUtils
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

reactiveUtils.on(
  () => view.popup,
  "trigger-action",
  (event) => {
    if (event.action.id === "zoom-to") {
      view.goTo(view.popup.selectedFeature);
    } else if (event.action.id === "edit") {
      startEditing(view.popup.selectedFeature);
    }
  }
);
```

### Action Button Types

```javascript
// Icon button
{ id: "info", title: "More Info", className: "esri-icon-description" }

// Toggle button
{ id: "highlight", title: "Highlight", type: "toggle", value: false }
```

## Dynamic Content with Functions

### Content as Function

```javascript
layer.popupTemplate = {
  title: "{name}",
  outFields: ["*"],
  content: (feature) => {
    const attributes = feature.graphic.attributes;

    if (attributes.type === "residential") {
      return `
        <h3>Residential Property</h3>
        <p>Bedrooms: ${attributes.bedrooms}</p>
        <p>Bathrooms: ${attributes.bathrooms}</p>
      `;
    } else {
      return `
        <h3>Commercial Property</h3>
        <p>Square Footage: ${attributes.sqft}</p>
      `;
    }
  }
};
```

### Async Content Function

```javascript
layer.popupTemplate = {
  title: "{name}",
  outFields: ["*"],
  content: async (feature) => {
    const id = feature.graphic.attributes.OBJECTID;
    const response = await fetch(`/api/details/${id}`);
    const data = await response.json();

    return `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
    `;
  }
};
```

## Arcade Expressions

### In Title
```javascript
layer.popupTemplate = {
  title: {
    expression: `
      var name = $feature.name;
      var status = $feature.status;
      return name + " (" + status + ")";
    `
  },
  content: "..."
};
```

### Expression Infos in Fields
```javascript
layer.popupTemplate = {
  expressionInfos: [
    {
      name: "formatted-date",
      title: "Formatted Date",
      expression: 'Text($feature.created_date, "MMMM D, YYYY")'
    },
    {
      name: "calculated-field",
      title: "Density",
      expression: "Round($feature.population / AreaGeodetic($feature, 'square-miles'), 1)"
    }
  ],
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "expression/formatted-date", label: "Created" },
        { fieldName: "expression/calculated-field", label: "Population Density" }
      ]
    }
  ]
};
```

## OutFields

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  outFields: ["name", "population", "area", "created_date"]
};

// All fields
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  outFields: ["*"]
};
```

## Clustering Popups

```javascript
layer.featureReduction = {
  type: "cluster",
  clusterRadius: 80,
  popupTemplate: {
    title: "Cluster of {cluster_count} features",
    content: [{
      type: "fields",
      fieldInfos: [
        {
          fieldName: "cluster_count",
          label: "Features in cluster"
        },
        {
          fieldName: "cluster_avg_population",
          label: "Average Population",
          format: { digitSeparator: true, places: 0 }
        }
      ]
    }]
  },
  fields: [{
    name: "cluster_avg_population",
    alias: "Average Population",
    onStatisticField: "population",
    statisticType: "avg"
  }]
};
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
  <arcgis-map basemap="gray-vector" center="-73.95,40.70" zoom="11">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-legend slot="bottom-left"></arcgis-legend>
  </arcgis-map>

  <script type="module">
    const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

    const mapElement = document.querySelector("arcgis-map");
    const view = await mapElement.view;
    await view.when();

    const template = {
      title: "Marriage in {NAME} Census Tract {TRACT}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "B12001_calc_pctMarriedE",
              label: "Married %",
              format: { digitSeparator: true, places: 1 }
            },
            {
              fieldName: "B12001_calc_pctNeverE",
              label: "Never Married %",
              format: { digitSeparator: true, places: 1 }
            }
          ]
        }
      ]
    };

    const featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
      popupTemplate: template
    });
    mapElement.map.add(featureLayer);
  </script>
</body>
</html>
```

## Reference Samples

- `intro-popuptemplate` - Basic PopupTemplate configuration
- `get-started-popuptemplate` - Getting started with PopupTemplate
- `popup-actions` - Adding custom actions to popups
- `popup-custom-action` - Custom popup actions with geometry operators
- `popup-customcontent` - Custom popup content elements
- `popuptemplate-arcade` - Using Arcade expressions in popups
- `popuptemplate-arcade-expression-content` - Arcade expression content
- `popup-multipleelements` - Multiple content elements in popups
- `popuptemplate-function` - Function-based popup content
- `popuptemplate-promise` - Promise-based popup content
- `popuptemplate-browse-related-records` - Related records in popups

## Common Pitfalls

1. **Field Names Case Sensitive**: Field names must match exactly.
   ```javascript
   // If field is "Population" (capital P)
   content: "{Population}"  // Correct
   content: "{population}"  // Wrong - shows literal {population}
   ```

2. **OutFields Required**: Fields used in popup must be in outFields when using function content.
   ```javascript
   popupTemplate: {
     title: "{name}",
     outFields: ["name", "description"],  // Required for function content
     content: (feature) => {
       return feature.graphic.attributes.description;
     }
   }
   ```

3. **Expression Reference**: Use `expression/` prefix for Arcade expressions in fieldInfos.
   ```javascript
   fieldInfos: [
     { fieldName: "expression/my-expression", label: "Calculated" }
   ]
   ```

4. **Async Content Must Return**: Function content must return a value or Promise.
   ```javascript
   // Wrong - no return
   content: (feature) => {
     const div = document.createElement("div");
   }

   // Correct
   content: (feature) => {
     const div = document.createElement("div");
     return div;
   }
   ```

5. **GeoJSON Field Path**: GeoJSON requires `properties/` prefix for field names.
   ```javascript
   // GeoJSON
   title: "{properties/name}"
   // Regular FeatureLayer
   title: "{name}"
   ```

## Related Skills

- See `arcgis-interaction` for hit testing and event handling.
- See `arcgis-editing` for feature editing workflows.
- See `arcgis-arcade` for detailed Arcade expression syntax.
