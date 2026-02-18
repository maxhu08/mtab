# Project Structure

Use this map to decide where new code should go.

## Main Directories

- `src/newtab/`: new tab page implementation.
- `src/options/`: options page implementation.
- `src/popup/`: extension popup implementation.
- `src/utils/`: shared, reusable utilities.
- `src/assets/`: icons, wallpapers, fonts, and UI assets.
- `src/scripts/`: build and packaging scripts (platform-specific).

## New Tab

- Main scripts: `src/newtab/scripts/`
- Entry point: `src/newtab/scripts/init.ts`
- Page load orchestration: `src/newtab/scripts/load-page.ts`
- Helpers used by core new tab scripts: `src/newtab/scripts/utils/`

## Options Page

- Main scripts: `src/options/scripts/`
- Fill helpers: `src/options/utils/fill-helpers/`
- Save helpers: `src/options/utils/save-helpers/`
- Save pipeline entry: `src/options/scripts/utils/save-config.ts`

## Build Scripts

- Linux scripts: `src/scripts/linux/`
- Windows scripts: `src/scripts/win/`
- These scripts generate manifests and copy assets during build/package commands.

## Useful Rule of Thumb

- If logic is used across multiple features/pages, put it in `src/utils/`.
- If logic is page-specific, keep it in that page folder (`newtab`, `options`, or `popup`).
