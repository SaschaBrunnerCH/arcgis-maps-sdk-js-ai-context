# Agent Guide: arcgis-ai-components

Quick-reference decisions, checklists, and prerequisite verification for adding AI assistant capabilities.

## Prerequisites Checklist

Before using AI components, verify:

- [ ] Web map has good layer metadata (descriptions, field aliases, tags)
- [ ] Web map has embeddings stored as an item resource (see Web map setup guide)
- [ ] End user is a signed-in named ArcGIS Online user (not trial, not public account)
- [ ] End user has access to the web map and its layers
- [ ] AI assistants are enabled in the ArcGIS Online organization settings
- [ ] Beta apps are not blocked in the organization settings
- [ ] End user has the role privilege to use AI assistants

## Agent Selection Guide

| User Need | Agent Component | Example Prompts |
|-----------|----------------|-----------------|
| Navigate the map | `arcgis-assistant-navigation-agent` | "Zoom to California", "Go to the largest feature" |
| Analyze data | `arcgis-assistant-data-exploration-agent` | "What is the average?", "Show top 10 by value" |
| Understand the map | `arcgis-assistant-help-agent` | "What layers are here?", "Describe the data" |
| Domain-specific tasks | `arcgis-assistant-agent` (custom) | Depends on your tool definitions |

**Recommendation:** Include all three built-in agents for most applications. The assistant's orchestration automatically routes queries to the appropriate agent.

## Decision: Custom Agent vs Built-in Agents

Use **built-in agents only** when:
- Your map has standard GIS data (feature layers with attributes)
- Users need navigation, data queries, and map help
- No domain-specific logic is required

Use **custom agents** (`arcgis-assistant-agent`) when:
- You need integration with external APIs (weather, census, etc.)
- Domain-specific business logic is required
- You want specialized data processing or formatting
- The built-in agents don't cover your use case

## Layout Decision

| Layout | When to Use |
|--------|------------|
| Side panel (`calcite-shell-panel`) | Persistent assistant always visible alongside map |
| Expand widget (`arcgis-expand`) | Space-constrained UI, assistant toggled on demand |
| Custom panel | Framework-managed layout (React, Angular, etc.) |

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No response to messages | No agents registered | Add agent components as children |
| Authentication error | User not signed in or lacks privileges | Check org settings and user roles |
| Agent misunderstands data | Poor layer metadata | Add field aliases, descriptions, embeddings |
| Agent can't find features | Missing `reference-element` | Set to valid `arcgis-map` CSS selector |
