---
name: arcgis-arcade
description: Write Arcade expressions for dynamic calculations in popups, renderers, labels, and field calculations. Use for data-driven styling, custom labels, and computed fields.
---

# ArcGIS Arcade Expressions

Use this skill for writing Arcade expressions for popups, renderers, labels, and calculations.

## Arcade Basics

Arcade is an expression language for ArcGIS. It's used for:
- Dynamic popup content
- Data-driven rendering
- Custom labels
- Field calculations
- Form validation

### Basic Syntax
```arcade
// Variables
var population = $feature.population;
var area = $feature.area_sqkm;

// Calculations
var density = population / area;

// Return result
return Round(density, 2);
```

## Arcade in PopupTemplates

### Expression Infos
```javascript
const popupTemplate = {
  title: "{name}",
  expressionInfos: [
    {
      name: "population-density",
      title: "Population Density",
      expression: "Round($feature.population / $feature.area_sqkm, 2)"
    },
    {
      name: "formatted-date",
      title: "Formatted Date",
      expression: "Text($feature.created_date, 'MMMM D, YYYY')"
    }
  ],
  content: "Density: {expression/population-density} people/km²"
};
```

### Complex Expressions
```javascript
const popupTemplate = {
  title: "{name}",
  expressionInfos: [{
    name: "predominant-category",
    title: "Predominant Category",
    expression: `
      var fields = [
        { value: $feature.category_a, alias: "Category A" },
        { value: $feature.category_b, alias: "Category B" },
        { value: $feature.category_c, alias: "Category C" }
      ];

      var maxValue = -Infinity;
      var maxCategory = "";

      for (var i in fields) {
        if (fields[i].value > maxValue) {
          maxValue = fields[i].value;
          maxCategory = fields[i].alias;
        }
      }

      return maxCategory;
    `
  }],
  content: [
    {
      type: "text",
      text: "The predominant category is: {expression/predominant-category}"
    },
    {
      type: "fields",
      fieldInfos: [{
        fieldName: "expression/predominant-category"
      }]
    }
  ]
};
```

## Arcade in Renderers

### Value Expression
```javascript
const renderer = {
  type: "unique-value",
  valueExpression: `
    var labor = $feature.labor_force;
    var notLabor = $feature.not_in_labor_force;

    if (labor > notLabor) {
      return "In labor force";
    } else {
      return "Not in labor force";
    }
  `,
  valueExpressionTitle: "Labor Force Status",
  uniqueValueInfos: [
    {
      value: "In labor force",
      symbol: { type: "simple-fill", color: "blue" }
    },
    {
      value: "Not in labor force",
      symbol: { type: "simple-fill", color: "orange" }
    }
  ]
};
```

### Visual Variable Expression
```javascript
const renderer = {
  type: "simple",
  symbol: { type: "simple-marker", color: "red" },
  visualVariables: [{
    type: "size",
    valueExpression: "Sqrt($feature.population) * 0.1",
    valueExpressionTitle: "Population (scaled)",
    stops: [
      { value: 10, size: 4 },
      { value: 100, size: 40 }
    ]
  }, {
    type: "opacity",
    valueExpression: "($feature.value / $feature.max_value) * 100",
    valueExpressionTitle: "Percentage of max",
    stops: [
      { value: 20, opacity: 0.2 },
      { value: 80, opacity: 1 }
    ]
  }]
};
```

## Arcade in Labels

```javascript
layer.labelingInfo = [{
  symbol: {
    type: "text",
    color: "black",
    font: { size: 10 }
  },
  labelExpressionInfo: {
    expression: `
      var name = $feature.name;
      var pop = $feature.population;

      if (pop > 1000000) {
        return name + " (" + Round(pop/1000000, 1) + "M)";
      } else if (pop > 1000) {
        return name + " (" + Round(pop/1000, 0) + "K)";
      }
      return name;
    `
  },
  where: "population > 50000"
}];
```

## Common Arcade Functions

### Math Functions
```arcade
Round(3.14159, 2)        // 3.14
Floor(3.9)               // 3
Ceil(3.1)                // 4
Abs(-5)                  // 5
Sqrt(16)                 // 4
Pow(2, 3)                // 8
Min(1, 2, 3)             // 1
Max(1, 2, 3)             // 3
Sum([1, 2, 3])           // 6
Mean([1, 2, 3])          // 2
```

### Text Functions
```arcade
Upper("hello")           // "HELLO"
Lower("HELLO")           // "hello"
Trim("  hello  ")        // "hello"
Left("hello", 2)         // "he"
Right("hello", 2)        // "lo"
Mid("hello", 2, 2)       // "ll"
Find("l", "hello")       // 2
Replace("hello", "l", "L") // "heLLo"
Split("a,b,c", ",")      // ["a", "b", "c"]
Concatenate(["a", "b"])  // "ab"
```

### Date Functions
```arcade
Now()                                    // Current date/time
Today()                                  // Current date
Year($feature.date_field)               // Extract year
Month($feature.date_field)              // Extract month (1-12)
Day($feature.date_field)                // Extract day
DateDiff(Now(), $feature.date, "days")  // Days between dates
Text($feature.date, "MMMM D, YYYY")     // Format date
```

### Geometry Functions
```arcade
Area($feature, "square-kilometers")
Length($feature, "kilometers")
Centroid($feature)
Buffer($feature, 100, "meters")
Intersects($feature, $otherFeature)
Contains($feature, $point)
```

### Conditional Functions
```arcade
// IIf (inline if)
IIf($feature.value > 100, "High", "Low")

// When (multiple conditions)
When(
  $feature.type == "A", "Type A",
  $feature.type == "B", "Type B",
  "Other"
)

// Decode (value matching)
Decode($feature.code,
  1, "One",
  2, "Two",
  3, "Three",
  "Unknown"
)
```

### Array Functions
```arcade
var arr = [1, 2, 3, 4, 5];

Count(arr)               // 5
First(arr)               // 1
Last(arr)                // 5
IndexOf(arr, 3)          // 2
Includes(arr, 3)         // true
Push(arr, 6)             // [1, 2, 3, 4, 5, 6]
Reverse(arr)             // [5, 4, 3, 2, 1]
Sort(arr)                // [1, 2, 3, 4, 5]
Slice(arr, 1, 3)         // [2, 3]
```

## Feature Access

```arcade
// Current feature
$feature.fieldName

// All features in layer (for aggregation)
var allFeatures = FeatureSet($layer);
var filtered = Filter(allFeatures, "type = 'A'");
var total = Sum(filtered, "value");

// Related records
var related = FeatureSetByRelationshipName($feature, "relationshipName");

// Global variables
$map                     // Reference to map
$view                    // Reference to view
$datastore               // Reference to data store
```

## Execute Arcade Programmatically

```javascript
import Arcade from "@arcgis/core/arcade/Arcade.js";

// Create profile
const profile = {
  variables: [{
    name: "$feature",
    type: "feature"
  }]
};

// Compile expression
const executor = await Arcade.createArcadeExecutor(
  "Round($feature.value * 100, 2)",
  profile
);

// Execute with feature
const result = executor.execute({
  $feature: graphic
});

console.log("Result:", result);
```

## Arcade in HTML (Script Tags)

```html
<script type="text/plain" id="my-expression">
  var total = $feature.value_a + $feature.value_b;
  var percentage = Round((total / $feature.max_value) * 100, 1);
  return percentage + "%";
</script>

<script type="module">
  const expression = document.getElementById("my-expression").text;

  const popupTemplate = {
    expressionInfos: [{
      name: "my-calc",
      expression: expression
    }],
    content: "Value: {expression/my-calc}"
  };
</script>
```

## TypeScript Usage

Arcade expression configurations use autocasting. For TypeScript safety, use `as const`:

```typescript
// Use 'as const' for expression-based visualizations
layer.renderer = {
  type: "simple",
  symbol: { type: "simple-marker" },
  visualVariables: [{
    type: "size",
    valueExpression: "$feature.population / $feature.area",
    stops: [
      { value: 50, size: 4 },
      { value: 500, size: 20 }
    ]
  }]
} as const;
```

> **Tip:** See [arcgis-core-maps skill](../arcgis-core-maps/SKILL.md) for detailed guidance on autocasting vs explicit classes.

## Common Pitfalls

1. **Null values**: Check for nulls with `IsEmpty($feature.field)`

2. **Type coercion**: Use `Number()` or `Text()` for explicit conversion

3. **Case sensitivity**: Arcade is case-insensitive for functions but field names match exactly

4. **Performance**: Complex expressions in renderers can slow performance

5. **Debugging**: Use `Console()` function to debug expressions

