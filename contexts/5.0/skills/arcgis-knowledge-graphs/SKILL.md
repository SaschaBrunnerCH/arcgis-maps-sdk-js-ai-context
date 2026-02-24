---
name: arcgis-knowledge-graphs
description: Work with ArcGIS Knowledge graphs for storing, querying, and visualizing connected data using KnowledgeGraphLayer, LinkChartView, and openCypher queries. Use for graph databases, relationship visualization, and entity exploration.
---

# ArcGIS Knowledge Graphs

Use this skill for knowledge graphs, graph queries (openCypher), link chart visualization, and entity-relationship management.

## Import Patterns

### ESM (npm)
```javascript
// Knowledge graph service
import * as knowledgeGraphService from "@arcgis/core/rest/knowledgeGraphService.js";

// Layers
import KnowledgeGraphLayer from "@arcgis/core/layers/KnowledgeGraphLayer.js";
import LinkChartLayer from "@arcgis/core/layers/LinkChartLayer.js";

// Views and charts
import WebLinkChart from "@arcgis/core/WebLinkChart.js";
import LinkChartView from "@arcgis/core/views/LinkChartView.js";

// Layout settings
import OrganicLayoutSettings from "@arcgis/core/linkChart/OrganicLayoutSettings.js";
import ChronologicalLayoutSettings from "@arcgis/core/linkChart/ChronologicalLayoutSettings.js";
import LinkChartLayoutSwitcher from "@arcgis/core/linkChart/LinkChartLayoutSwitcher.js";
```

### CDN (dynamic import)
```javascript
const knowledgeGraphService = await $arcgis.import("@arcgis/core/rest/knowledgeGraphService.js");
const KnowledgeGraphLayer = await $arcgis.import("@arcgis/core/layers/KnowledgeGraphLayer.js");
const WebLinkChart = await $arcgis.import("@arcgis/core/WebLinkChart.js");
const LinkChartView = await $arcgis.import("@arcgis/core/views/LinkChartView.js");
```

## Knowledge Graph Service

### Fetch Knowledge Graph

```javascript
const url = "https://your-server/server/rest/services/Hosted/YourKG/KnowledgeGraphServer";
const knowledgeGraph = await knowledgeGraphService.fetchKnowledgeGraph(url);

console.log("Graph name:", knowledgeGraph.name);
console.log("Entity types:", knowledgeGraph.dataModel.entityTypes);
console.log("Relationship types:", knowledgeGraph.dataModel.relationshipTypes);
```

### Service Functions

| Function | Description |
|----------|-------------|
| `fetchKnowledgeGraph(url)` | Fetch knowledge graph metadata and data model |
| `executeQuery(kg, params)` | Execute openCypher query, return all results |
| `executeQueryStreaming(kg, params)` | Stream large query results |
| `executeSearch(kg, params)` | Full-text search across entities |
| `executeApplyEdits(kg, params)` | Add, update, or delete entities and relationships |

## KnowledgeGraphLayer

### Add to Map

```javascript
const kgLayer = new KnowledgeGraphLayer({
  url: "https://your-server/server/rest/services/Hosted/YourKG/KnowledgeGraphServer"
});

await kgLayer.load();
map.add(kgLayer);
```

### Configure Sublayers

```javascript
const kgLayer = new KnowledgeGraphLayer({
  url: "...",
  inclusionModeDefinition: {
    generateAllSublayers: false,
    namedTypeDefinitions: new Map([
      ["Person", { useAllData: true }],
      ["Location", { useAllData: true }]
    ])
  }
});
```

## Querying with openCypher

### Basic Query

```javascript
const result = await knowledgeGraphService.executeQuery(knowledgeGraph, {
  openCypherQuery: "MATCH (n:Person) RETURN n LIMIT 10"
});

console.log("Results:", result.resultRows);
```

### Streaming Query (Large Results)

```javascript
const queryResults = await knowledgeGraphService.executeQueryStreaming(knowledgeGraph, {
  openCypherQuery: "MATCH (n:Person)-[r]->(m) RETURN n, r, m"
});

const reader = queryResults.resultRowsStream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  value.forEach(row => {
    console.log("Row:", row);
  });
}
```

### Spatial Query with Bind Parameters

```javascript
import Polygon from "@arcgis/core/geometry/Polygon.js";

const searchArea = new Polygon({
  rings: [[
    [-76, 45], [-70, 45], [-70, 40], [-76, 40], [-76, 45]
  ]]
});

const queryResults = await knowledgeGraphService.executeQueryStreaming(knowledgeGraph, {
  openCypherQuery: `
    MATCH path=(a:User)-[]->(b:Observation)
    WHERE esri.graph.ST_Intersects($geometry, b.shape)
    RETURN path
  `,
  bindParameters: {
    geometry: searchArea
  }
});
```

### Query with Filters

```javascript
// Filter by property
const result = await knowledgeGraphService.executeQuery(knowledgeGraph, {
  openCypherQuery: `
    MATCH (p:Person)
    WHERE p.age > 30 AND p.name CONTAINS 'John'
    RETURN p
  `
});

// Query relationships
const result = await knowledgeGraphService.executeQuery(knowledgeGraph, {
  openCypherQuery: `
    MATCH (p:Person)-[r:WORKS_AT]->(c:Company)
    WHERE c.name = 'Esri'
    RETURN p.name, r.startDate, c.name
  `
});
```

## Common openCypher Patterns

```cypher
-- Find all entities of a type
MATCH (p:Person) RETURN p

-- Find relationships
MATCH (a)-[r]->(b) RETURN a, r, b

-- Find path with depth
MATCH path = (a:Person)-[:KNOWS*1..3]->(b:Person)
WHERE a.name = 'John'
RETURN path

-- Aggregate
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
RETURN c.name, COUNT(p) as employeeCount

-- Spatial filter
MATCH (loc:Location)
WHERE esri.graph.ST_Intersects($geometry, loc.shape)
RETURN loc
```

## Search Knowledge Graph

```javascript
const searchResults = await knowledgeGraphService.executeSearch(knowledgeGraph, {
  searchQuery: "John Smith",
  typeCategoryFilter: "entity", // "entity", "relationship", "both"
  typeNames: ["Person", "Employee"],
  returnSearchContext: true
});

searchResults.results.forEach(result => {
  console.log("Found:", result.typeName, result.id);
  console.log("Context:", result.searchContext);
});
```

## Apply Edits

```javascript
// Add entity
await knowledgeGraphService.executeApplyEdits(knowledgeGraph, {
  entityAdds: [{
    typeName: "Person",
    properties: { name: "Jane Doe", age: 28 }
  }]
});

// Update entity
await knowledgeGraphService.executeApplyEdits(knowledgeGraph, {
  entityUpdates: [{
    typeName: "Person",
    properties: { globalId: "{existing-global-id}", age: 29 }
  }]
});

// Delete entity
await knowledgeGraphService.executeApplyEdits(knowledgeGraph, {
  entityDeletes: [{
    typeName: "Person",
    ids: ["{global-id-to-delete}"]
  }]
});

// Add relationship
await knowledgeGraphService.executeApplyEdits(knowledgeGraph, {
  relationshipAdds: [{
    typeName: "WORKS_AT",
    properties: {
      originGlobalId: "{person-global-id}",
      destinationGlobalId: "{company-global-id}",
      startDate: new Date()
    }
  }]
});
```

## Data Model

```javascript
const dataModel = knowledgeGraph.dataModel;

dataModel.entityTypes.forEach(entityType => {
  console.log("Entity:", entityType.name);
  console.log("Properties:", entityType.properties);
});

dataModel.relationshipTypes.forEach(relType => {
  console.log("Relationship:", relType.name);
  console.log("Origin:", relType.originEntityTypes);
  console.log("Destination:", relType.destinationEntityTypes);
});
```

## Link Chart Visualization

### Create Link Chart (Core API)

```javascript
const linkChartLayer = new LinkChartLayer({
  url: "https://your-server/.../KnowledgeGraphServer"
});

const linkChart = new WebLinkChart({
  layers: [linkChartLayer]
});

const linkChartView = new LinkChartView({
  container: "linkChartDiv",
  map: linkChart,
  highlightOptions: {
    color: [0, 255, 255, 1],
    haloColor: [0, 255, 255, 0.5],
    haloOpacity: 0.8
  }
});
```

### Link Chart Component

```html
<arcgis-link-chart>
  <arcgis-legend slot="top-right"></arcgis-legend>
  <arcgis-zoom slot="bottom-right"></arcgis-zoom>
</arcgis-link-chart>

<script type="module">
  const linkChartComponent = document.querySelector("arcgis-link-chart");
  await linkChartComponent.componentOnReady();

  const lcView = linkChartComponent.view;
  const linkChart = lcView.map;

  await linkChart.addRecords([
    { id: "entity1", typeName: "Person" },
    { id: "entity2", typeName: "Company" }
  ]);
</script>
```

### Adding and Removing Records

```javascript
// Add records
await linkChart.addRecords([
  { id: "person-1", typeName: "Person" },
  { id: "company-1", typeName: "Company" },
  { id: "rel-1", typeName: "WORKS_AT" }
]);

// Remove records
await linkChart.removeRecords([
  { id: "person-1", typeName: "Person" }
]);
```

### Expand Entities

```javascript
await linkChart.expand({
  ids: ["entity-id"],
  typeName: "Person",
  relationshipTypes: ["KNOWS", "WORKS_AT"],
  direction: "both" // "outgoing", "incoming", "both"
});
```

### Navigate to Entities

```javascript
linkChartView.goTo([
  { id: "person-1", typeName: "Person" }
]);
```

### Link Chart Events

```javascript
linkChartView.on("click", async (event) => {
  const response = await linkChartView.hitTest(event);
  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked:", graphic.attributes);
  }
});
```

### Update Link Chart from Query Results

```javascript
async function updateLinkChart(queryResults, linkChart) {
  const reader = queryResults.resultRowsStream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const records = [];
    for (const row of value) {
      for (const record of row[0].path) {
        records.push({
          id: record.id,
          typeName: record.typeName
        });
      }
    }

    await linkChart.addRecords(records);
  }
}
```

## Layout Settings

### Organic Layout

```javascript
const organicLayout = new OrganicLayoutSettings();
linkChart.layoutSettings = organicLayout;
```

### Chronological Layout

```javascript
const chronoLayout = new ChronologicalLayoutSettings();
linkChart.layoutSettings = chronoLayout;
```

### Layout Switcher Widget

```javascript
const layoutSwitcher = new LinkChartLayoutSwitcher({
  view: linkChartView
});

linkChartView.ui.add(layoutSwitcher, "top-right");
```

### Layout Switcher Component

```html
<arcgis-link-chart>
  <arcgis-link-chart-layout-switcher slot="top-right"></arcgis-link-chart-layout-switcher>
</arcgis-link-chart>
```

## WebLinkChart Properties

```javascript
const webLinkChart = new WebLinkChart({
  portalItem: { id: "LINKCHART_ID" },
  layoutSettings: organicLayout
});

// Save to portal
await webLinkChart.saveAs({
  title: "My Link Chart",
  snippet: "Visualization of entity relationships"
});
```

## Common Pitfalls

1. **Authentication required**: Knowledge graph services typically require authentication — configure credentials or OAuth.

2. **Streaming for large results**: Use `executeQueryStreaming` for queries that may return many results; `executeQuery` loads everything into memory.

3. **Geometry conversion**: Convert geometries to WGS84 before using in spatial queries with `esri.graph.ST_Intersects`.

4. **Case sensitivity**: openCypher property names are case-sensitive — `p.Name` and `p.name` are different.

5. **Load before querying**: Ensure `await kgLayer.load()` before accessing sublayers or metadata.

6. **Link chart records**: Both entities and relationships must be added as records for links to display.

## Reference Samples

- `knowledgegraph-query` — Querying knowledge graphs with openCypher
- `knowledgegraph-knowledgegraphlayer` — Using KnowledgeGraphLayer
- `knowledgegraph-search` — Full-text search
- `knowledgegraph-applyedits` — Editing graph entities
- `knowledgegraph-datamodelediting` — Data model editing
- `linkchart` — Link chart visualization

## Related Skills

- `arcgis-layers` — Layer configuration and management
- `arcgis-interaction` — Hit testing and event handling
- `arcgis-editing` — Feature editing patterns
