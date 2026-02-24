# Agent Guide: arcgis-editing

Quick-reference decisions, checklists, and tables for feature editing and versioning.

## Editor Component vs Core API Decision

1. **Do you need a basic editing UI with default behavior?**
   - Yes --> `<arcgis-editor slot="top-right">` (Map Component)
   - No, need custom form layout or logic --> Core API `Editor` widget or `FeatureForm`

2. **Do you need a standalone form (not inside the Editor panel)?**
   - Yes --> `FeatureForm` widget or `<arcgis-feature-form>` component
   - No --> Editor handles forms internally

3. **Do you need programmatic edits without any UI?**
   - Yes --> `featureLayer.applyEdits()` directly

4. **Do you need version management?**
   - Yes --> `VersionManagementService` + `<arcgis-version-management>` component

| Approach | UI Provided | Geometry Editing | Form Editing | Flexibility |
|----------|------------|-----------------|--------------|-------------|
| `<arcgis-editor>` component | Full | Yes | Yes | Low (defaults) |
| `Editor` widget (Core API) | Full | Yes | Yes | High (layerInfos config) |
| `<arcgis-feature-form>` component | Form only | No | Yes | Medium |
| `FeatureForm` widget | Form only | No | Yes | High (custom form layout) |
| `applyEdits()` | None | Via code | Via code | Maximum |

## Edit Workflow Steps

### Interactive editing (Editor widget)
1. **Setup** -- Add Editor to view with `layerInfos` config
2. **Create** -- User selects template, draws geometry, fills form
3. **Update** -- User clicks feature, modifies geometry or attributes
4. **Delete** -- User selects feature and deletes

### Programmatic editing (applyEdits)
1. **Create Graphic** -- Build object with geometry and attributes
2. **Call applyEdits** -- `layer.applyEdits({ addFeatures: [graphic] })`
3. **Handle result** -- Check `result.addFeatureResults` for success/errors
4. **Refresh** -- Layer auto-refreshes; call `layer.refresh()` if needed

### Form-based editing (FeatureForm)
1. **Create form** -- `new FeatureForm({ layer, formTemplate })`
2. **Set feature** -- `form.feature = graphic`
3. **User edits** -- Form fields are populated and editable
4. **Validate** -- Check `form.valid` before proceeding
5. **Get values** -- `form.getValues()` returns updated attributes
6. **Apply** -- `layer.applyEdits({ updateFeatures: [graphic] })`

## Version Management Checklist

### Setup
- [ ] Have a branch-versioned feature service
- [ ] Create `VersionManagementService` with the service URL
- [ ] Await `vms.load()`

### Create and edit in a version
- [ ] Create version: `vms.createVersion({ versionName, access: "private" })`
- [ ] Switch layer: `featureLayer.gdbVersion = version.versionName`
- [ ] Refresh layer: `await featureLayer.refresh()`
- [ ] Start edit session: `await vms.startEditing({ versionIdentifier })`
- [ ] Apply edits: `await featureLayer.applyEdits(edits)`
- [ ] Reconcile: `await vms.reconcile({ versionIdentifier, conflictResolution: "favorEditVersion" })`
- [ ] Check for conflicts: `reconcileResult.hasConflicts`
- [ ] Post to parent: `await vms.post({ versionIdentifier })`
- [ ] Stop editing: `await vms.stopEditing({ versionIdentifier, saveEdits: true })`

### Cleanup
- [ ] Switch layer back: `featureLayer.gdbVersion = vms.defaultVersionIdentifier`
- [ ] Delete temp version: `await vms.deleteVersion({ versionName })`

## Form Element Types

| Type | Purpose |
|------|---------|
| `field` | Single editable field |
| `group` | Group of fields under a heading |
| `text` | Read-only instructional text (HTML) |
| `relationship` | Related records from relationships |

### Field Element Expression Types

| Expression Property | Controls |
|-------------------|----------|
| `visibilityExpression` | Whether the field is visible |
| `editableExpression` | Whether the field is editable |
| `requiredExpression` | Whether the field is required |
| `valueExpression` | Computed default value |

All expressions use Arcade syntax and must return `true`/`false`.

## applyEdits Operations

| Operation | Property | Value |
|-----------|----------|-------|
| Add features | `addFeatures` | Array of Graphics |
| Update features | `updateFeatures` | Array of Graphics (with existing OID) |
| Delete features | `deleteFeatures` | Array of Graphics or `[{ objectId: N }]` |

All three can be combined in a single `applyEdits()` call.

## Input Types Quick Reference

| Input Type | Field Types | Use Case |
|-----------|------------|----------|
| `text-box` | String, Number | Short text input |
| `text-area` | String | Long text, notes |
| `combo-box` | Coded value domains | Dropdown selection |
| `radio-buttons` | Coded value domains | Few choices visible |
| `switch` | Integer (0/1) | Boolean toggle |
| `date-picker` | Date | Date-only selection |
| `datetime-picker` | Date | Date + time selection |
| `time-picker` | Date | Time-only selection |
| `barcode-scanner` | String | Barcode/QR scanning |

See `arcgis-tables-forms` for detailed input type configuration.
