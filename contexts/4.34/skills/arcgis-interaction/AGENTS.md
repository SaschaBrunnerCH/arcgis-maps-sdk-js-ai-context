# Agent Guide: arcgis-interaction

Quick-reference decisions, checklists, and tables for user interaction patterns.

## Hit Test vs Query vs Popup Decision Matrix

| Need | Approach | Method |
|------|----------|--------|
| User clicks a feature and sees info | Popup (built-in) | Set `popupTemplate` on layer, it works automatically |
| User clicks and you run custom logic | Hit test | `view.hitTest(event)` in a click handler |
| Find all features in an area | Spatial query | `featureLayer.queryFeatures(query)` |
| Highlight features by attribute | Attribute query + highlight | `queryObjectIds()` then `layerView.highlight(oids)` |
| Show a cursor change on hover | Hit test on pointer-move | `view.hitTest(event)` in a pointer-move handler |
| Draw a shape and select features in it | Sketch + spatial query | Sketch widget for drawing, then query with the geometry |

### When to use each:

- **Popup** -- Simplest. Just configure `popupTemplate` on the layer. No code for the interaction itself.
- **Hit test** -- Returns the graphic at a screen point. Use when you need the actual feature object for custom behavior (not just a popup).
- **Server query** -- Returns features matching SQL/spatial criteria from the service. Use for bulk operations or features not visible on screen.
- **Client query** -- `layerView.queryFeatures()` queries only loaded features. Faster but limited to what is in the view.

## Click-to-Select Implementation Checklist

- [ ] Get a reference to the target `FeatureLayer`
- [ ] Get the LayerView: `const layerView = await view.whenLayerView(featureLayer)`
- [ ] Store a highlight handle variable: `let highlightHandle = null`
- [ ] Add click handler: `view.on("click", async (event) => { ... })`
- [ ] Inside handler, run hit test: `const response = await view.hitTest(event, { include: [featureLayer] })`
- [ ] Remove previous highlight: `highlightHandle?.remove()`
- [ ] If results found, highlight: `highlightHandle = layerView.highlight(graphic)`
- [ ] Optionally open popup or update side panel with feature attributes

## Cleanup Pattern

Always clean up handles and event listeners to prevent memory leaks.

### Handle-based cleanup (highlight, watch)
```
const handle = layerView.highlight(graphic);
// Later:
handle.remove();
```

### Event listener cleanup
```
const handle = view.on("click", handler);
// Later:
handle.remove();
```

### reactiveUtils cleanup
```
const handle = reactiveUtils.watch(() => view.zoom, callback);
// Later:
handle.remove();
```

### Destroy pattern (widgets)
```
widget.destroy();  // Removes from DOM and cleans up
```

### Checklist for cleanup
- [ ] Store all `view.on()` return handles
- [ ] Store all `reactiveUtils.watch()` / `when()` / `once()` return handles
- [ ] Store all `layerView.highlight()` return handles
- [ ] Call `.remove()` on handles when the interaction is no longer needed
- [ ] Call `.destroy()` on widgets when removing them
- [ ] In frameworks (React/Angular): clean up in unmount/destroy lifecycle hooks

## Event Types Quick Reference

| Event | Fires when | Common use |
|-------|-----------|------------|
| `click` | User clicks the map | Feature selection, custom popups |
| `double-click` | User double-clicks | Override default zoom behavior |
| `pointer-move` | Mouse moves over map | Hover highlighting, coordinate display |
| `pointer-down` / `pointer-up` | Mouse button pressed/released | Custom drag interactions |
| `drag` | User drags the map | Custom pan behavior |
| `key-down` / `key-up` | Keyboard input while map focused | Keyboard shortcuts |
| `hold` | Long press | Mobile context menu |

### Preventing Default Behavior
```
view.on("double-click", (event) => {
  event.stopPropagation();  // Prevents default zoom-in
});
```

## Coordinate Conversion Quick Reference

| Direction | Method |
|-----------|--------|
| Screen (pixels) to Map (geographic) | `view.toMap({ x, y })` |
| Map (geographic) to Screen (pixels) | `view.toScreen(mapPoint)` |
| Click event to Map point | `event.mapPoint` (already available) |
| Pointer event to Map point | `view.toMap(event)` (must convert) |

## Highlight Options

| Property | Default | Purpose |
|----------|---------|---------|
| `color` | `[0, 255, 255, 1]` (cyan) | Highlight outline/halo color |
| `haloOpacity` | `1` | Opacity of the halo around features |
| `fillOpacity` | `0.25` | Opacity of the fill inside features |

Set on `layerView.highlightOptions` or at the `MapView` / `SceneView` level.
