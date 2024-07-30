export const handleFaviconTypeSwitch = () => {
  const faviconCustomSection = document.getElementById(
    "title-custom-favicon-upload-section"
  ) as HTMLDivElement;

  (
    document.getElementById("title-favicon-type-default-button") as HTMLButtonElement
  ).addEventListener("click", () => {
    faviconCustomSection.style.display = "none";
  });

  (
    document.getElementById("title-favicon-type-custom-button") as HTMLButtonElement
  ).addEventListener("click", () => {
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

  (document.getElementById("message-type-custom-button") as HTMLButtonElement).addEventListener(
    "click",
    () => {
      messageCustomTextSection.style.display = "block";
    }
  );

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

  (document.getElementById("wallpaper-type-url-button") as HTMLButtonElement).addEventListener(
    "click",
    () => {
      wallpaperFileUploadSection.style.display = "none";
      wallpaperUrlSection.style.display = "block";
    }
  );

  (
    document.getElementById("wallpaper-type-file-upload-button") as HTMLButtonElement
  ).addEventListener("click", () => {
    wallpaperUrlSection.style.display = "none";
    wallpaperFileUploadSection.style.display = "block";
  });
};

export const handleBookmarksTypeSwitch = () => {
  const bookmarksUserDefinedSection = document.getElementById(
    "bookmarks-user-defined-section"
  ) as HTMLDivElement;

  const hideButtons = ["bookmarks-type-default-button", "bookmarks-type-none-button"];

  (
    document.getElementById("bookmarks-type-user-defined-button") as HTMLButtonElement
  ).addEventListener("click", () => {
    bookmarksUserDefinedSection.style.display = "block";
  });

  hideButtons.forEach((id) => {
    (document.getElementById(id) as HTMLButtonElement).addEventListener("click", () => {
      console.log("something", bookmarksUserDefinedSection);
      bookmarksUserDefinedSection.style.display = "none";
    });
  });
};
