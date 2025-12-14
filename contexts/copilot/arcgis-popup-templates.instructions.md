---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Popup Templates

## Content Types

| Type | Purpose |
|------|---------|
| TextContent | HTML or plain text |
| FieldsContent | Attribute table |
| MediaContent | Charts and images |
| AttachmentsContent | File attachments |
| ExpressionContent | Arcade expression results |
| RelationshipContent | Related records |

## Basic PopupTemplate

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "Population: {population}<br>Area: {area} sq mi"
};
```

### With Formatting

```javascript
layer.popupTemplate = {
  title: "{city_name}, {state}",
  content: `
    <p>Population: {population:NumberFormat(places: 0)}</p>
    <p>Founded: {founded_date:DateFormat(selector: 'date')}</p>
  `
};
```

## Content Array (Multiple Types)

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
        { fieldName: "area", label: "Area" }
      ]
    },
    {
      type: "media",
      mediaInfos: [{
        type: "pie-chart",
        title: "Demographics",
        value: { fields: ["white", "black", "asian", "other"] }
      }]
    }
  ]
};
```

## FieldsContent

```javascript
{
  type: "fields",
  fieldInfos: [
    { fieldName: "name", label: "Name" },
    {
      fieldName: "population",
      label: "Population",
      format: { digitSeparator: true, places: 0 }
    },
    {
      fieldName: "date_created",
      label: "Created",
      format: { dateFormat: "short-date" }
    }
  ]
}
```

### Date Formats
- `short-date` - 12/30/2024
- `short-date-short-time` - 12/30/2024, 3:30 PM
- `long-month-day-year` - December 30, 2024
- `year` - 2024

## MediaContent (Charts)

```javascript
{
  type: "media",
  mediaInfos: [
    {
      type: "bar-chart",
      title: "Sales by Quarter",
      value: { fields: ["q1", "q2", "q3", "q4"] }
    },
    {
      type: "pie-chart",
      title: "Distribution",
      value: { fields: ["typeA", "typeB", "typeC"] }
    },
    {
      type: "image",
      value: { sourceURL: "{image_url}" }
    }
  ]
}
```

Chart types: `bar-chart`, `pie-chart`, `line-chart`, `column-chart`, `image`

## AttachmentsContent

```javascript
{
  type: "attachments",
  displayType: "preview",  // preview, list, auto
  title: "Photos"
}
```

## Arcade Expressions

```javascript
layer.popupTemplate = {
  expressionInfos: [
    {
      name: "density",
      title: "Density",
      expression: "Round($feature.population / $feature.area, 2)"
    }
  ],
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "expression/density", label: "Population Density" }
      ]
    }
  ]
};
```

## Actions (Custom Buttons)

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  actions: [
    { id: "zoom-to", title: "Zoom To", className: "esri-icon-zoom-in-magnifying-glass" },
    { id: "edit", title: "Edit", className: "esri-icon-edit" }
  ]
};

view.popup.on("trigger-action", (event) => {
  if (event.action.id === "zoom-to") {
    view.goTo(view.popup.selectedFeature);
  }
});
```

## Dynamic Content Function

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: (feature) => {
    const attrs = feature.graphic.attributes;
    if (attrs.type === "residential") {
      return `<p>Bedrooms: ${attrs.bedrooms}</p>`;
    }
    return `<p>Zoning: ${attrs.zoning}</p>`;
  }
};
```

### Async Content

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: async (feature) => {
    const response = await fetch(`/api/details/${feature.graphic.attributes.id}`);
    const data = await response.json();
    return `<h3>${data.title}</h3><p>${data.description}</p>`;
  }
};
```

## Related Records

```javascript
{
  type: "relationship",
  relationshipId: 0,
  title: "Related Inspections",
  displayCount: 5,
  orderByFields: [{ field: "date", order: "desc" }]
}
```

## OutFields

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "{description}",
  outFields: ["name", "description"]  // or ["*"] for all
};
```

## Last Edit Info

```javascript
layer.popupTemplate = {
  title: "{name}",
  content: "...",
  lastEditInfoEnabled: true
};
```

## Clustering Popups

```javascript
layer.featureReduction = {
  type: "cluster",
  popupTemplate: {
    title: "Cluster of {cluster_count} features",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "cluster_count", label: "Count" },
        { fieldName: "cluster_avg_value", label: "Average" }
      ]
    }]
  }
};
```

## GeoJSON Field Path

```javascript
// GeoJSON uses properties/ prefix
layer.popupTemplate = {
  title: "{properties/name}",
  content: "{properties/description}"
};
```

## Common Pitfalls

1. **Field names case sensitive** - Must match exactly
2. **OutFields required** - Fields must be in outFields
3. **GeoJSON prefix** - Use `properties/fieldName`
4. **Expression reference** - Use `expression/name` prefix
5. **Async content** - Function must return a value or Promise
