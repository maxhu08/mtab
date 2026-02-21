import { Config } from "src/utils/config";
import { wallpaperEl } from "src/newtab/scripts/ui";
import { hideCover } from "src/newtab/scripts/utils/hide-cover";
import { logger } from "src/utils/logger";
import {
  UploadedWallpaperFileMeta,
  getUploadedWallpaperFile,
  listUploadedWallpaperFiles
} from "src/utils/wallpaper-file-storage";
import {
  getMixedUploadedWallpaperFile,
  listMixedUploadedWallpaperFiles,
  listMixedWallpaperEntries
} from "src/utils/mixed-wallpaper-storage";
import { resolveWallpaperIndex } from "src/utils/wallpaper-rotation";
import { resolveRandomWallpaper } from "src/newtab/scripts/utils/random-wallpaper";
import { setWallpaperAuthorCredit } from "src/newtab/scripts/utils/wallpaper-credit";

const DEFAULT_WALLPAPER_URL = "./wallpapers/default.jpg";

export const loadWallpaper = (wallpaper: Config["wallpaper"]) => {
  if (!wallpaper.enabled) return;
  setWallpaperAuthorCredit(undefined);

  if (wallpaper.type === "file-upload") {
    loadUploadedFileWallpaper(wallpaper)
      .catch((err) => {
        logger.log("Error loading file-upload wallpaper", err);
      })
      .finally(() => {
        hideCover();
      });

    return;
  }

  if (wallpaper.type === "solid-color") {
    loadSolidColorWallpaper(wallpaper)
      .catch((err) => {
        logger.log("Error loading solid-color wallpaper", err);
      })
      .finally(() => {
        hideCover();
      });

    return;
  }

  if (wallpaper.type === "default") {
    applyWallpaper(DEFAULT_WALLPAPER_URL, wallpaper.filters.brightness, wallpaper.filters.blur);
    hideCover();
    return;
  }

  if (wallpaper.type === "mixed") {
    loadMixedWallpaper(wallpaper)
      .catch((err) => {
        logger.log("Error loading mixed wallpaper", err);
      })
      .finally(() => {
        hideCover();
      });

    return;
  }

  if (wallpaper.type === "random") {
    loadRandomWallpaper(wallpaper)
      .catch((err) => {
        logger.log("Error loading random wallpaper", err);
      })
      .finally(() => {
        hideCover();
      });

    return;
  }

  loadURLWallpaper(wallpaper)
    .catch((err) => {
      logger.log("Error loading url wallpaper", err);
    })
    .finally(() => {
      hideCover();
    });
};

const loadURLWallpaper = async (wallpaper: Config["wallpaper"]) => {
  const urls = wallpaper.urls.filter((url) => typeof url === "string" && url.trim().length > 0);

  if (urls.length === 0) return;

  const index = await resolveWallpaperIndex({
    rotationKey: `wallpaper-url`,
    frequency: wallpaper.frequency,
    itemCount: urls.length
  });

  if (index < 0) return;

  const next = urls[index];
  applyWallpaper(next, wallpaper.filters.brightness, wallpaper.filters.blur);
};

const loadRandomWallpaper = async (wallpaper: Config["wallpaper"]) => {
  const selection = await resolveRandomWallpaper(wallpaper.frequency);

  if (!selection) return;

  setWallpaperAuthorCredit(selection.author, selection.authorLink);
  applyWallpaper(selection.url, wallpaper.filters.brightness, wallpaper.filters.blur);
};

const loadSolidColorWallpaper = async (wallpaper: Config["wallpaper"]) => {
  const colors = wallpaper.solidColors.filter(
    (color) => typeof color === "string" && color.trim().length > 0
  );

  if (colors.length === 0) return;

  const index = await resolveWallpaperIndex({
    rotationKey: `wallpaper-solid-color`,
    frequency: wallpaper.frequency,
    itemCount: colors.length
  });

  if (index < 0) return;

  applySolidColorWallpaper(colors[index]);
};

const loadUploadedFileWallpaper = async (wallpaper: Config["wallpaper"]) => {
  const files = await listUploadedWallpaperFiles();

  if (files.length === 0) return;

  const index = await resolveWallpaperIndex({
    rotationKey: `wallpaper-file-upload`,
    frequency: wallpaper.frequency,
    itemCount: files.length
  });

  if (index < 0) return;

  const selected = files[index];
  const blob = await getUploadedWallpaperFile(selected.id);

  if (!blob) return;

  applyWallpaper(blob, wallpaper.filters.brightness, wallpaper.filters.blur, selected);
};

const loadMixedWallpaper = async (wallpaper: Config["wallpaper"]) => {
  const [entries, files] = await Promise.all([
    listMixedWallpaperEntries(),
    listMixedUploadedWallpaperFiles()
  ]);

  const validEntries = entries.filter((entry) => {
    if (entry.kind === "file-upload") {
      return files.some((file) => file.id === entry.value);
    }

    return typeof entry.value === "string" && entry.value.trim().length > 0;
  });

  if (validEntries.length === 0) return;

  const index = await resolveWallpaperIndex({
    rotationKey: "wallpaper-mixed",
    frequency: wallpaper.frequency,
    itemCount: validEntries.length
  });

  if (index < 0) return;

  const selected = validEntries[index];

  if (selected.kind === "url") {
    applyWallpaper(selected.value, wallpaper.filters.brightness, wallpaper.filters.blur);
    return;
  }

  if (selected.kind === "solid-color") {
    applySolidColorWallpaper(selected.value);
    return;
  }

  const fileMeta = files.find((file) => file.id === selected.value);
  if (!fileMeta) return;

  const blob = await getMixedUploadedWallpaperFile(fileMeta.id);
  if (!blob) return;

  applyWallpaper(blob, wallpaper.filters.brightness, wallpaper.filters.blur, fileMeta);
};

const applyWallpaper = (
  wallpaper: Blob | string,
  brightness: string,
  blur: string,
  fileMeta?: UploadedWallpaperFileMeta
) => {
  wallpaperEl.style.transitionDuration = "0ms";
  let src: string;
  let userScale = 1;

  if (wallpaper instanceof Blob) src = URL.createObjectURL(wallpaper);
  else src = wallpaper;

  const isVideo =
    (wallpaper instanceof Blob && wallpaper.type.startsWith("video/")) ||
    (typeof wallpaper === "string" &&
      (wallpaper.startsWith("data:video/") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(wallpaper)));

  const mediaEl = isVideo ? document.createElement("video") : document.createElement("img");
  mediaEl.src = src;
  mediaEl.style.position = "absolute";
  mediaEl.style.width = "100%";
  mediaEl.style.height = "100%";
  mediaEl.style.objectFit = "cover";

  if (isVideo) {
    const videoEl = mediaEl as HTMLVideoElement;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;

    if (fileMeta) {
      videoEl.playbackRate = fileMeta.videoOptions.playbackRate;
      userScale = fileMeta.videoOptions.zoom;
      mediaEl.style.transition = `opacity ${fileMeta.videoOptions.fade}s linear`;
    }
  } else if (fileMeta) {
    mediaEl.style.objectPosition = `${fileMeta.imageOptions.x} ${fileMeta.imageOptions.y}`;
    const sizePercent =
      fileMeta.imageOptions.size === "cover"
        ? 100
        : Number.parseInt(fileMeta.imageOptions.size.replace("%", ""));
    userScale = Number.isFinite(sizePercent) ? sizePercent / 100 : 1;
  }

  applyWallpaperFilters(mediaEl, brightness, blur, userScale);
  wallpaperEl.innerHTML = "";
  wallpaperEl.appendChild(mediaEl);

  if (wallpaper instanceof Blob) {
    mediaEl.onload = () => URL.revokeObjectURL(src);
  }
};

const applyWallpaperFilters = (
  element: HTMLElement,
  brightness: string,
  blur: string,
  userScale: number
) => {
  element.style.filter = `brightness(${brightness}) blur(${blur})`;
  const blurValue = Number.parseFloat(blur);
  const blurScale = Number.isFinite(blurValue) && blurValue > 0 ? 1.1 : 1;
  const safeScale = Number.isFinite(userScale) && userScale > 0 ? userScale : 1;
  element.style.transform = `scale(${blurScale * safeScale})`;
};

export const applyWallpaperLegacy = (url: string, brightness: string, blur: string) => {
  applyWallpaper(url, brightness, blur);
};

export const applySolidColorWallpaper = (color: string) => {
  if (!color) return;

  wallpaperEl.style.transitionDuration = "0ms";

  const solidEl = document.createElement("div");
  solidEl.style.position = "absolute";
  solidEl.style.width = "100%";
  solidEl.style.height = "100%";
  solidEl.style.backgroundColor = color;

  wallpaperEl.innerHTML = "";
  wallpaperEl.appendChild(solidEl);
  hideCover();
};
