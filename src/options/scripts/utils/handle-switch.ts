import {
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
  wallpaperFiltersBlurInputEl,
  wallpaperFiltersBrightnessInputEl,
  wallpaperSolidColorInputEl,
  wallpaperTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeSolidColorButtonEl,
  wallpaperTypeUrlButtonEl,
  wallpaperUrlInputEl
} from "src/options/scripts/ui";
import { get as idbGet } from "idb-keyval";
import { previewWallpaper, previewWallpaperSolidColor } from "src/options/scripts/utils/preview";
import { logger } from "src/utils/logger";

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
  handleBookmarksDefaultBlockyColorTypeSwitch();
  handleBookmarksDefaultOrDefaultBlockySwitch();
};

const handleTitleEffectSwitch = () => {
  const titleEffectTypewriterSection = document.getElementById(
    "title-effect-typewriter-section"
  ) as HTMLDivElement;

  titleEffectNoneButtonEl.addEventListener("click", () => {
    titleEffectTypewriterSection.style.display = "none";
  });

  titleEffectTypewriterButtonEl.addEventListener("click", () => {
    titleEffectTypewriterSection.style.display = "";
  });
};

const handleFaviconTypeSwitch = () => {
  const faviconCustomSection = document.getElementById(
    "title-custom-favicon-upload-section"
  ) as HTMLDivElement;

  titleFaviconTypeDefaultButtonEl.addEventListener("click", () => {
    faviconCustomSection.style.display = "none";
  });

  titleFaviconTypeCustomButtonEl.addEventListener("click", () => {
    faviconCustomSection.style.display = "block";
  });
};

const handleMessageFontTypeSwitch = () => {
  const messageFontCustomSection = document.getElementById(
    "message-font-custom-section"
  ) as HTMLDivElement;

  messageFontTypeDefaultButtonEl.addEventListener("click", () => {
    messageFontCustomSection.style.display = "none";
  });

  messageFontTypeCustomButtonEl.addEventListener("click", () => {
    messageFontCustomSection.style.display = "block";
  });
};

const handleSearchFontTypeSwitch = () => {
  const searchFontCustomSection = document.getElementById(
    "search-font-custom-section"
  ) as HTMLDivElement;

  searchFontTypeDefaultButtonEl.addEventListener("click", () => {
    searchFontCustomSection.style.display = "none";
  });

  searchFontTypeCustomButtonEl.addEventListener("click", () => {
    searchFontCustomSection.style.display = "block";
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
      messageTypeWeatherSection.style.display = "none";
      messageTypeCustomSection.style.display = "none";
    });
  });

  messageTypeWeatherButtonEl.addEventListener("click", () => {
    messageTypeWeatherSection.style.display = "grid";
  });

  messageTypeCustomButtonEl.addEventListener("click", () => {
    messageTypeCustomSection.style.display = "block";

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

  const wallpaperNotSolidColorSection = document.getElementById(
    "wallpaper-not-solid-color-section"
  ) as HTMLDivElement;

  wallpaperTypeUrlButtonEl.addEventListener("click", () => {
    previewWallpaper(
      wallpaperUrlInputEl.value,
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );

    wallpaperFileUploadSection.style.display = "none";
    wallpaperSolidColorSection.style.display = "none";
    wallpaperUrlSection.style.display = "block";
    wallpaperNotSolidColorSection.style.display = "grid";
  });

  wallpaperTypeFileUploadButtonEl.addEventListener("click", () => {
    try {
      idbGet("userUploadedWallpaper").then((file) => {
        if (file) {
          previewWallpaper(
            file,
            wallpaperFiltersBrightnessInputEl.value,
            wallpaperFiltersBlurInputEl.value
          );
        }
      });

      idbGet("userUploadedWallpaper").then((file) => {
        if (file) {
          previewWallpaper(
            file,
            wallpaperFiltersBrightnessInputEl.value,
            wallpaperFiltersBlurInputEl.value
          );
        } else {
          // not in idb, handle legacy wallpaper

          chrome.storage.local.get(["userUploadedWallpaper"], (data) => {
            previewWallpaper(
              data.userUploadedWallpaper,
              wallpaperFiltersBrightnessInputEl.value,
              wallpaperFiltersBlurInputEl.value
            );
          });
        }
      });
    } catch (err) {
      logger.log("Error storing wallpaper", err);
    }

    wallpaperUrlSection.style.display = "none";
    wallpaperSolidColorSection.style.display = "none";
    wallpaperFileUploadSection.style.display = "block";
    wallpaperNotSolidColorSection.style.display = "grid";
  });

  wallpaperTypeSolidColorButtonEl.addEventListener("click", () => {
    wallpaperUrlSection.style.display = "none";
    wallpaperFileUploadSection.style.display = "none";
    wallpaperNotSolidColorSection.style.display = "none";
    wallpaperSolidColorSection.style.display = "block";

    previewWallpaperSolidColor(wallpaperSolidColorInputEl.value);
  });

  wallpaperTypeDefaultButtonEl.addEventListener("click", () => {
    previewWallpaper(
      "",
      wallpaperFiltersBrightnessInputEl.value,
      wallpaperFiltersBlurInputEl.value
    );

    wallpaperUrlSection.style.display = "none";
    wallpaperFileUploadSection.style.display = "none";
    wallpaperSolidColorSection.style.display = "block";
    wallpaperNotSolidColorSection.style.display = "grid";
  });
};

const handleUIStyleSwitch = () => {
  const uiStyleSolidSection = document.getElementById("ui-style-solid-section") as HTMLDivElement;
  const uiStyleGlassSection = document.getElementById("ui-style-glass-section") as HTMLDivElement;

  uiStyleSolidButtonEl.addEventListener("click", () => {
    uiStyleGlassSection.style.display = "none";
    uiStyleSolidSection.style.display = "block";
  });

  uiStyleGlassButtonEl.addEventListener("click", () => {
    uiStyleSolidSection.style.display = "none";
    uiStyleGlassSection.style.display = "block";
  });
};

const handleBookmarksTypeSwitch = () => {
  // prettier-ignore
  const bookmarksUserDefinedSection = document.getElementById("bookmarks-user-defined-section") as HTMLDivElement;
  // prettier-ignore
  const bookmarksDefaultBlockySection = document.getElementById("bookmarks-default-blocky-section") as HTMLDivElement;

  const hideButtons = ["bookmarks-type-default-button", "bookmarks-type-none-button"];

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => {
    bookmarksDefaultBlockySection.style.display = "none";
    bookmarksUserDefinedSection.style.display = "block";
  });

  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => {
    bookmarksUserDefinedSection.style.display = "none";
    bookmarksDefaultBlockySection.style.display = "block";
  });

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      bookmarksUserDefinedSection.style.display = "none";
      bookmarksDefaultBlockySection.style.display = "none";
    });
  });
};

const handleUserDefinedOrDefaultBlockySwitch = () => {
  // prettier-ignore
  const bookmarksUserDefinedOrDefaultBlockySection = document.getElementById("bookmarks-user-defined-or-default-blocky-section") as HTMLDivElement

  const hide = () => (bookmarksUserDefinedOrDefaultBlockySection.style.display = "none");
  const show = () => (bookmarksUserDefinedOrDefaultBlockySection.style.display = "grid");

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => show());
  bookmarksTypeDefaultButtonEl.addEventListener("click", () => hide());
  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => show());
  bookmarksTypeNoneButtonEl.addEventListener("click", () => hide());
};

const handleBookmarksDefaultBlockyColorTypeSwitch = () => {
  // prettier-ignore
  const customColorSection = document.getElementById("bookmarks-default-blocky-color-section") as HTMLDivElement;

  bookmarksDefaultBlockyColorTypeRandomButtonEl.addEventListener("click", () => {
    customColorSection.style.display = "none";
  });

  bookmarksDefaultBlockyColorTypeCustomButtonEl.addEventListener("click", () => {
    customColorSection.style.display = "block";
  });
};

const handleBookmarksDefaultOrDefaultBlockySwitch = () => {
  // prettier-ignore
  const bookmarksDefaultOrDefaultBlockySection = document.getElementById("bookmarks-default-or-default-blocky-section") as HTMLDivElement

  const hide = () => (bookmarksDefaultOrDefaultBlockySection.style.display = "none");
  const show = () => (bookmarksDefaultOrDefaultBlockySection.style.display = "block");

  bookmarksTypeUserDefinedButtonEl.addEventListener("click", () => hide());
  bookmarksTypeDefaultButtonEl.addEventListener("click", () => show());
  bookmarksTypeDefaultBlockyButtonEl.addEventListener("click", () => show());
  bookmarksTypeNoneButtonEl.addEventListener("click", () => hide());
};
