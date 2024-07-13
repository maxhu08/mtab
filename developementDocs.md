# Developer Documentation
- This document is a work in progress
- In this document, anything with a trailing slash is a folder (e.g `src/options/` is a folder but `src/options.ts` is not a folder)

## Table of Contents
1. [Coding Style](#coding-style)
2. [Options Page](#options-page)
3. [Project Structure](#project-structure)

## Coding Style
TODO: talk about how many spaces in an indeent, how to write comments, how to set up prettier, etc

**Naming variables**
- Variables are in camelCase

**Naming keys in objects**
- Use present tense (e.g., `search.useCustomEngine` instead of `search.usingCustomEngine`)
- Keys must be in camelCase
- For nested keys, avoid using the prent key in the child key's name
  - Wrong: `{ search: { useCustomSearchEngine: true } }`
  - Right: `{ search: { useCustomEngine: true } }`
  - If you are still confused, you can see many examples of this in `src/newtab/scripts/config.ts`

**Union Types**
- Union types will have each of its choices on a separate line
- E.g
    ```typescript
    type Modes = "normal"
                    | "insert"
                    | "visual";
    ```
- The last line of the union type should end with a semicolon

**Interfaces**
- Use PascalCase for interface names
- E.g
    - Correct: 
        ```typescript
        interface ButtonSwitch {
            buttons: HTMLButtonElement[];
            attr: string;
        }
        ```
    - Wrong:
        ```typescript
        interface buttonSwitch {
            buttons: HTMLButtonElement[];
            attr: string;
        }
- Each key of the interface should be on a separate line
- Each key of the interface end with a semicolon

## Options Page

**Overall Structure**
- The entire feature is wrapped in a `<section>` with the classes `grid grid-flow-row gap-4`
- In the `<section>`, the first `<div>` is the name of the feature with the classes `grid grid-cols-[1fr_max-content_1fr] gap-2`
  - Inside the `<div>`, there are two more `<divs>` with a `<span>` in the middle of them, so it kinda makes a sandwich
  - The two `<divs>` have the classes `bg-neutral-500 h-[1px] rounded-md my-auto`
  - The `<span>` has the classes `text-neutral-500 text-base`
    - The text inside the `<span>` is the name of the feature

e.g
```html
<section class="grid grid-flow-row gap-4">
    <div class="grid grid-cols-[1fr_max-content_1fr] gap-2">
        <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
        <span class="text-neutral-500 text-base">search</span>
        <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
    </div>
</section>
```

**Naming a section**
- Sections are named based off the key in the config
   - e.g `const config = { search: { enabled: true } }`
   - The section name should be `search`
   - If you added a toggle button to enable/disable the search feature, the label for the checkbox would be `search.enabled`
   - If you're still confused, check out the options page in the extension and it'll all make sense (I kinda did a bad job of explaining it)

**Adding a new section**
- See the "Creating a new button or checkbox" section

- When making a new section, make sure to register the checkbox that activates the section as well as the section that the checkbox activates in `checkboxSections` variable the `src\options\scripts\utils\toggle-checkbox.ts` file
    - e.g You create a new checkbox called `animations-enabled-checkbox` and a new section called `animations-enabled-section`
    - Then you need to add the following to the `checkboxSections` array:
      - `["animations-enabled-checkbox", "animations-enabled-section"]`
      - The `checkboxSections` array is located at the top of the file in `src\options\scripts\utils\toggle-checkbox.ts`
- When adding a new checkbox:
    1. The ID of the checkbox should follow this format: `parentKey-childKey-enabled-checkbox`
      - e.g `const config = { search: { useCustomEngine: true } }`
      - The ID of the checkbox should be `search-use-custom-engine-enabled-checkbox`
      - The only exception to this rule is if the child key is named `enabled`, in which case the ID should be `parentKey-childKey-checkbox`
        - e.g `const config = { search: { enabled: true } }`
        - The ID of the checkbox should be `search-enabled-checkbox`
    1. Register the checkbox in the `ui.ts` file
    2. Locate the file that best fits your checkbox in `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/`
    3. If no suitable file exists, create a new file in `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/`
    4. Update both the `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/` to properly initialize and save the state of your new checkbox

- When adding a new input:
    - The ID of the input should follow this format: `parentKey-childKey-input`
      - e.g `const config = { search: { customEngineURL: "" } }`
      - The ID of the input should be `search-custom-engine-url-input`
    - The placeholder of the input should be a valid input. The placeholder basically serves as an example of what the input should look like

    - The input coontainer's ID should follow this format: `parentKey-childKey-container`
      - e.g `const config = { search: { customEngineURL: "" } }`
      - The ID of the input container should be `search-custom-engine-url-container`

    - Don't forget to add the input container as well as the input itself to `ui.ts` and the `inputs` array in `ui.ts`

    - Example of input:
        ```javascript
        const config = { search: { customEngineURL: "" } }
        ```
        ```html
        <div id="search-custom-engine-url-container"
            class="grid grid-cols-[max-content_auto] text-base bg-neutral-800 w-full p-1 rounded-md border-2 border-transparent">
            <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
            <input id="search-custom-engine-url-input" type="text" autocomplete="off"
            class="outline-none bg-transparent text-white placeholder-neutral-500"
            placeholder="E.g https://www.google.com/search?q={}" />
        </div>
        ```

- Setting the ID of the section
    - The ID of the section follows this format: `checkboxID-section`
        - e.g `const config = { search: { useCustomEngine: true } }`
        - The ID of the checkbox should be `search-use-custom-engine-enabled-checkbox`
        - The ID of the section should be `search-use-custom-engine-enabled-section`

## Project Structure

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
- The fonts folder contains all the fonts that are used in the extension
- The wallpapers folder contains all the default wallpapers the user can choose from
  - The resolution of each wallpaper can vary, and there is no standard size for wallpapers currently

- The search-engines folder contains all the search engine icons that are used in the options page

- 16.png, 32.png, 48.png, 64.png, 128.png, favicon.ico, icon.png, icon.svg are all icons of different sizes used by the extention

**src/newtab**
This folder contains the code for the new tab page
All TypeScript files are in `src/newtab/scripts`

Code that needs to be ran when the page is loaded is in the `src/newtab/scripts/load-page.ts` file
`src/newtab/scripts/init.ts` is not used for anything else except calling the `loadPage` function which resides in `src/newtab/scripts/load-page.ts`