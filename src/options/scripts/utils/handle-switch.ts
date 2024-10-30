import {
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksTypeUserDefinedButtonEl,
  messageTypeCustomButtonEl,
  titleFaviconTypeCustomButtonEl,
  titleFaviconTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl
} from "src/options/scripts/ui";

export const handleSwitches = () => {
  handleFaviconTypeSwitch();
  handleMessageTypeSwitch();
  handleWallpaperTypeSwitch();
  handleBookmarksTypeSwitch();
  handleUserDefinedOrDefaultBlockySwitch();
  handleBookmarksDefaultBlockyColorTypeSwitch();
  handleBookmarksDefaultOrDefaultBlockySwitch();
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

const handleMessageTypeSwitch = () => {
  const messageCustomTextSection = document.getElementById(
    "message-custom-text-section"
  ) as HTMLDivElement;
  const hideButtons = [
    "message-type-afternoon-morning-button",
    "message-type-date-button",
    "message-type-time-12-button",
    "message-type-time-24-button"
  ];

  messageTypeCustomButtonEl.addEventListener("click", () => {
    messageCustomTextSection.style.display = "block";

    (document.getElementById("message-custom-text-info") as HTMLParagraphElement).textContent =
      'You can use \\ to represent:\n\n\
                - Date components\n\
                - \\yyyy -> Full year (e.g., "2020")\n\
                - \\yy -> Last two digits of the year (e.g., "20")\n\
                - \\M -> Full month name (e.g., "October")\n\
                - \\m -> Abbreviated month name (e.g., "Oct")\n\
                - \\D -> Full day of the week name (e.g., "Monday")\n\
                - \\d -> Abbreviated day of the week (e.g., "Mon")\n\n\
                - Time components\n\
                - \\h% -> Hours (12 hour format, e.g., "01")\n\
                - \\hh -> Hours (with padding, e.g., "01")\n\
                - \\mm -> Minutes (with padding, e.g., "02")\n\
                - \\ss -> Seconds (with padding, e.g., "03")\n\n\
                - Meridian components\n\
                - \\md -> Lowercase meridian (e.g., "am" or "pm")\n\
                - \\MD -> Uppercase meridian (e.g., "AM" or "PM")';
  });

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      messageCustomTextSection.style.display = "none";
    });
  });
};

const handleWallpaperTypeSwitch = () => {
  const wallpaperUrlSection = document.getElementById("wallpaper-url-section") as HTMLDivElement;
  const wallpaperFileUploadSection = document.getElementById(
    "wallpaper-file-upload-section"
  ) as HTMLDivElement;

  wallpaperTypeUrlButtonEl.addEventListener("click", () => {
    wallpaperFileUploadSection.style.display = "none";
    wallpaperUrlSection.style.display = "block";
  });

  wallpaperTypeFileUploadButtonEl.addEventListener("click", () => {
    wallpaperUrlSection.style.display = "none";
    wallpaperFileUploadSection.style.display = "block";
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
  const show = () => (bookmarksUserDefinedOrDefaultBlockySection.style.display = "block");

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
