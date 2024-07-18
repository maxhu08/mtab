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
  1. Locate the file that best fits your checkbox in `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/`
  1. If no suitable file exists, create a new file in `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/`
  1. Update both the `src/options/utils/fill-helpers/` and `src/options/utils/save-helpers/` to properly initialize and save the state of your new checkbox

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
    const config = { search: { customEngineURL: "" } };
    ```
    ```html
    <div
      id="search-custom-engine-url-container"
      class="grid grid-cols-[max-content_auto] text-base bg-neutral-800 w-full p-1 rounded-md border-2 border-transparent"
    >
      <span class="text-pink-500 font-semibold select-none">>&nbsp;</span>
      <input
        id="search-custom-engine-url-input"
        type="text"
        autocomplete="off"
        class="outline-none bg-transparent text-white placeholder-neutral-500"
        placeholder="E.g https://www.google.com/search?q={}"
      />
    </div>
    ```

- Setting the ID of the section
  - The ID of the section follows this format: `checkboxID-section`
    - e.g `const config = { search: { useCustomEngine: true } }`
    - The ID of the checkbox should be `search-use-custom-engine-enabled-checkbox`
    - The ID of the section should be `search-use-custom-engine-enabled-section`
