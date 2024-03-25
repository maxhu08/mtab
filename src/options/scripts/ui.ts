import { exportConfig } from "src/options/scripts/utils/export-config";
import { importConfig } from "src/options/scripts/utils/import-config";
import { saveConfig } from "src/options/scripts/utils/save-config";

export const usernameContainerEl = document.getElementById("username-container") as HTMLDivElement;
export const usernameInputEl = document.getElementById("username-input") as HTMLInputElement;

export const titleDefaultTitleContainerEl = document.getElementById("title-default-title-container") as HTMLDivElement;
export const titleDefaultTitleInputEl = document.getElementById("title-default-title-input") as HTMLInputElement;

export const titleDynamicEnabledCheckboxEl = document.getElementById("title-dynamic-enabled-checkbox") as HTMLInputElement;

export const messageFontContainerEl = document.getElementById("message-font-container") as HTMLInputElement;
export const messageFontInputEl = document.getElementById("message-font-input") as HTMLInputElement;

export const messageTypeAfternoonMorningButtonEl = document.getElementById("message-type-afternoon-morning-button") as HTMLButtonElement;
export const messageTypeDateButtonEl = document.getElementById("message-type-date-button") as HTMLButtonElement;
export const messageTypeTime12ButtonEl = document.getElementById("message-type-time-12-button") as HTMLButtonElement;
export const messageTypeTime24ButtonEl = document.getElementById("message-type-time-24-button") as HTMLButtonElement;
export const messageTypeCustomButtonEl = document.getElementById("message-type-custom-button") as HTMLButtonElement;

export const messageCustomTextContainerEl = document.getElementById("message-custom-text-container") as HTMLDivElement;
export const messageCustomTextInputEl = document.getElementById("message-custom-text-input") as HTMLInputElement;

export const wallpaperEnabledCheckboxEl = document.getElementById("wallpaper-enabled-checkbox") as HTMLInputElement;

export const wallpaperTypeUrlButtonEl = document.getElementById("wallpaper-type-url-button") as HTMLButtonElement;
export const wallpaperTypeFileUploadButtonEl = document.getElementById("wallpaper-type-file-upload-button") as HTMLButtonElement;

export const wallpaperUrlContainerEl = document.getElementById("wallpaper-url-container") as HTMLInputElement;
export const wallpaperUrlInputEl = document.getElementById("wallpaper-url-input") as HTMLInputElement;

export const wallpaperFileInputEl = document.getElementById("wallpaper-file-upload") as HTMLInputElement;

export const uiStyleSolidButtonEl = document.getElementById("ui-style-solid-button") as HTMLButtonElement;
export const uiStyleGlassButtonEl = document.getElementById("ui-style-glass-button") as HTMLButtonElement;

export const uiForegroundColorContainerEl = document.getElementById("ui-foreground-color-container") as HTMLDivElement;
export const uiForegroundColorInputEl = document.getElementById("ui-foreground-color-input") as HTMLInputElement;

export const uiBackgroundColorContainerEl = document.getElementById("ui-background-color-container") as HTMLDivElement;
export const uiBackgroundColorInputEl = document.getElementById("ui-background-color-input") as HTMLInputElement;

export const uiHighlightColorContainerEl = document.getElementById("ui-highlight-color-container") as HTMLDivElement;
export const uiHighlightColorInputEl = document.getElementById("ui-highlight-color-input") as HTMLInputElement;

export const animationsEnabledCheckboxEl = document.getElementById("animations-enabled-checkbox") as HTMLInputElement;

export const animationsBookmarkTimingLeftButtonEl = document.getElementById("animations-bookmark-timing-left-button") as HTMLButtonElement;
export const animationsBookmarkTimingRightButtonEl = document.getElementById("animations-bookmark-timing-right-button") as HTMLButtonElement;
export const animationsBookmarkTimingUniformButtonEl = document.getElementById("animations-bookmark-timing-uniform-button") as HTMLButtonElement;

export const animationsTypeDownBouncyButtonEl = document.getElementById("animations-type-down-bouncy-button") as HTMLButtonElement;
export const animationsTypeDownSmoothButtonEl = document.getElementById("animations-type-down-smooth-button") as HTMLButtonElement;
export const animationsTypeDownFallButtonEl = document.getElementById("animations-type-down-fall-button") as HTMLButtonElement;
export const animationsTypeUpBouncyButtonEl = document.getElementById("animations-type-up-bouncy-button") as HTMLButtonElement;
export const animationsTypeUpSmoothEl = document.getElementById("animations-type-up-smooth-button") as HTMLButtonElement;

export const searchFontContainerEl = document.getElementById("search-font-container") as HTMLDivElement;
export const searchFontInputEl = document.getElementById("search-font-input") as HTMLInputElement;

export const searchPlaceholderTextContainerEl = document.getElementById("search-placeholder-text-container") as HTMLDivElement;
export const searchPlaceholderTextInputEl = document.getElementById("search-placeholder-text-input") as HTMLInputElement;

export const searchEngineDuckduckgoButtonEl = document.getElementById("search-engine-duckduckgo-button") as HTMLButtonElement
export const searchEngineGoogleButtonEl = document.getElementById("search-engine-google-button") as HTMLButtonElement
export const searchEngineBingButtonEl = document.getElementById("search-engine-bing-button") as HTMLButtonElement
export const searchEngineYahooButtonEl = document.getElementById("search-engine-yahoo-button") as HTMLButtonElement

export const searchFocusedBorderColorContainerEl = document.getElementById("search-focused-border-color-container") as HTMLDivElement;
export const searchFocusedBorderColorInputEl = document.getElementById("search-focused-border-color-input") as HTMLInputElement;

export const hotkeysEnabledCheckboxEl = document.getElementById("hotkeys-enabled-checkbox") as HTMLInputElement;

export const bookmarksOptionsContainerEl = document.getElementById("bookmarks-options-container") as HTMLDivElement;

export const inputs: Input[] = [
  {
    container: usernameContainerEl,
    input: usernameInputEl
  },
  {
    container: titleDefaultTitleContainerEl,
    input: titleDefaultTitleInputEl
  },
  {
    container: messageFontContainerEl,
    input: messageFontInputEl
  },
  {
    container: messageCustomTextContainerEl,
    input: messageCustomTextInputEl
  },
  {
    container: wallpaperUrlContainerEl,
    input: wallpaperUrlInputEl
  },
  {
    container: uiForegroundColorContainerEl,
    input: uiForegroundColorInputEl
  },
  {
    container: uiBackgroundColorContainerEl,
    input: uiBackgroundColorInputEl
  },
  {
    container: uiHighlightColorContainerEl,
    input: uiHighlightColorInputEl
  },
  {
    container: searchFontContainerEl,
    input: searchFontInputEl 
  },
  {
    container: searchPlaceholderTextContainerEl,
    input: searchPlaceholderTextInputEl 
  },
  {
    container: searchFocusedBorderColorContainerEl,
    input: searchFocusedBorderColorInputEl 
  }
];

interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement;
}

export const buttonSwitches: ButtonSwitch[] = [
  {
    buttons: [uiStyleSolidButtonEl, uiStyleGlassButtonEl],
    attr: "ui-style"
  },
  {
    buttons: [
      messageTypeAfternoonMorningButtonEl,
      messageTypeDateButtonEl,
      messageTypeTime12ButtonEl,
      messageTypeTime24ButtonEl,
      messageTypeCustomButtonEl
    ],
    attr: "message-type" 
  },
  {
    buttons: [
      wallpaperTypeUrlButtonEl,
      wallpaperTypeFileUploadButtonEl
    ],
    attr: "wallpaper-type"
  },
  {
    buttons: [
      animationsBookmarkTimingLeftButtonEl,
      animationsBookmarkTimingRightButtonEl,
      animationsBookmarkTimingUniformButtonEl
    ],
    attr: "animations-bookmark-timing"
  },
  {
    buttons: [
      animationsTypeDownBouncyButtonEl,
      animationsTypeDownSmoothButtonEl,
      animationsTypeDownFallButtonEl,
      animationsTypeUpBouncyButtonEl,
      animationsTypeUpSmoothEl
    ],
    attr: "animations-type"
  },
  {
    buttons: [
      searchEngineDuckduckgoButtonEl,
      searchEngineGoogleButtonEl,
      searchEngineBingButtonEl,
      searchEngineYahooButtonEl
    ],
    attr: "search-engine"
  }
];

interface ButtonSwitch {
  buttons: HTMLButtonElement[];
  attr: string;
}

const saveBtn = document.getElementById("save-button") as HTMLButtonElement;
saveBtn.onclick = () => {
  saveConfig();
};

const exportBtn = document.getElementById("export-button") as HTMLButtonElement;
exportBtn.onclick = () => {
  saveConfig()
  exportConfig();
};

const importBtn = document.getElementById("import-button") as HTMLButtonElement;
importBtn.onclick = () => {
  importConfig();
};