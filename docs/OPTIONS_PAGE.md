# Options Page

This page covers the minimum conventions required to add new options safely.

## Naming Rules

- Feature section names come from config keys.
- Checkbox IDs:
  - Standard: `parentKey-childKey-enabled-checkbox`
  - Special case when child key is `enabled`: `parentKey-enabled-checkbox`
- Section IDs tied to checkbox IDs:
  - `checkbox-id-section`
- Input IDs:
  - Input: `parentKey-childKey-input`
  - Input container: `parentKey-childKey-container`

Example:

- Config key: `search.useCustomEngine`
- Checkbox ID: `search-use-custom-engine-enabled-checkbox`
- Section ID: `search-use-custom-engine-enabled-checkbox-section`

## Required Wiring When Adding a Checkbox

1. Add the checkbox element to the UI.
2. Register it in `src/options/scripts/ui.ts`.
3. Add its checkbox/section mapping in `src/options/scripts/utils/toggle-checkbox.ts` (`checkboxSections`).
4. Update fill logic in `src/options/utils/fill-helpers/`.
5. Update save logic in `src/options/utils/save-helpers/`.

## Required Wiring When Adding an Input

1. Add input and container with correct IDs.
2. Register both in `src/options/scripts/ui.ts`.
3. Add save/fill handling in the matching helper files.
4. Use a valid placeholder value to show expected format.

## Useful Things

- If a control renders but does not persist, check `save-helpers`.
- If a control persists but does not show initial state, check `fill-helpers`.
- If a toggle does not show/hide its section, check `checkboxSections` in `toggle-checkbox.ts`.
