import {
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeUserDefinedButtonEl,
  messageTypeCustomButtonEl,
  titleFaviconTypeCustomButtonEl,
  titleFaviconTypeDefaultButtonEl,
  wallpaperTypeFileUploadButtonEl,
  wallpaperTypeUrlButtonEl
} from "src/options/scripts/ui";

export const handleFaviconTypeSwitch = () => {
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

export const handleMessageTypeSwitch = () => {
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
  });

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      messageCustomTextSection.style.display = "none";
    });
  });
};

export const handleWallpaperTypeSwitch = () => {
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

export const handleBookmarksTypeSwitch = () => {
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

export const handleBookmarksDefaultBlockyColorTypeSwitch = () => {
  // prettier-ignore
  const customColorSection = document.getElementById("bookmarks-default-blocky-color-section") as HTMLDivElement;

  bookmarksDefaultBlockyColorTypeRandomButtonEl.addEventListener("click", () => {
    customColorSection.style.display = "none";
  });

  bookmarksDefaultBlockyColorTypeCustomButtonEl.addEventListener("click", () => {
    customColorSection.style.display = "block";
  });
};
