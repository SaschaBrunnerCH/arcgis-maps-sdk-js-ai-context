---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Arcade Expressions

## Arcade Basics

Arcade is used for:
- Dynamic popup content
- Data-driven rendering
- Custom labels
- Field calculations
- Form validation

### Basic Syntax
```arcade
var population = $feature.population;
var area = $feature.area_sqkm;
var density = population / area;
return Round(density, 2);
```

## Arcade in PopupTemplates

```javascript
layer.popupTemplate = {
  title: "{name}",
  expressionInfos: [
    {
      name: "density",
      title: "Population Density",
      expression: "Round($feature.population / $feature.area, 2)"
    }
  ],
  content: "Density: {expression/density} people/km²"
};
```

## Arcade in Renderers

```javascript
layer.renderer = {
  type: "unique-value",
  valueExpression: `
    if ($feature.value > 100) {
      return "High";
    } else {
      return "Low";
    }
  `,
  uniqueValueInfos: [
    { value: "High", symbol: { type: "simple-fill", color: "red" } },
    { value: "Low", symbol: { type: "simple-fill", color: "blue" } }
  ]
};
```

### Visual Variable Expression
```javascript
visualVariables: [{
  type: "size",
  valueExpression: "Sqrt($feature.population) * 0.1",
  stops: [
    { value: 10, size: 4 },
    { value: 100, size: 40 }
  ]
}]
```

## Arcade in Labels

```javascript
layer.labelingInfo = [{
  symbol: { type: "text", color: "black", font: { size: 10 } },
  labelExpressionInfo: {
    expression: `
      var pop = $feature.population;
      if (pop > 1000000) {
        return $feature.name + " (" + Round(pop/1000000, 1) + "M)";
      }
      return $feature.name;
    `
  }
}];
```

## Math Functions

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

## Text Functions

```arcade
Upper("hello")           // "HELLO"
Lower("HELLO")           // "hello"
Trim("  hello  ")        // "hello"
Left("hello", 2)         // "he"
Right("hello", 2)        // "lo"
Find("l", "hello")       // 2
Replace("hello", "l", "L") // "heLLo"
Split("a,b,c", ",")      // ["a", "b", "c"]
Concatenate(["a", "b"])  // "ab"
```

## Date Functions

```arcade
Now()                                    // Current date/time
Today()                                  // Current date
Year($feature.date_field)               // Extract year
Month($feature.date_field)              // Extract month
Day($feature.date_field)                // Extract day
DateDiff(Now(), $feature.date, "days")  // Days between
Text($feature.date, "MMMM D, YYYY")     // Format date
```

## Geometry Functions

```arcade
Area($feature, "square-kilometers")
Length($feature, "kilometers")
Centroid($feature)
Buffer($feature, 100, "meters")
Intersects($feature, $otherFeature)
Contains($feature, $point)
```

## Conditional Functions

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
  "Unknown"
)
```

## Array Functions

```arcade
var arr = [1, 2, 3, 4, 5];
Count(arr)               // 5
First(arr)               // 1
Last(arr)                // 5
IndexOf(arr, 3)          // 2
Includes(arr, 3)         // true
Push(arr, 6)             // adds 6
Reverse(arr)             // reverses
Sort(arr)                // sorts
Slice(arr, 1, 3)         // [2, 3]
```

## Feature Access

```arcade
// Current feature
$feature.fieldName

// All features in layer
var allFeatures = FeatureSet($layer);
var filtered = Filter(allFeatures, "type = 'A'");
var total = Sum(filtered, "value");

// Related records
var related = FeatureSetByRelationshipName($feature, "relationshipName");

// Global variables
$map, $view, $datastore
```

## Execute Programmatically

```javascript
import Arcade from "@arcgis/core/arcade/Arcade.js";

const profile = {
  variables: [{ name: "$feature", type: "feature" }]
};

const executor = await Arcade.createArcadeExecutor(
  "Round($feature.value * 100, 2)",
  profile
);

const result = executor.execute({ $feature: graphic });
```

## Arcade in HTML

```html
<script type="text/plain" id="my-expression">
  var total = $feature.value_a + $feature.value_b;
  return Round(total, 1);
</script>

<script type="module">
  const expression = document.getElementById("my-expression").text;
  layer.popupTemplate = {
    expressionInfos: [{ name: "calc", expression }],
    content: "Value: {expression/calc}"
  };
</script>
```

## Common Pitfalls

1. **Null values** - Check with `IsEmpty($feature.field)`
2. **Type coercion** - Use `Number()` or `Text()` for conversion
3. **Case sensitivity** - Functions case-insensitive, field names exact
4. **Performance** - Complex expressions slow down rendering
5. **Debugging** - Use `Console()` function
