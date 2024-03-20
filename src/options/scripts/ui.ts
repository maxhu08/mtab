import { saveConfig } from "src/options/scripts/utils/save-config";

export const usernameContainerEl = document.getElementById("username-container") as HTMLDivElement;
export const usernameInputEl = document.getElementById("username-input") as HTMLInputElement;

export const titleContainerEl = document.getElementById("title-container") as HTMLDivElement;
export const titleInputEl = document.getElementById("title-input") as HTMLInputElement;

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
export const wallpaperUrlContainerEl = document.getElementById("wallpaper-url-container") as HTMLInputElement;
export const wallpaperUrlInputEl = document.getElementById("wallpaper-url-input") as HTMLInputElement;

export const uiStyleSolidButtonEl = document.getElementById("ui-style-solid-button") as HTMLButtonElement;
export const uiStyleGlassButtonEl = document.getElementById("ui-style-glass-button") as HTMLButtonElement;

export const dynamicTitleEnabledCheckboxEl = document.getElementById("dynamicTitle-enabled-checkbox") as HTMLInputElement;
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

export const inputs: Input[] = [
  {
    container: usernameContainerEl,
    input: usernameInputEl
  },
  {
    container: titleContainerEl,
    input: titleInputEl
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
    container: searchFontContainerEl,
    input: searchFontInputEl 
  },
  {
    container: searchPlaceholderTextContainerEl,
    input: searchPlaceholderTextInputEl 
  }
];

interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement;
}

const saveBtn = document.getElementById("save-button") as HTMLButtonElement;

saveBtn.onclick = () => {
  saveConfig();
};