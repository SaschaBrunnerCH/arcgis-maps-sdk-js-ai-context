# Agent Guide: arcgis-embeddable-maps

Quick-reference for choosing between embedded maps and full map components.

## Decision: arcgis-embedded-map vs arcgis-map

| Requirement | `arcgis-embedded-map` | `arcgis-map` |
|------------|----------------------|-------------|
| Simple WebMap display | Yes | Yes |
| Custom widgets | No | Yes |
| Feature editing | No | Yes |
| Layer manipulation (add/remove) | No | Yes |
| Programmatic view control | Limited | Full |
| Custom popups | No | Yes |
| Min code / setup | Minimal | More setup |
| Blog/article embed | Ideal | Overkill |
| Dashboard widget | Good fit | Also works |
| Full GIS application | Not suitable | Required |

**Rule of thumb:** If you need anything beyond displaying a WebMap with built-in controls, use `arcgis-map`.

## Setup Checklist

- [ ] Load embeddable-components package (CDN script or ESM import)
- [ ] Create `<arcgis-embedded-map>` element with explicit dimensions
- [ ] Set `item-id` to a valid WebMap portal item ID
- [ ] Set `portal-url` if using ArcGIS Enterprise (default is ArcGIS Online)
- [ ] Set `api-key` if the WebMap requires authentication
- [ ] Enable desired UI controls (`legend-enabled`, `bookmarks-enabled`, etc.)
- [ ] Consider disabling `scroll-enabled` for inline page embeds
- [ ] Choose theme: `"light"` (default) or `"dark"`

## UI Controls Reference

| Control | Attribute | What It Shows |
|---------|-----------|--------------|
| Heading | `heading-enabled` | WebMap title bar |
| Legend | `legend-enabled` | Layer symbology legend |
| Bookmarks | `bookmarks-enabled` | Named spatial bookmarks |
| Basemap gallery | `basemap-gallery-enabled` | Basemap switcher |
| Information | `information-enabled` | WebMap description |
| Share | `share-enabled` | Open in Map Viewer button |
| Fullscreen | `fullscreen-disabled` (inverted) | Fullscreen toggle (on by default) |
| Time zone label | `time-zone-label-enabled` | Time zone display |
