## Project Structure

**src/utils**
This folder contains small peices of code that is used everywhere and in a more general manner. This means that code in this folder may be used in other areas of the extension.

**src/scripts/**
This folder contains all scripts that may need to be ran when building the extension for development or production

- `src/scripts/linux/`
  - Contains scripts that are ran when building the extension for linux
  - `src/scripts/linux/create_manifest_chrome.sh`
    - Creates the manifest.json file for the Chrome extension
  - `src/scripts/linux/create_manifest_firefox.sh`
    - Creates the manifest.json file for the FireFox extension
  - `src/scripts/linux/copy_assets.sh`
    - Copies the assets folder to the dist folder
- `src/scripts/win/`
  - Contains scripts that are ran when building the extension for windows
  - `src/scripts/win/create_manifest_firefox.bat`
    - Creates the manifest.json file for the FireFox extension
  - `src/scripts/win/copy_assets.bat`
    - Copies the assets folder to the dist folder

**src/options/**
This folder contains the code for the options page
All TypeScript files are in `src/options/scripts/`

Code that needs to be ran when the page is loaded is in `src/options/init.ts`

- `src/options/utils/`
  - `src/options/utils/fill-helpers/`
    - Contains code that sets the state of the options page based off the config (if a feature is enabled, the nthe checkbox is checked and the corresponding section is shown)
  - `src/options/utils/save-helpers/`
    - Contains code that saves a section of the options page
    - All files in this folder are imported and ran by the `saveConfig` function in `src/options/scripts/utils/save-config.ts`

**src/assets/**
This folder contains all the assets used by the extension

- `fonts/` contains all the fonts that are used in the extension
- `wallpapers/` contains all the default wallpapers the user can choose from
  - The resolution of each wallpaper can vary, and there is no standard size for wallpapers currently

- `search-engines/` contains all the search engine icons that are used in the options page

- 16.png, 32.png, 48.png, 64.png, 128.png, favicon.ico, icon.png, icon.svg are all icons of different sizes used by the extention

**src/popup**
This folder contains the code for the popup.
<img src="./assets/popup.png">

**src/newtab**
This folder contains the code for the configuration page. The `options.html` page.
All TypeScript files are in `src/newtab/scripts`

Code that needs to be ran when the page is loaded is in the `src/newtab/scripts/load-page.ts` file
`src/newtab/scripts/init.ts` is not used for anything else except calling the `loadPage` function which resides in `src/newtab/scripts/load-page.ts`

`scripts/utils/`
  - This folder contains code that the main code files (`config.ts`, `init.ts`, `keys.ts`, `load-page.ts`, and `ui.ts`) call. This functions are **ONLY** ever used in the main code files, and no where else.