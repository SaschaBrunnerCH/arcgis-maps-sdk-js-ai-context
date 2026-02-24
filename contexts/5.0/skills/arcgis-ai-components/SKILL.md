---
name: arcgis-ai-components
description: Add AI-powered natural language assistants to maps using the ArcGIS AI Components package. Use for chat-based map interaction, data exploration, navigation, and custom agents.
---

# ArcGIS AI Components

Use this skill when adding AI assistant capabilities to a web map, enabling users to interact with map data through natural language chat. This is a **new package in 5.0** (`@arcgis/ai-components`) with no 4.x equivalent.

> **Beta:** AI Components are in beta as of 5.0. APIs may change in future releases.

## Import Patterns

### CDN (Recommended for AI Components)
AI components auto-register when loaded via the SDK CDN:
```html
<!-- Load ArcGIS Maps SDK (includes ai-components registration) -->
<script type="module" src="https://js.arcgis.com/5.0/"></script>
```

### Direct ESM Imports (Build Tools)
```javascript
import "@arcgis/ai-components/components/arcgis-assistant";
import "@arcgis/ai-components/components/arcgis-assistant-navigation-agent";
import "@arcgis/ai-components/components/arcgis-assistant-data-exploration-agent";
import "@arcgis/ai-components/components/arcgis-assistant-help-agent";
import "@arcgis/ai-components/components/arcgis-assistant-agent";
```

### Utility Functions
```javascript
import {
  invokeTextPrompt,
  invokeStructuredPrompt,
  invokeToolPrompt,
  sendTraceMessage,
  getEmbeddings,
  cosineSimilarity
} from "@arcgis/ai-components/utils";
```

## Core Architecture

The AI assistant uses a **component + agent** architecture:

- **`arcgis-assistant`** - The chat UI container. Manages conversation, routes user messages to registered agents, and displays responses.
- **Agent components** - Slotted children of the assistant. Each agent handles a specific domain (navigation, data exploration, help). The assistant orchestrates which agent handles each query.

```
arcgis-assistant
  ├── arcgis-assistant-navigation-agent      (pan, zoom, go to locations)
  ├── arcgis-assistant-data-exploration-agent (query data, statistics, charts)
  ├── arcgis-assistant-help-agent            (answer questions about the map/agents)
  └── arcgis-assistant-agent                 (custom agent wrapper)
```

## Basic Setup

### Minimal Example (CDN)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Assistant</title>
  <script type="module" src="https://js.arcgis.com/5.0/"></script>
  <style>
    html, body { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <calcite-shell>
    <arcgis-map id="my-map" item-id="c13bffcad4a244a99062e915e9bc1dc3">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
    </arcgis-map>
    <calcite-shell-panel slot="panel-end" width="l">
      <calcite-panel>
        <arcgis-assistant
          reference-element="#my-map"
          heading="Map Assistant"
          description="Ask questions about the data on this map."
          entry-message="Hello! I can help you explore this map.">
          <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
          <arcgis-assistant-data-exploration-agent></arcgis-assistant-data-exploration-agent>
          <arcgis-assistant-help-agent></arcgis-assistant-help-agent>
        </arcgis-assistant>
      </calcite-panel>
    </calcite-shell-panel>
  </calcite-shell>
</body>
</html>
```

## arcgis-assistant Component

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `referenceElement` | `reference-element` | `string \| HTMLArcgisMapElement` | - | **Required.** CSS selector or element reference to an `arcgis-map`. Provides map context to agents. |
| `heading` | `heading` | `string` | - | Title displayed at the top of the assistant panel |
| `description` | `description` | `string` | - | Subtitle text describing the assistant's capabilities |
| `entryMessage` | `entry-message` | `string` | - | Welcome message shown before the user starts chatting |
| `suggestedPrompts` | - | `string[]` | - | Array of suggested prompts displayed as clickable chips (set via JS only) |
| `keepSuggestedPrompts` | `keep-suggested-prompts` | `boolean` | `false` | Keep suggested prompts visible after the user submits a message |
| `feedbackEnabled` | `feedback-enabled` | `boolean` | `false` | Show thumbs up/down feedback buttons on assistant messages |
| `logEnabled` | `log-enabled` | `boolean` | `false` | Show agent execution logs (tool calls, reasoning steps) |
| `copyEnabled` | `copy-enabled` | `boolean` | `false` | Allow users to copy assistant message content |
| `messages` | - | `ChatMessage[]` | `[]` | The conversation history (read/write) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `clearChatHistory()` | `void` | Clears the conversation and resets the assistant |
| `submitMessage(message)` | `void` | Programmatically submit a user message to the assistant |
| `componentOnReady()` | `Promise<this>` | Resolves when the component is fully loaded |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `arcgisSubmit` | `{ message: string }` | Fired when the user submits a message |
| `arcgisReady` | - | Fired when the assistant is initialized and ready |
| `arcgisFeedback` | `AssistantMessage` | Fired when the user provides feedback on a message |
| `arcgisError` | `Error` | Fired when an error occurs during agent execution |
| `arcgisInterrupt` | - | Fired when the user interrupts an in-progress response |
| `arcgisInterruptCancel` | - | Fired when an interrupt is cancelled |
| `arcgisInterruptSubmit` | - | Fired when a new message is submitted while interrupting |
| `arcgisCancel` | - | Fired when processing is cancelled |

## Built-in Agents

### arcgis-assistant-navigation-agent
Handles map navigation requests: panning, zooming, going to specific locations or features.

```html
<arcgis-assistant reference-element="#my-map">
  <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
</arcgis-assistant>
```

**User prompt examples:** "Zoom to New York City", "Go to the largest feature", "Pan north"

**Properties:**
| Property | Attribute | Type | Description |
|----------|-----------|------|-------------|
| `referenceElement` | `reference-element` | `string \| HTMLArcgisMapElement` | Override the map reference (inherits from parent assistant if not set) |

### arcgis-assistant-data-exploration-agent
Queries and analyzes layer data: statistics, filters, feature counts, and data summaries.

```html
<arcgis-assistant reference-element="#my-map">
  <arcgis-assistant-data-exploration-agent></arcgis-assistant-data-exploration-agent>
</arcgis-assistant>
```

**User prompt examples:** "What is the total population?", "Show me the top 5 features by area", "How many features have value > 100?"

**Properties:**
| Property | Attribute | Type | Description |
|----------|-----------|------|-------------|
| `referenceElement` | `reference-element` | `string \| HTMLArcgisMapElement` | Override the map reference |

### arcgis-assistant-help-agent
Answers questions about the map, its layers, metadata, and the capabilities of other registered agents.

```html
<arcgis-assistant reference-element="#my-map">
  <arcgis-assistant-help-agent></arcgis-assistant-help-agent>
</arcgis-assistant>
```

**User prompt examples:** "What layers are on this map?", "What can you help me with?", "Describe the data"

**Properties:**
| Property | Attribute | Type | Description |
|----------|-----------|------|-------------|
| `referenceElement` | `reference-element` | `string \| HTMLArcgisMapElement` | Override the map reference |

## Configuring the Assistant

### Setting Suggested Prompts (JavaScript)
```javascript
const assistant = document.querySelector("arcgis-assistant");
assistant.suggestedPrompts = [
  "What is the total change in wheat production from 2017 to 2022?",
  "Go to the county that produced the most wheat in 2022.",
  "How many counties produced less wheat in 2022 than in 2017?"
];
```

### Enabling Developer Features
```html
<arcgis-assistant
  reference-element="#my-map"
  log-enabled
  copy-enabled
  feedback-enabled
  heading="Data Explorer"
  description="Ask questions about the map data."
  entry-message="Welcome! Try asking about the data.">
  <!-- agents -->
</arcgis-assistant>
```

### Listening for Events
```javascript
const assistant = document.querySelector("arcgis-assistant");

assistant.addEventListener("arcgisSubmit", (event) => {
  console.log("User submitted:", event.detail.message);
});

assistant.addEventListener("arcgisFeedback", (event) => {
  const { feedback } = event.detail;
  console.log("Feedback:", feedback); // { positive: true } or { positive: false }
});

assistant.addEventListener("arcgisError", (event) => {
  console.error("Assistant error:", event.detail);
});
```

### Programmatic Message Submission
```javascript
const assistant = document.querySelector("arcgis-assistant");
await assistant.componentOnReady();

// Submit a message as if the user typed it
assistant.submitMessage("Show me the top 10 features by population");
```

## Custom Agents

Use `arcgis-assistant-agent` to register a custom agent with the assistant.

### Defining a Custom Agent
```javascript
import { invokeTextPrompt } from "@arcgis/ai-components/utils";

const assistant = document.querySelector("arcgis-assistant");
const customAgent = document.querySelector("arcgis-assistant-agent");

customAgent.agentRegistration = {
  name: "weather-agent",
  description: "Answers questions about current weather conditions at map locations.",
  systemPrompt: "You are a weather assistant. Use the provided tools to get weather data.",
  tools: [
    {
      name: "getWeather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          latitude: { type: "number", description: "Latitude" },
          longitude: { type: "number", description: "Longitude" }
        },
        required: ["latitude", "longitude"]
      },
      execute: async ({ latitude, longitude }) => {
        const response = await fetch(
          `https://api.weather.gov/points/${latitude},${longitude}`
        );
        const data = await response.json();
        return JSON.stringify(data.properties);
      }
    }
  ]
};
```

```html
<arcgis-assistant reference-element="#my-map">
  <arcgis-assistant-agent></arcgis-assistant-agent>
  <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
</arcgis-assistant>
```

### Utility Functions for Custom Agents

| Function | Description |
|----------|-------------|
| `invokeTextPrompt(options)` | Send a text prompt to the LLM and get a text response |
| `invokeStructuredPrompt(options)` | Send a prompt and get a structured (JSON) response |
| `invokeToolPrompt(options)` | Send a prompt with tool definitions for function calling |
| `sendTraceMessage(data)` | Send trace/debug messages to the assistant log |
| `getEmbeddings(texts)` | Generate text embeddings for semantic search |
| `cosineSimilarity(a, b)` | Compute cosine similarity between two embedding vectors |

## Web Map Requirements for AI Agents

For agents to work effectively with a web map:

1. **Layer metadata** - Layers must have good metadata (descriptions, field aliases, tags).
2. **Embeddings** - The web map should have embeddings stored as an item resource. See the Web map setup guide for details.
3. **User requirements:**
   - Signed-in named user of an ArcGIS Online organization (no trial/public accounts)
   - User must have access to the web map and its layers
   - AI assistants must be enabled in the organization settings
   - Beta apps must not be blocked in the organization settings
   - The user must have the role privilege to use AI assistants

## Layout Patterns

### Side Panel Layout (Recommended)
```html
<calcite-shell>
  <arcgis-map id="map" item-id="YOUR_WEBMAP_ID">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-expand slot="top-left">
      <arcgis-legend></arcgis-legend>
    </arcgis-expand>
  </arcgis-map>
  <calcite-shell-panel slot="panel-end" width="l">
    <calcite-panel>
      <arcgis-assistant
        reference-element="#map"
        heading="Map Assistant"
        entry-message="Ask me anything about this map.">
        <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
        <arcgis-assistant-data-exploration-agent></arcgis-assistant-data-exploration-agent>
        <arcgis-assistant-help-agent></arcgis-assistant-help-agent>
      </arcgis-assistant>
    </calcite-panel>
  </calcite-shell-panel>
</calcite-shell>
```

### Expand Widget Layout
```html
<arcgis-map id="map" item-id="YOUR_WEBMAP_ID">
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-expand slot="top-right">
    <arcgis-assistant
      reference-element="#map"
      heading="Assistant"
      entry-message="How can I help?">
      <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
      <arcgis-assistant-data-exploration-agent></arcgis-assistant-data-exploration-agent>
      <arcgis-assistant-help-agent></arcgis-assistant-help-agent>
    </arcgis-assistant>
  </arcgis-expand>
</arcgis-map>
```

## Common Pitfalls

1. **Missing `reference-element`**: The assistant requires a reference to an `arcgis-map` element to provide context to agents.

   ```html
   <!-- Anti-pattern: no reference-element -->
   <arcgis-assistant heading="Assistant">
     <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
   </arcgis-assistant>
   <arcgis-map id="map" item-id="abc123"></arcgis-map>
   ```

   ```html
   <!-- Correct: point to the map element -->
   <arcgis-assistant reference-element="#map" heading="Assistant">
     <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
   </arcgis-assistant>
   <arcgis-map id="map" item-id="abc123"></arcgis-map>
   ```

   **Impact:** Agents have no map context and cannot execute navigation or data queries. They will fail silently or return errors.

2. **No agents registered**: The assistant itself has no built-in intelligence - you must slot at least one agent component.

   ```html
   <!-- Anti-pattern: assistant with no agents -->
   <arcgis-assistant reference-element="#map" heading="Assistant">
   </arcgis-assistant>
   ```

   ```html
   <!-- Correct: register agents as children -->
   <arcgis-assistant reference-element="#map" heading="Assistant">
     <arcgis-assistant-navigation-agent></arcgis-assistant-navigation-agent>
     <arcgis-assistant-data-exploration-agent></arcgis-assistant-data-exploration-agent>
     <arcgis-assistant-help-agent></arcgis-assistant-help-agent>
   </arcgis-assistant>
   ```

   **Impact:** The user can type messages but they are never processed. No responses are generated.

3. **Unauthenticated users**: AI components require a signed-in ArcGIS Online named user with AI assistant privileges. Anonymous or public users cannot use the assistant.

   **Impact:** The assistant panel may render but agent calls fail with authentication errors. Always check authentication status before showing the assistant UI.

4. **Poor layer metadata**: Agents rely on layer descriptions, field aliases, and embeddings to understand the map data. Layers with missing metadata produce poor or irrelevant responses.

   **Impact:** The data exploration agent may misidentify fields or give inaccurate summaries.

5. **`suggestedPrompts` set as HTML attribute**: The `suggestedPrompts` property accepts an array and can only be set via JavaScript, not as an HTML attribute.

   ```html
   <!-- Anti-pattern: HTML attribute (won't work) -->
   <arcgis-assistant suggested-prompts="What is the total?"></arcgis-assistant>
   ```

   ```javascript
   // Correct: set via JavaScript
   const assistant = document.querySelector("arcgis-assistant");
   assistant.suggestedPrompts = [
     "What is the total population?",
     "Go to the largest city"
   ];
   ```

   **Impact:** Suggested prompts are silently ignored when set as an HTML attribute string.

## Reference Samples

- `ai-assistant` - AI Assistant component with navigation, data exploration, and help agents

## Related Skills

- See `arcgis-core-maps` for setting up the map that the assistant references.
- See `arcgis-widgets-ui` for Calcite layout components (`calcite-shell`, `calcite-shell-panel`).
- See `arcgis-interaction` for non-AI approaches to map interaction (popups, hit tests).
