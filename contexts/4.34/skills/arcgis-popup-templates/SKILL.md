---
name: arcgis-popup-templates
description: Configure rich popup content with text, fields, media, charts, attachments, and related records. Use for customizing feature popups with dynamic content, expressions, and interactive elements.
---

# ArcGIS Popup Templates

Use this skill for creating and customizing popup templates with various content types.

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

Display HTML or text.

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

Display attributes as a table.

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
    },
    {
      fieldName: "percentage",
      label: "Percentage",
      format: {
        places: 2,
        digitSeparator: true
      }
    }
  ]
}
```

#### Date Formats

- `short-date` - 12/30/2024
- `short-date-short-time` - 12/30/2024, 3:30 PM
- `short-date-short-time-24` - 12/30/2024, 15:30
- `short-date-long-time` - 12/30/2024, 3:30:45 PM
- `short-date-long-time-24` - 12/30/2024, 15:30:45
- `long-month-day-year` - December 30, 2024
- `long-month-day-year-short-time` - December 30, 2024, 3:30 PM
- `long-month-day-year-long-time` - December 30, 2024, 3:30:45 PM
- `day-short-month-year` - 30 Dec 2024
- `year` - 2024

### MediaContent

Display charts or images.

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

**Bar Chart**
```javascript
{
  type: "bar-chart",
  title: "Population by Age",
  value: {
    fields: ["age_0_17", "age_18_34", "age_35_54", "age_55_plus"]
  }
}
```

**Pie Chart**
```javascript
{
  type: "pie-chart",
  title: "Land Use Distribution",
  value: {
    fields: ["residential", "commercial", "industrial", "agricultural"]
  }
}
```

**Line Chart**
```javascript
{
  type: "line-chart",
  title: "Monthly Sales",
  value: {
    fields: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  }
}
```

**Column Chart**
```javascript
{
  type: "column-chart",
  title: "Revenue vs Expenses",
  value: {
    fields: ["revenue", "expenses"]
  }
}
```

**Image**
```javascript
{
  type: "image",
  title: "Property Photo",
  value: {
    sourceURL: "{image_url}",
    linkURL: "{detail_page_url}"
  }
}

// Fixed image
{
  type: "image",
  value: {
    sourceURL: "https://example.com/logo.png"
  }
}
```

### AttachmentsContent

Display file attachments.

```javascript
{
  type: "attachments",
  displayType: "preview",  // preview, list, auto
  title: "Photos"
}

// With custom display
{
  type: "attachments",
  displayType: "list",
  title: "Documents",
  description: "Related files for this record"
}
```

### ExpressionContent

Display Arcade expression results.

```javascript
// First, define expression in expressionInfos
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

Create fully custom content with JavaScript.

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

    // Add custom logic, charts, etc.
    return div;
  }
});

layer.popupTemplate = {
  title: "{name}",
  content: [customContent]
};
```

### RelationshipContent

Display related records.

```javascript
{
  type: "relationship",
  relationshipId: 0,  // Relationship ID from the layer
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

## FieldInfo Configuration

### Basic FieldInfo

```javascript
const fieldInfo = {
  fieldName: "population",
  label: "Population",
  visible: true,
  isEditable: false,
  statisticType: "sum"  // For clustering: sum, min, max, avg, count
};
```

### Number Formatting

```javascript
{
  fieldName: "revenue",
  label: "Annual Revenue",
  format: {
    digitSeparator: true,
    places: 2
  }
}

// Currency (manual)
{
  fieldName: "price",
  label: "Price",
  format: {
    digitSeparator: true,
    places: 2
  }
}
// Use expression for currency symbol
```

### Date Formatting

```javascript
{
  fieldName: "created_date",
  label: "Created",
  format: {
    dateFormat: "long-month-day-year"
  }
}
```

### Tooltip

```javascript
{
  fieldName: "status",
  label: "Status",
  tooltip: "Current processing status of the request"
}
```

## RelatedRecordsInfo

Configure how related records are displayed.

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: [{
    type: "relationship",
    relationshipId: 0
  }],
  relatedRecordsInfo: {
    showRelatedRecords: true,
    orderByFields: [{
      field: "date",
      order: "desc"
    }]
  }
};
```

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
    },
    {
      id: "delete",
      title: "Delete",
      className: "esri-icon-trash"
    }
  ]
};

// Handle action clicks
view.popup.on("trigger-action", (event) => {
  if (event.action.id === "zoom-to") {
    view.goTo(view.popup.selectedFeature);
  } else if (event.action.id === "edit") {
    // Open editor
    startEditing(view.popup.selectedFeature);
  } else if (event.action.id === "delete") {
    // Delete feature
    deleteFeature(view.popup.selectedFeature);
  }
});
```

### Action Button Types

```javascript
// Icon button
{
  id: "info",
  title: "More Info",
  className: "esri-icon-description"
}

// Text button
{
  id: "report",
  title: "Generate Report",
  type: "button"
}

// Toggle button
{
  id: "highlight",
  title: "Highlight",
  type: "toggle",
  value: false
}
```

## Dynamic Content with Functions

### Content as Function

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: (feature) => {
    const attributes = feature.graphic.attributes;

    // Conditional content
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
        <p>Zoning: ${attributes.zoning}</p>
      `;
    }
  }
};
```

### Async Content Function

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: async (feature) => {
    const id = feature.graphic.attributes.OBJECTID;

    // Fetch additional data
    const response = await fetch(`/api/details/${id}`);
    const data = await response.json();

    return `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <img src="${data.imageUrl}" />
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

### Expression Infos

```javascript
layer.popupTemplate = {
  expressionInfos: [
    {
      name: "formatted-date",
      title: "Formatted Date",
      expression: `
        var d = $feature.created_date;
        return Text(d, "MMMM D, YYYY");
      `
    },
    {
      name: "calculated-field",
      title: "Density",
      expression: "Round($feature.population / AreaGeodetic($feature, 'square-miles'), 1)"
    },
    {
      name: "conditional-value",
      title: "Status",
      expression: `
        var val = $feature.score;
        if (val >= 80) return "Excellent";
        if (val >= 60) return "Good";
        if (val >= 40) return "Fair";
        return "Poor";
      `
    }
  ],
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "expression/formatted-date", label: "Created" },
        { fieldName: "expression/calculated-field", label: "Population Density" },
        { fieldName: "expression/conditional-value", label: "Rating" }
      ]
    }
  ]
};
```

## OutFields

Specify which fields to retrieve.

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

## Last Edit Info

Show who last edited the feature.

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  lastEditInfoEnabled: true
};
```

## Popup Template from JSON

```javascript
const popupTemplate = {
  title: "{name}",
  content: [{
    type: "fields",
    fieldInfos: [
      { fieldName: "category", label: "Category" },
      { fieldName: "value", label: "Value" }
    ]
  }],
  outFields: ["name", "category", "value"]
};

// Apply to layer
layer.popupTemplate = popupTemplate;

// Or create from class
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
layer.popupTemplate = new PopupTemplate(popupTemplate);
```

## Layer-Specific Popup

### FeatureLayer with Popup

```javascript
const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/.../FeatureServer/0",
  popupTemplate: {
    title: "{NAME}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "NAME", label: "Name" },
        { fieldName: "POP2020", label: "Population (2020)", format: { digitSeparator: true } }
      ]
    }]
  }
});
```

### GeoJSONLayer with Popup

```javascript
const geoJsonLayer = new GeoJSONLayer({
  url: "data.geojson",
  popupTemplate: {
    title: "{properties/name}",  // Note: GeoJSON uses properties/fieldName
    content: "{properties/description}"
  }
});
```

### GraphicsLayer Popup

```javascript
const graphic = new Graphic({
  geometry: point,
  attributes: {
    name: "Location A",
    value: 100
  },
  popupTemplate: {
    title: "{name}",
    content: "Value: {value}"
  }
});

graphicsLayer.add(graphic);
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
  clusterMinSize: 16,
  clusterMaxSize: 60,
  fields: [{
    name: "cluster_avg_population",
    alias: "Average Population",
    onStatisticField: "population",
    statisticType: "avg"
  }]
};
```

## Common Patterns

### Popup with Image Gallery

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: [
    {
      type: "text",
      text: "{description}"
    },
    {
      type: "attachments",
      displayType: "preview"
    }
  ]
};
```

### Multi-Tab Style Popup

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: [
    {
      type: "text",
      text: "<b>General Information</b>"
    },
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "category", label: "Category" },
        { fieldName: "status", label: "Status" }
      ]
    },
    {
      type: "text",
      text: "<hr><b>Statistics</b>"
    },
    {
      type: "media",
      mediaInfos: [{
        type: "pie-chart",
        title: "Distribution",
        value: { fields: ["typeA", "typeB", "typeC"] }
      }]
    }
  ]
};
```

### Conditional Content

```javascript
layer.popupTemplate = {
  title: "{name}",
  expressionInfos: [{
    name: "show-warning",
    expression: "$feature.risk_level > 7"
  }],
  content: (feature) => {
    const content = [{
      type: "fields",
      fieldInfos: [
        { fieldName: "name", label: "Name" },
        { fieldName: "risk_level", label: "Risk Level" }
      ]
    }];

    if (feature.graphic.attributes.risk_level > 7) {
      content.unshift({
        type: "text",
        text: '<div style="background: #ffcccc; padding: 10px;">⚠️ High Risk Area</div>'
      });
    }

    return content;
  }
};
```

## TypeScript Usage

PopupTemplate content uses autocasting with `type` properties. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for type safety
layer.popupTemplate = {
  title: "{name}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "name", label: "Name" },
        { fieldName: "population", label: "Population" }
      ]
    },
    {
      type: "media",
      mediaInfos: [{
        type: "pie-chart",
        value: { fields: ["typeA", "typeB"] }
      }]
    }
  ]
} as const;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Reference Samples

- `intro-popuptemplate` - Basic PopupTemplate configuration
- `popup-actions` - Adding custom actions to popups
- `popup-customcontent` - Custom popup content elements
- `popuptemplate-arcade` - Using Arcade expressions in popups
- `popup-multipleelements` - Multiple content elements in popups

## Common Pitfalls

1. **Field Names Case Sensitive**: Field names must match exactly
   ```javascript
   // If field is "Population" (capital P)
   content: "{Population}"  // Correct
   content: "{population}"  // Wrong - shows literal {population}
   ```

2. **OutFields Required**: Fields used in popup must be in outFields
   ```javascript
   popupTemplate: {
     title: "{name}",
     content: "{description}",
     outFields: ["name", "description"]  // Both required
   }
   ```

3. **GeoJSON Field Path**: GeoJSON requires `properties/` prefix
   ```javascript
   // GeoJSON
   title: "{properties/name}"
   // Regular FeatureLayer
   title: "{name}"
   ```

4. **Expression Reference**: Use `expression/` prefix for Arcade expressions
   ```javascript
   fieldInfos: [
     { fieldName: "expression/my-expression", label: "Calculated" }
   ]
   ```

5. **Async Content**: Function content must return a value or Promise
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

