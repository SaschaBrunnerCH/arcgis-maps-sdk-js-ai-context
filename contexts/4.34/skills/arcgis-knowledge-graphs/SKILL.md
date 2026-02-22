---
name: arcgis-knowledge-graphs
description: Work with ArcGIS Knowledge graphs for storing and querying connected data. Use for graph databases, relationship visualization, and openCypher queries.
---

# ArcGIS Knowledge Graphs

Use this skill for working with knowledge graphs, graph queries, and relationship visualization.

## Knowledge Graph Service

### Fetch Knowledge Graph
```javascript
import KGModule from "@arcgis/core/rest/knowledgeGraphService.js";

const url = "https://your-server/server/rest/services/Hosted/YourKG/KnowledgeGraphServer";
const knowledgeGraph = await KGModule.fetchKnowledgeGraph(url);

console.log("Graph name:", knowledgeGraph.name);
console.log("Entity types:", knowledgeGraph.dataModel.entityTypes);
console.log("Relationship types:", knowledgeGraph.dataModel.relationshipTypes);
```

## KnowledgeGraphLayer

### Add to Map
```javascript
import KnowledgeGraphLayer from "@arcgis/core/layers/KnowledgeGraphLayer.js";

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
  // Only include specific entity types
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
import KGModule from "@arcgis/core/rest/knowledgeGraphService.js";

const result = await KGModule.executeQuery(knowledgeGraph, {
  openCypherQuery: "MATCH (n:Person) RETURN n LIMIT 10"
});

console.log("Results:", result.resultRows);
```

### Streaming Query (Large Results)
```javascript
const queryResults = await KGModule.executeQueryStreaming(knowledgeGraph, {
  openCypherQuery: "MATCH (n:Person)-[r]->(m) RETURN n, r, m"
});

// Read stream
const reader = queryResults.resultRowsStream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // Process chunk
  value.forEach(row => {
    console.log("Row:", row);
  });
}
```

### Spatial Query with Bind Parameters
```javascript
import KGModule from "@arcgis/core/rest/knowledgeGraphService.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";

// Create geometry for spatial filter
const searchArea = new Polygon({
  rings: [[
    [-76, 45],
    [-70, 45],
    [-70, 40],
    [-76, 40],
    [-76, 45]
  ]]
});

const queryResults = await KGModule.executeQueryStreaming(knowledgeGraph, {
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
const result = await KGModule.executeQuery(knowledgeGraph, {
  openCypherQuery: `
    MATCH (p:Person)
    WHERE p.age > 30 AND p.name CONTAINS 'John'
    RETURN p
  `
});

// Query relationships
const result = await KGModule.executeQuery(knowledgeGraph, {
  openCypherQuery: `
    MATCH (p:Person)-[r:WORKS_AT]->(c:Company)
    WHERE c.name = 'Esri'
    RETURN p.name, r.startDate, c.name
  `
});
```

## Link Chart Visualization

### Create Link Chart
```javascript
import WebLinkChart from "@arcgis/core/WebLinkChart.js";
import LinkChartView from "@arcgis/core/views/LinkChartView.js";
import LinkChartLayer from "@arcgis/core/layers/LinkChartLayer.js";

const linkChartLayer = new LinkChartLayer({
  url: "https://your-server/.../KnowledgeGraphServer"
});

const linkChart = new WebLinkChart({
  layers: [linkChartLayer]
});

const linkChartView = new LinkChartView({
  container: "linkChartDiv",
  map: linkChart
});
```

### LinkChartView Configuration

```javascript
const linkChartView = new LinkChartView({
  container: "linkChartDiv",
  map: linkChart,

  // Enable interaction
  highlightOptions: {
    color: [0, 255, 255, 1],
    haloColor: [0, 255, 255, 0.5],
    haloOpacity: 0.8
  },

  // Navigation
  navigation: {
    mouseWheelZoomEnabled: true,
    browserTouchPanEnabled: true
  }
});

// View events
linkChartView.on("click", async (event) => {
  const response = await linkChartView.hitTest(event);
  if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    console.log("Clicked:", graphic.attributes);
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

  // Add records to link chart
  linkChart.addRecords([
    { id: "entity1", typeName: "Person" },
    { id: "entity2", typeName: "Company" }
  ]);
</script>
```

### Link Chart Layout Settings

```javascript
// Access layout settings
const layoutSettings = linkChart.layoutSettings;

// Set an OrganicLayoutSettings or ChronologicalLayoutSettings instance
linkChart.layoutSettings = organicLayout;
```

### OrganicLayoutSettings

```javascript
import OrganicLayoutSettings from "@arcgis/core/linkCharts/OrganicLayoutSettings.js";

// Real properties include: absoluteIdealEdgeLength, autoRepulsionRadius,
// computationBudgetTime, among others. Refer to the API documentation
// for the full list of supported properties.
const organicLayout = new OrganicLayoutSettings();

linkChart.layoutSettings = organicLayout;
```

### ChronologicalLayoutSettings

```javascript
import ChronologicalLayoutSettings from "@arcgis/core/linkCharts/ChronologicalLayoutSettings.js";

// Real properties include: durationLineWidth, timeBannerUTCOffsetInMinutes,
// among others. Refer to the API documentation for the full list of
// supported properties.
const chronoLayout = new ChronologicalLayoutSettings();

linkChart.layoutSettings = chronoLayout;
```

### LinkChartLayoutSwitcher Widget

```javascript
import LinkChartLayoutSwitcher from "@arcgis/core/linkCharts/LinkChartLayoutSwitcher.js";

const layoutSwitcher = new LinkChartLayoutSwitcher({
  view: linkChartView
});

linkChartView.ui.add(layoutSwitcher, "top-right");
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

    linkChart.addRecords(records);
  }
}
```

### Expand Entities

```javascript
// Expand entity to show connections
await linkChart.expand({
  ids: ["entity-id"],
  typeName: "Person",
  relationshipTypes: ["KNOWS", "WORKS_AT"],
  direction: "both"  // outgoing, incoming, both
});
```

### Navigate to Entities

```javascript
// Go to specific entities
linkChartView.goTo([
  { id: "person-1", typeName: "Person" }
]);
```

### WebLinkChart Properties

```javascript
import WebLinkChart from "@arcgis/core/WebLinkChart.js";

const webLinkChart = new WebLinkChart({
  // Portal item (load existing)
  portalItem: { id: "LINKCHART_ID" },

  // Or create from scratch
  layers: [linkChartLayer],

  // Layout settings
  layoutSettings: organicLayout
});

// Save to portal
await webLinkChart.saveAs({
  title: "My Link Chart",
  snippet: "Visualization of entity relationships"
});
```

## Search Knowledge Graph

```javascript
import KGModule from "@arcgis/core/rest/knowledgeGraphService.js";

const searchResults = await KGModule.executeSearch(knowledgeGraph, {
  searchQuery: "John Smith",
  typeCategoryFilter: "entity", // or "relationship", "both"
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
import KGModule from "@arcgis/core/rest/knowledgeGraphService.js";

// Add entity
const addResult = await KGModule.executeApplyEdits(knowledgeGraph, {
  entityAdds: [{
    typeName: "Person",
    properties: {
      name: "Jane Doe",
      age: 28
    }
  }]
});

// Update entity
const updateResult = await KGModule.executeApplyEdits(knowledgeGraph, {
  entityUpdates: [{
    typeName: "Person",
    properties: {
      globalId: "{existing-global-id}",
      age: 29
    }
  }]
});

// Delete entity
const deleteResult = await KGModule.executeApplyEdits(knowledgeGraph, {
  entityDeletes: [{
    typeName: "Person",
    ids: ["{global-id-to-delete}"]
  }]
});

// Add relationship
const relResult = await KGModule.executeApplyEdits(knowledgeGraph, {
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
// Access data model
const dataModel = knowledgeGraph.dataModel;

// Entity types
dataModel.entityTypes.forEach(entityType => {
  console.log("Entity:", entityType.name);
  console.log("Properties:", entityType.properties);
});

// Relationship types
dataModel.relationshipTypes.forEach(relType => {
  console.log("Relationship:", relType.name);
  console.log("Origin:", relType.originEntityTypes);
  console.log("Destination:", relType.destinationEntityTypes);
});
```

## Common openCypher Patterns

```cypher
-- Find all entities
MATCH (n) RETURN n

-- Find specific type
MATCH (p:Person) RETURN p

-- Find relationships
MATCH (a)-[r]->(b) RETURN a, r, b

-- Find path
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

### Knowledge Graph Components

| Component | Purpose |
|-----------|---------|
| `arcgis-link-chart-layout-switcher` | Switch layout algorithms for link charts |

## Reference Samples

- `knowledgegraph-query` - Querying knowledge graphs
- `knowledgegraph-knowledgegraphlayer` - Using KnowledgeGraphLayer
- `knowledgegraph-search` - Searching knowledge graph entities
- `linkchart` - Link chart visualization of graph data

## Common Pitfalls

1. **Authentication required**: Knowledge graph services typically require authentication

2. **Streaming for large results**: Use `executeQueryStreaming` for queries that may return many results

3. **Geometry conversion**: Convert geometries to WGS84 before using in spatial queries

4. **Case sensitivity**: openCypher property names are case-sensitive

