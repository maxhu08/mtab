import {
  bookmarksEnablePaginationCheckboxEl,
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksTypeUserDefinedButtonEl,
  messageFontTypeCustomButtonEl,
  messageFontTypeDefaultButtonEl,
  messageTypeCustomButtonEl,
  messageTypeWeatherButtonEl,
  searchFontTypeCustomButtonEl,
  searchFontTypeDefaultButtonEl,
  titleEffectNoneButtonEl,
  titleEffectTypewriterButtonEl,
  titleFaviconTypeCustomButtonEl,
  titleFaviconTypeDefaultButtonEl,
  uiStyleGlassButtonEl,
  uiStyleSolidButtonEl,
  wallpaperTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeMixedButtonEl,
  wallpaperTypeRandomButtonEl,
  wallpaperTypeSolidColorButtonEl,
  wallpaperTypeUrlButtonEl
} from "~/src/options/scripts/ui";
import { renderWallpaperGallery } from "~/src/options/scripts/utils/upload-wallpaper";

const setSectionVisibility = (el: HTMLElement, isVisible: boolean) => {
  el.classList.toggle("hidden", !isVisible);
};

export const handleSwitches = () => {
  handleTitleEffectSwitch();
  handleFaviconTypeSwitch();
  handleMessageFontTypeSwitch();
  handleMessageTypeSwitch();
  handleWallpaperTypeSwitch();
  handleUIStyleSwitch();
  handleSearchFontTypeSwitch();
  handleBookmarksTypeSwitch();
  handleUserDefinedOrDefaultBlockySwitch();
  handleBookmarksPaginationSwitch();
  handleBookmarksDefaultBlockyColorTypeSwitch();
  handleBookmarksDefaultOrDefaultBlockySwitch();
};

const handleTitleEffectSwitch = () => {
  const titleEffectTypewriterSection = document.getElementById(
    "title-effect-typewriter-section"
  ) as HTMLDivElement;

  titleEffectNoneButtonEl.addEventListener("click", () => {
    setSectionVisibility(titleEffectTypewriterSection, false);
  });

  titleEffectTypewriterButtonEl.addEventListener("click", () => {
    setSectionVisibility(titleEffectTypewriterSection, true);
  });
};

const handleFaviconTypeSwitch = () => {
  const faviconCustomSection = document.getElementById(
    "title-custom-favicon-upload-section"
  ) as HTMLDivElement;

  titleFaviconTypeDefaultButtonEl.addEventListener("click", () => {
    setSectionVisibility(faviconCustomSection, false);
  });

  titleFaviconTypeCustomButtonEl.addEventListener("click", () => {
    setSectionVisibility(faviconCustomSection, true);
  });
};

const handleMessageFontTypeSwitch = () => {
  const messageFontCustomSection = document.getElementById(
    "message-font-custom-section"
  ) as HTMLDivElement;

  messageFontTypeDefaultButtonEl.addEventListener("click", () => {
    setSectionVisibility(messageFontCustomSection, false);
  });

  messageFontTypeCustomButtonEl.addEventListener("click", () => {
    setSectionVisibility(messageFontCustomSection, true);
  });
};

const handleSearchFontTypeSwitch = () => {
  const searchFontCustomSection = document.getElementById(
    "search-font-custom-section"
  ) as HTMLDivElement;

  searchFontTypeDefaultButtonEl.addEventListener("click", () => {
    setSectionVisibility(searchFontCustomSection, false);
  });

  searchFontTypeCustomButtonEl.addEventListener("click", () => {
    setSectionVisibility(searchFontCustomSection, true);
  });
};

const handleMessageTypeSwitch = () => {
  // prettier-ignore
  const messageTypeWeatherSection = document.getElementById("message-type-weather-section") as HTMLDivElement;
  // prettier-ignore
  const messageTypeCustomSection = document.getElementById("message-type-custom-section") as HTMLDivElement;

  const hideButtons = [
    "message-type-afternoon-morning-button",
    "message-type-date-button",
    "message-type-time-12-button",
    "message-type-time-24-button",
    "message-type-weather-button",
    "message-type-custom-button"
  ];

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      setSectionVisibility(messageTypeWeatherSection, false);
      setSectionVisibility(messageTypeCustomSection, false);
    });
  });

  messageTypeWeatherButtonEl.addEventListener("click", () => {
    setSectionVisibility(messageTypeWeatherSection, true);
  });

  messageTypeCustomButtonEl.addEventListener("click", () => {
    setSectionVisibility(messageTypeCustomSection, true);

    (document.getElementById("message-custom-text-info") as HTMLParagraphElement).textContent =
      'You can use \\ to represent:\n\n\
                - Date components\n\
                - \\yyyy -> Full year (e.g., "2020")\n\
                - \\yy -> Last two digits of the year (e.g., "20")\n\
                - \\M -> Full month name (e.g., "October")\n\
                - \\m -> Abbreviated month name (e.g., "Oct")\n\
                - \\m$ -> Month of year as number (e.g., "11")\n\
                - \\D -> Full day of the week name (e.g., "Monday")\n\
                - \\d -> Abbreviated day of the week (e.g., "Mon")\n\n\
                - \\d$ -> Day of month as number (e.g., "08")\n\
                - Time components\n\
                - \\h% -> Hours (12 hour format, e.g., "01")\n\
                - \\hh -> Hours (with padding, e.g., "01")\n\
                - \\mm -> Minutes (with padding, e.g., "02")\n\
                - \\ss -> Seconds (with padding, e.g., "03")\n\n\
                - Meridian components\n\
                - \\md -> Lowercase meridian (e.g., "am" or "pm")\n\
                - \\MD -> Uppercase meridian (e.g., "AM" or "PM")\n\
                - \\n -> New line';
  });
};

const handleWallpaperTypeSwitch = () => {
  const wallpaperUrlSection = document.getElementById("wallpaper-url-section") as HTMLDivElement;
  const wallpaperFileUploadSection = document.getElementById(
    "wallpaper-file-upload-section"
  ) as HTMLDivElement;
  const wallpaperSolidColorSection = document.getElementById(
    "wallpaper-solid-color-section"
  ) as HTMLDivElement;
  const wallpaperRandomSection = document.getElementById(
    "wallpaper-random-section"
  ) as HTMLDivElement;
  const wallpaperMixedSection = document.getElementById(
    "wallpaper-mixed-section"
  ) as HTMLDivElement;

  const wallpaperNotSolidColorSection = document.getElementById(
    "wallpaper-not-solid-color-section"
  ) as HTMLDivElement;
  const wallpaperGalleryWrapperSection = document.getElementById(
    "wallpaper-gallery-wrapper"
  ) as HTMLDivElement;
  const wallpaperDefaultPreviewSection = document.getElementById(
    "wallpaper-default-preview-section"
  ) as HTMLDivElement;

  wallpaperTypeUrlButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperFileUploadSection, false);
    setSectionVisibility(wallpaperSolidColorSection, false);
    setSectionVisibility(wallpaperRandomSection, false);
    setSectionVisibility(wallpaperMixedSection, false);
    setSectionVisibility(wallpaperUrlSection, true);
    setSectionVisibility(wallpaperNotSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, true);
    setSectionVisibility(wallpaperDefaultPreviewSection, false);

    void renderWallpaperGallery();
  });

  wallpaperTypeFileUploadButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperUrlSection, false);
    setSectionVisibility(wallpaperSolidColorSection, false);
    setSectionVisibility(wallpaperRandomSection, false);
    setSectionVisibility(wallpaperMixedSection, false);
    setSectionVisibility(wallpaperFileUploadSection, true);
    setSectionVisibility(wallpaperNotSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, true);
    setSectionVisibility(wallpaperDefaultPreviewSection, false);

    void renderWallpaperGallery();
  });

  wallpaperTypeRandomButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperUrlSection, false);
    setSectionVisibility(wallpaperFileUploadSection, false);
    setSectionVisibility(wallpaperSolidColorSection, false);
    setSectionVisibility(wallpaperMixedSection, false);
    setSectionVisibility(wallpaperRandomSection, true);
    setSectionVisibility(wallpaperNotSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, false);
    setSectionVisibility(wallpaperDefaultPreviewSection, false);

    void renderWallpaperGallery();
  });

  wallpaperTypeSolidColorButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperUrlSection, false);
    setSectionVisibility(wallpaperFileUploadSection, false);
    setSectionVisibility(wallpaperRandomSection, false);
    setSectionVisibility(wallpaperMixedSection, false);
    setSectionVisibility(wallpaperNotSolidColorSection, false);
    setSectionVisibility(wallpaperSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, true);
    setSectionVisibility(wallpaperDefaultPreviewSection, false);

    void renderWallpaperGallery();
  });

  wallpaperTypeMixedButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperUrlSection, false);
    setSectionVisibility(wallpaperFileUploadSection, false);
    setSectionVisibility(wallpaperSolidColorSection, false);
    setSectionVisibility(wallpaperRandomSection, false);
    setSectionVisibility(wallpaperMixedSection, true);
    setSectionVisibility(wallpaperNotSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, true);
    setSectionVisibility(wallpaperDefaultPreviewSection, false);

    void renderWallpaperGallery();
  });

  wallpaperTypeDefaultButtonEl.addEventListener("click", () => {
    setSectionVisibility(wallpaperUrlSection, false);
    setSectionVisibility(wallpaperFileUploadSection, false);
    setSectionVisibility(wallpaperSolidColorSection, false);
    setSectionVisibility(wallpaperRandomSection, false);
    setSectionVisibility(wallpaperMixedSection, false);
    setSectionVisibility(wallpaperNotSolidColorSection, true);
    setSectionVisibility(wallpaperGalleryWrapperSection, false);
    setSectionVisibility(wallpaperDefaultPreviewSection, true);

    void renderWallpaperGallery();
  });
};

const handleUIStyleSwitch = () => {
  const uiStyleSolidSection = document.getElementById("ui-style-solid-section") as HTMLDivElement;
  const uiStyleGlassSection = document.getElementById("ui-style-glass-section") as HTMLDivElement;

  uiStyleSolidButtonEl.addEventListener("click", () => {
    setSectionVisibility(uiStyleGlassSection, false);
    setSectionVisibility(uiStyleSolidSection, true);
  });

  uiStyleGlassButtonEl.addEventListener("click", () => {
    setSectionVisibility(uiStyleSolidSection, false);
    setSectionVisibility(uiStyleGlassSection, true);
  });
};

const handleBookmarksTypeSwitch = () => {
  // prettier-ignore
  const bookmarksUserDefinedSection = document.getElementById("bookmarks-user-defined-section") as HTMLDivElement;
  // prettier-ignore
  const bookmarksDefaultBlockySection = document.getElementById("bookmarks-default-blocky-section") as HTMLDivElement;

  const hideButtons = ["bookmarks-type-default-button", "bookmarks-type-none-button"];

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => {
    setSectionVisibility(bookmarksDefaultBlockySection, false);
    setSectionVisibility(bookmarksUserDefinedSection, true);
  });

  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => {
    setSectionVisibility(bookmarksUserDefinedSection, false);
    setSectionVisibility(bookmarksDefaultBlockySection, true);
  });

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      setSectionVisibility(bookmarksUserDefinedSection, false);
      setSectionVisibility(bookmarksDefaultBlockySection, false);
    });
  });
};

const handleUserDefinedOrDefaultBlockySwitch = () => {
  // prettier-ignore
  const bookmarksUserDefinedOrDefaultBlockySection = document.getElementById("bookmarks-user-defined-or-default-blocky-section") as HTMLDivElement

  const hide = () => setSectionVisibility(bookmarksUserDefinedOrDefaultBlockySection, false);
  const show = () => setSectionVisibility(bookmarksUserDefinedOrDefaultBlockySection, true);

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => show());
  bookmarksTypeDefaultButtonEl.addEventListener("click", () => hide());
  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => show());
  bookmarksTypeNoneButtonEl.addEventListener("click", () => hide());
};

const handleBookmarksPaginationSwitch = () => {
  const maxRowsSection = document.getElementById(
    "bookmarks-max-bookmark-rows-per-page-section"
  ) as HTMLDivElement;

  const sync = () => {
    setSectionVisibility(maxRowsSection, bookmarksEnablePaginationCheckboxEl.checked);
  };

  bookmarksEnablePaginationCheckboxEl.addEventListener("change", sync);
  sync();
};

const handleBookmarksDefaultBlockyColorTypeSwitch = () => {
  // prettier-ignore
  const customColorSection = document.getElementById("bookmarks-default-blocky-color-section") as HTMLDivElement;

  bookmarksDefaultBlockyColorTypeRandomButtonEl.addEventListener("click", () => {
    setSectionVisibility(customColorSection, false);
  });

  bookmarksDefaultBlockyColorTypeCustomButtonEl.addEventListener("click", () => {
    setSectionVisibility(customColorSection, true);
  });
};

const handleBookmarksDefaultOrDefaultBlockySwitch = () => {
  // prettier-ignore
  const bookmarksDefaultOrDefaultBlockySection = document.getElementById("bookmarks-default-or-default-blocky-section") as HTMLDivElement

  const hide = () => setSectionVisibility(bookmarksDefaultOrDefaultBlockySection, false);
  const show = () => setSectionVisibility(bookmarksDefaultOrDefaultBlockySection, true);

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => hide());
  bookmarksTypeDefaultButtonEl.addEventListener("click", () => show());
  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => show());
  bookmarksTypeNoneButtonEl.addEventListener("click", () => hide());
};
