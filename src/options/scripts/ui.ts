import { getButton, getCheckbox, getContainerAndInput } from "src/options/scripts/utils/ui-helpers";

export const optionsShowOptionsButtonCheckboxEl = getCheckbox("options-show-options-button");

export const [usernameContainerEl, usernameInputEl] = getContainerAndInput("username");

export const [titleDefaultTitleContainerEl, titleDefaultTitleInputEl] = getContainerAndInput("title-default-title");
export const titleDynamicEnabledCheckboxEl = getCheckbox("title-dynamic-enabled");
export const titleFaviconTypeDefaultButtonEl = getButton("title-favicon-type-default");
export const titleFaviconTypeCustomButtonEl = getButton("title-favicon-type-custom");
export const titleCustomFaviconInputEl = document.getElementById("title-custom-favicon-upload") as HTMLInputElement;

export const messageEnabledCheckboxEl = getCheckbox("message-enabled");
export const messageFontTypeDefaultButtonEl = getButton("message-font-type-default");
export const messageFontTypeCustomButtonEl = getButton("message-font-type-custom");
export const [messageFontCustomContainerEl, messageFontCustomInputEl] = getContainerAndInput("message-font-custom");
export const [messageTextColorContainerEl, messageTextColorInputEl] = getContainerAndInput("message-text-color");
export const messageTypeAfternoonMorningButtonEl = getButton("message-type-afternoon-morning");
export const messageTypeDateButtonEl = getButton("message-type-date");
export const messageTypeTime12ButtonEl = getButton("message-type-time-12");
export const messageTypeTime24ButtonEl = getButton("message-type-time-24");
export const messageTypeWeatherButtonEl = getButton("message-type-weather");
export const messageTypeCustomButtonEl = getButton("message-type-custom");
export const [messageCustomTextContainerEl, messageCustomTextInputEl] = getContainerAndInput("message-custom-text");
export const messageWeatherUnitsTypeFButton = getButton("message-weather-units-type-f");
export const messageWeatherUnitsTypeCButton = getButton("message-weather-units-type-c");

export const wallpaperEnabledCheckboxEl = getCheckbox("wallpaper-enabled");
export const wallpaperTypeUrlButtonEl = getButton("wallpaper-type-url");
export const wallpaperTypeFileUploadButtonEl = getButton("wallpaper-type-file-upload");
export const [wallpaperUrlContainerEl, wallpaperUrlInputEl] = getContainerAndInput("wallpaper-url");
export const wallpaperFileUploadInputEl = document.getElementById("wallpaper-file-upload-input") as HTMLInputElement;
export const wallpaperFileResetButtonEl = getButton("wallpaper-file-upload-reset");

export const uiStyleSolidButtonEl = getButton("ui-style-solid");
export const uiStyleGlassButtonEl = getButton("ui-style-glass");
export const [uiGlassColorContainerEl, uiGlassColorInputEl] = getContainerAndInput("ui-glass-color");
export const [uiBlurStrengthContainerEl, uiBlurStrengthInputEl] = getContainerAndInput("ui-blur-strength");
export const [uiForegroundColorContainerEl, uiForegroundColorInputEl] = getContainerAndInput("ui-foreground-color");
export const [uiBackgroundColorContainerEl, uiBackgroundColorInputEl] = getContainerAndInput("ui-background-color");
export const [uiHighlightColorContainerEl, uiHighlightColorInputEl] = getContainerAndInput("ui-highlight-color");
export const uiCornerStyleSharpButtonEl = getButton("ui-corner-style-sharp");
export const uiCornerStyleRoundButtonEl = getButton("ui-corner-style-round");
export const uiCustomCSSContainerEl = document.getElementById("ui-custom-css-container") as HTMLInputElement;
export const uiCustomCSSTextareaEl = document.getElementById("ui-custom-css-textarea") as HTMLTextAreaElement;

export const animationsEnabledCheckboxEl = getCheckbox("animations-enabled");
export const animationsBookmarkTimingLeftButtonEl = getButton("animations-bookmark-timing-left");
export const animationsBookmarkTimingRightButtonEl = getButton("animations-bookmark-timing-right");
export const animationsBookmarkTimingUniformButtonEl = getButton("animations-bookmark-timing-uniform");
export const animationsInitialTypeDownBouncyButtonEl = getButton("animations-initial-type-down-bouncy");
export const animationsInitialTypeDownSmoothButtonEl = getButton("animations-initial-type-down-smooth");
export const animationsInitialTypeDownFallButtonEl = getButton("animations-initial-type-down-fall");
export const animationsInitialTypeUpBouncyButtonEl = getButton("animations-initial-type-up-bouncy");
export const animationsInitialTypeUpSmoothButtonEl = getButton("animations-initial-type-up-smooth");
export const animationsInitialTypeGrowScaleButtonEl = getButton("animations-initial-type-grow-scale");
export const animationsInitialTypeFlyLeftButtonEl = getButton("animations-initial-type-fly-left");
export const animationsInitialTypeFlyRightButtonEl = getButton("animations-initial-type-fly-right");
export const animationsSearchTypePageShrinkButtonEl = getButton("animations-search-type-page-shrink");
export const animationsSearchTypePageScaleButtonEl = getButton("animations-search-type-page-scale");
export const animationsSearchTypePageUpButtonEl = getButton("animations-search-type-page-up");
export const animationsSearchTypePageDownButtonEl = getButton("animations-search-type-page-down");
export const animationsBookmarkTypePageShrinkButtonEl = getButton("animations-bookmark-type-page-shrink");
export const animationsBookmarkTypePageScaleButtonEl = getButton("animations-bookmark-type-page-scale");
export const animationsBookmarkTypePageUpButtonEl = getButton("animations-bookmark-type-page-up");
export const animationsBookmarkTypePageDownButtonEl = getButton("animations-bookmark-type-page-down");

export const searchEnabledCheckboxEl = getCheckbox("search-enabled");
export const searchFontTypeDefaultButtonEl = getButton("search-font-type-default");
export const searchFontTypeCustomButtonEl = getButton("search-font-type-custom");
export const [searchFontCustomContainerEl, searchFontCustomInputEl] = getContainerAndInput("search-font-custom");
export const [searchTextColorContainerEl, searchTextColorInputEl] = getContainerAndInput("search-text-color");
export const [searchPlaceholderTextContainerEl, searchPlaceholderTextInputEl] = getContainerAndInput("search-placeholder-text");
export const [searchBookmarkPlaceholderTextContainerEl, searchBookmarkPlaceholderTextInputEl] = getContainerAndInput("search-bookmark-placeholder-text");
export const [searchPlaceholderTextColorContainerEl, searchPlaceholderTextColorInputEl] = getContainerAndInput("search-placeholder-text-color");
export const [searchSearchIconColorContainerEl, searchSearchIconColorInputEl] = getContainerAndInput("search-search-icon-color");
export const [searchBookmarkIconColorContainerEl, searchBookmarkIconColorInputEl] = getContainerAndInput("search-bookmark-icon-color");
export const [searchSelectIconColorContainerEl, searchSelectIconColorInputEl] = getContainerAndInput("search-select-icon-color");
export const searchEngineDuckduckgoButtonEl = getButton("search-engine-duckduckgo");
export const searchEngineBingButtonEl = getButton("search-engine-bing");
export const searchEngineGoogleButtonEl = getButton("search-engine-google");
export const searchEngineBraveButtonEl = getButton("search-engine-brave");
export const searchEngineYahooButtonEl = getButton("search-engine-yahoo");
export const searchEngineYandexButtonEl = getButton("search-engine-yandex");
export const searchEngineStartpageButtonEl = getButton("search-engine-startpage");
export const searchEngineEcosiaButtonEl = getButton("search-engine-ecosia");
export const searchEngineKagiButtonEl = getButton("search-engine-kagi");
export const [searchFocusedBorderColorContainerEl, searchFocusedBorderColorInputEl] = getContainerAndInput("search-focused-border-color");
export const searchUseCustomEngineEnabledCheckboxEl = getCheckbox("search-use-custom-engine-enabled");
export const [searchCustomEngineURLContainerEl, searchCustomEngineURLInputEl] = getContainerAndInput("search-custom-engine-url");
// export const searchAssistHistoryCheckboxEl = document.getElementById("search-assist-history-checkbox") as HTMLInputElement;
export const searchAssistDateCheckboxEl = getCheckbox("search-assist-date");
export const searchAssistMathCheckboxEl = getCheckbox("search-assist-math");
export const searchAssistDefinitionsCheckboxEl = getCheckbox("search-assist-definitions");
export const searchAssistConversionsCheckboxEl = getCheckbox("search-assist-conversions");

export const hotkeysEnabledCheckboxEl = getCheckbox("hotkeys-enabled");
export const [hotkeysActivationKeyContainerEl, hotkeysActivationKeyInputEl] = getContainerAndInput("hotkeys-activation-key");
export const hotkeysActivationKeyStatusEl = document.getElementById("hotkeys-activation-key-status") as HTMLSpanElement;
export const [hotkeysClosePageKeyContainerEl, hotkeysClosePageKeyInputEl] = getContainerAndInput("hotkeys-close-page-key");
export const hotkeysClosePageKeyStatusEl = document.getElementById("hotkeys-close-page-key-status") as HTMLSpanElement;
export const [hotkeysSearchBookmarksKeyContainerEl, hotkeysSearchBookmarksKeyInputEl] = getContainerAndInput("hotkeys-search-bookmarks-key");
export const hotkeysSearchBookmarksKeyStatusEl = document.getElementById("hotkeys-search-bookmarks-key-status") as HTMLSpanElement;

export const bookmarksTypeUserDefinedButtonEl = getButton("bookmarks-type-user-defined");
export const bookmarksTypeDefaultButtonEl = getButton("bookmarks-type-default");
export const bookmarksTypeDefaultBlockyButtonEl = getButton("bookmarks-type-default-blocky");
export const bookmarksTypeNoneButtonEl = getButton("bookmarks-type-none");
export const bookmarksShowBookmarkNamesCheckboxEl = getCheckbox("bookmarks-show-bookmark-names");
export const [bookmarksUserDefinedColsContainerEl, bookmarksUserDefinedColsInputEl] = getContainerAndInput("bookmarks-user-defined-cols");
export const bookmarksNumberKeysCheckboxEl = getCheckbox("bookmarks-number-keys");
export const bookmarksUserDefinedList = document.getElementById("bookmarks-user-defined-list") as HTMLDivElement;
export const [bookmarksDefaultBlockyColsContainerEl, bookmarksDefaultBlockyColsInputEl] = getContainerAndInput("bookmarks-default-blocky-cols");
export const bookmarksDefaultBlockyColorTypeRandomButtonEl = getButton("bookmarks-default-blocky-color-type-random");
export const bookmarksDefaultBlockyColorTypeCustomButtonEl = getButton("bookmarks-default-blocky-color-type-custom");
export const [bookmarksDefaultBlockyColorContainerEl, bookmarksDefaultBlockyColorInputEl] = getContainerAndInput("bookmarks-default-blocky-color");
export const bookmarksLocationFirefoxMenuButtonEl = getButton("bookmarks-location-firefox-menu");
export const bookmarksLocationFirefoxToolbarButtonEl = getButton("bookmarks-location-firefox-toolbar");
export const bookmarksLocationFirefoxOtherButtonEl = getButton("bookmarks-location-firefox-other");
export const bookmarksDefaultFaviconSourceGoogleButton = getButton("bookmarks-default-favicon-source-google");
export const bookmarksDefaultFaviconSourceDuckduckgoButton = getButton("bookmarks-default-favicon-source-duckduckgo");

export interface Input {
  container: HTMLDivElement;
  input: HTMLInputElement | HTMLTextAreaElement;
}

export const buttonSwitches: ButtonSwitch[] = [
  {
    buttons: [titleFaviconTypeDefaultButtonEl, titleFaviconTypeCustomButtonEl],
    attr: "favicon-type"
  },
  {
    buttons: [messageFontTypeDefaultButtonEl, messageFontTypeCustomButtonEl],
    attr: "message-font-type"
  },
  {
    buttons: [messageTypeAfternoonMorningButtonEl, messageTypeDateButtonEl, messageTypeTime12ButtonEl, messageTypeTime24ButtonEl, messageTypeWeatherButtonEl, messageTypeCustomButtonEl],
    attr: "message-type"
  },
  {
    buttons: [messageWeatherUnitsTypeFButton, messageWeatherUnitsTypeCButton],
    attr: "message-weather-units-type"
  },
  {
    buttons: [wallpaperTypeUrlButtonEl, wallpaperTypeFileUploadButtonEl],
    attr: "wallpaper-type"
  },
  {
    buttons: [uiStyleSolidButtonEl, uiStyleGlassButtonEl],
    attr: "ui-style"
  },
  {
    buttons: [uiCornerStyleSharpButtonEl, uiCornerStyleRoundButtonEl],
    attr: "ui-corner-style"
  },
  {
    buttons: [animationsBookmarkTimingLeftButtonEl, animationsBookmarkTimingRightButtonEl, animationsBookmarkTimingUniformButtonEl],
    attr: "animations-bookmark-timing"
  },
  {
    buttons: [animationsInitialTypeDownBouncyButtonEl, animationsInitialTypeDownSmoothButtonEl, animationsInitialTypeDownFallButtonEl, animationsInitialTypeUpBouncyButtonEl, animationsInitialTypeUpSmoothButtonEl, animationsInitialTypeGrowScaleButtonEl, animationsInitialTypeFlyLeftButtonEl, animationsInitialTypeFlyRightButtonEl],
    attr: "animations-initial-type"
  },
  {
    buttons: [animationsSearchTypePageShrinkButtonEl, animationsSearchTypePageScaleButtonEl, animationsSearchTypePageUpButtonEl, animationsSearchTypePageDownButtonEl],
    attr: "animations-search-type"
  },
  {
    buttons: [animationsBookmarkTypePageShrinkButtonEl, animationsBookmarkTypePageScaleButtonEl, animationsBookmarkTypePageUpButtonEl, animationsBookmarkTypePageDownButtonEl],
    attr: "animations-bookmark-type"
  },
  {
    buttons: [searchFontTypeDefaultButtonEl, searchFontTypeCustomButtonEl],
    attr: "search-font-type"
  },
  {
    buttons: [searchEngineDuckduckgoButtonEl, searchEngineGoogleButtonEl, searchEngineBingButtonEl, searchEngineBraveButtonEl, searchEngineYahooButtonEl, searchEngineYandexButtonEl, searchEngineStartpageButtonEl, searchEngineEcosiaButtonEl, searchEngineKagiButtonEl],
    attr: "search-engine"
  },
  {
    buttons: [bookmarksTypeUserDefinedButtonEl, bookmarksTypeDefaultButtonEl, bookmarksTypeDefaultBlockyButtonEl, bookmarksTypeNoneButtonEl],
    attr: "bookmarks-type"
  },
  {
    buttons: [bookmarksDefaultBlockyColorTypeRandomButtonEl, bookmarksDefaultBlockyColorTypeCustomButtonEl],
    attr: "bookmarks-default-blocky-color-type"
  },
  {
    buttons: [bookmarksLocationFirefoxMenuButtonEl, bookmarksLocationFirefoxToolbarButtonEl, bookmarksLocationFirefoxOtherButtonEl],
    attr: "bookmarks-location-firefox"
  },
  {
    buttons: [bookmarksDefaultFaviconSourceGoogleButton, bookmarksDefaultFaviconSourceDuckduckgoButton],
    attr: "bookmarks-default-favicon-source"
  }
];

export interface ButtonSwitch {
  buttons: HTMLButtonElement[];
  attr: string;
}

export const hotkeyInputs: HotkeyInput[] = [
  {
    container: hotkeysActivationKeyContainerEl,
    input: hotkeysActivationKeyInputEl,
    status: hotkeysActivationKeyStatusEl
  },
  {
    container: hotkeysClosePageKeyContainerEl,
    input: hotkeysClosePageKeyInputEl,
    status: hotkeysClosePageKeyStatusEl
  },
  {
    container: hotkeysSearchBookmarksKeyContainerEl,
    input: hotkeysSearchBookmarksKeyInputEl,
    status: hotkeysSearchBookmarksKeyStatusEl
  }
];

export interface HotkeyInput {
  container: HTMLDivElement;
  input: HTMLInputElement;
  status: HTMLSpanElement;
}
