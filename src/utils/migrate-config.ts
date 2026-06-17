import { Config } from "~/src/utils/config";
import { normalizeStoredHotkey } from "~/src/utils/hotkeys";

type LegacyBookmarkNode = Record<string, unknown> & {
  type?: string;
  url?: string;
  contents?: LegacyBookmarkNode[];
  iconColor?: unknown;
};

type LegacyConfig = Omit<Config, "bookmarks" | "search" | "title" | "ui" | "wallpaper"> & {
  bookmarks: Omit<Config["bookmarks"], "userDefined"> & {
    userDefined?: LegacyBookmarkNode[];
    userDefinedKeys?: unknown;
    defaultIconColor?: unknown;
    enablePagination?: unknown;
    maxBookmarkRowsPerPage?: unknown;
  };
  search: Omit<Config["search"], "assist" | "buttons" | "linkTextColor"> & {
    assist: Omit<Config["search"]["assist"], "passwordGenerator"> & {
      passwordGenerator?: unknown;
    };
    buttons?: {
      clear?: unknown;
      search?: unknown;
    };
    linkTextColor?: unknown;
  };
  title: Omit<Config["title"], "effect" | "typewriter"> & {
    effect?: unknown;
    typewriter?: {
      speed?: unknown;
      remainCount?: unknown;
    };
  };
  ui: Config["ui"] & {
    backgroundColor?: unknown;
  };
  wallpaper: Omit<
    Config["wallpaper"],
    "filters" | "frequency" | "solidColors" | "type" | "urls"
  > & {
    filters?: Partial<Config["wallpaper"]["filters"]> | unknown;
    frequency?: unknown;
    resize?: unknown;
    solidColor?: unknown;
    solidColors?: unknown;
    type?: unknown;
    url?: unknown;
    urls?: unknown;
  };
};

const toCleanStringArray = (value: unknown, fallback: string[] = []) => {
  if (!Array.isArray(value)) return fallback;

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
};

export const migrateOldConfig = (config: Config): Config => {
  const legacy = config as LegacyConfig;

  // if config is before v1.6.5
  // prettier-ignore
  if (typeof config.message.font === "string") config.message.font = { type: "default", custom: "" };
  if (typeof config.search.font === "string") config.search.font = { type: "default", custom: "" };

  // if config is before v1.6.7
  // add 'type' property to user-defined bookmarks
  if (legacy.bookmarks.userDefined) {
    legacy.bookmarks.userDefined = legacy.bookmarks.userDefined.map((node) => {
      if (!node.type) {
        if ("url" in node) return { ...node, type: "bookmark" };
        if ("contents" in node) return { ...node, type: "folder" };
      }
      return node;
    });
  }

  // if config is before v1.6.8
  // replace userDefinedKeys with numberKeys
  if ("userDefinedKeys" in legacy.bookmarks) {
    legacy.bookmarks.numberKeys = !!legacy.bookmarks.userDefinedKeys;
    delete legacy.bookmarks.userDefinedKeys;
  }

  // if config is before v1.8.0
  if (legacy.bookmarks.userDefined) {
    legacy.bookmarks.userDefined = legacy.bookmarks.userDefined.map((node) => {
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();

        // if (
        //   ((current.type === "bookmark" || current.type === "folder") && !("fill" in current)) ||
        //   current.fill === "undefined"
        // ) {
        //   current.fill = "";
        // }

        // if (current.type === "folder" && (!("iconType" in current) || !current.iconType)) {
        //   current.iconType = config.bookmarks.defaultFolderIconType;
        // }

        if (current?.type === "folder" && Array.isArray(current.contents)) {
          stack.push(...current.contents);
        }
      }

      return node;
    });
  }

  // if config is before v1.8.3
  // remove the resize property from wallpaper
  if (legacy.wallpaper && legacy.wallpaper.resize) {
    delete legacy.wallpaper.resize;
  }

  // if config is before v1.8.3
  // ensure 'filters' object exists (defensive)
  if (!legacy.wallpaper.filters || typeof legacy.wallpaper.filters !== "object") {
    legacy.wallpaper.filters = { blur: "0px", brightness: "1" };
  }

  // if config is before v1.8.3
  // ensure 'blur' and 'brightness' properties exist for wallpaper.filters
  if (!config.wallpaper.filters.blur) config.wallpaper.filters.blur = "0px";
  if (!config.wallpaper.filters.brightness) config.wallpaper.filters.brightness = "1";

  // if config is before v1.8.6
  if (legacy.wallpaper.url === "./wallpapers/bg-1.png") {
    legacy.wallpaper.url = "./wallpapers/default.png";
  }

  // if config is before v1.9.2
  if (!config.title) {
    legacy.title = { effect: "none" } as LegacyConfig["title"];
  } else if (typeof legacy.title.effect !== "string") {
    legacy.title.effect = "none";
  }

  if (typeof config.search.suggestions !== "boolean") config.search.suggestions = true;

  // if config is before v1.9.3
  if (!("linkTextColor" in legacy.search)) legacy.search.linkTextColor = "#0ea5e9";
  if (typeof config.search.recognizeLinks !== "boolean") config.search.recognizeLinks = true;

  // if config is before v1.9.8
  if (!legacy.title.typewriter || typeof legacy.title.typewriter !== "object") {
    legacy.title.typewriter = { speed: 500, remainCount: 1 };
  } else {
    if (typeof legacy.title.typewriter.speed !== "number") legacy.title.typewriter.speed = 500;
    if (typeof legacy.title.typewriter.remainCount !== "number") {
      legacy.title.typewriter.remainCount = 1;
    }
  }

  // if config is before v1.9.9
  if (legacy.wallpaper.url === "./wallpapers/default.png") {
    legacy.wallpaper.url = "";

    if (config.wallpaper.type === "url") config.wallpaper.type = "default";
  }

  if (typeof legacy.search.assist.passwordGenerator !== "boolean") {
    legacy.search.assist.passwordGenerator = true;
  }

  // if config is before v1.10.1
  if (legacy.wallpaper.type === "fileUpload") legacy.wallpaper.type = "file-upload";
  if (typeof legacy.wallpaper.solidColor !== "string") {
    legacy.wallpaper.solidColor = "#171717";
  }
  if (legacy.ui && "backgroundColor" in legacy.ui) {
    const color = legacy.ui.backgroundColor;
    if (typeof color === "string" && color.trim() !== "") {
      legacy.wallpaper.solidColor = color;
    }
    delete legacy.ui.backgroundColor;
  }

  // if config is before v1.10.4
  // add bookmarks.defaultIconColor and drop redundant node.iconColor when it equals the default
  // only runs when defaultIconColor is missing or invalid to avoid messing with users who have already added this property manually
  if (!legacy.bookmarks.defaultIconColor || typeof legacy.bookmarks.defaultIconColor !== "string") {
    legacy.bookmarks.defaultIconColor = "#ffffff";

    if (legacy.bookmarks.userDefined) {
      const defaultIconColor = legacy.bookmarks.defaultIconColor;

      legacy.bookmarks.userDefined = legacy.bookmarks.userDefined.map((node) => {
        const stack = [node];

        while (stack.length) {
          const current = stack.pop();

          if (
            current &&
            typeof current === "object" &&
            "iconColor" in current &&
            typeof current.iconColor === "string" &&
            current.iconColor === defaultIconColor
          ) {
            delete current.iconColor;
          }

          if (current?.type === "folder" && Array.isArray(current.contents)) {
            stack.push(...current.contents);
          }
        }

        return node;
      });
    }
  }

  // if config is before v1.10.5
  if (!legacy.search.buttons || typeof legacy.search.buttons !== "object") {
    legacy.search.buttons = {
      clear: true,
      search: true
    };
  }
  if (typeof legacy.search.buttons.clear !== "boolean") {
    legacy.search.buttons.clear = true;
  }
  if (typeof legacy.search.buttons.search !== "boolean") {
    legacy.search.buttons.search = true;
  }

  if (typeof legacy.bookmarks.enablePagination !== "boolean") {
    legacy.bookmarks.enablePagination = true;
  }
  if (
    typeof legacy.bookmarks.maxBookmarkRowsPerPage !== "number" ||
    !Number.isFinite(legacy.bookmarks.maxBookmarkRowsPerPage)
  ) {
    legacy.bookmarks.maxBookmarkRowsPerPage = 2;
  }

  // if config is before v1.10.8
  // migrate single wallpaper url/solidColor fields to arrays and add wallpaper.frequency
  const legacyUrl = typeof legacy.wallpaper.url === "string" ? legacy.wallpaper.url.trim() : "";
  const legacySolidColor =
    typeof legacy.wallpaper.solidColor === "string" ? legacy.wallpaper.solidColor.trim() : "";

  const migratedUrls = toCleanStringArray(legacy.wallpaper.urls);
  const migratedSolidColors = toCleanStringArray(legacy.wallpaper.solidColors);

  legacy.wallpaper.urls =
    migratedUrls.length > 0 ? migratedUrls : legacyUrl.length > 0 ? [legacyUrl] : [];

  legacy.wallpaper.solidColors =
    migratedSolidColors.length > 0
      ? migratedSolidColors
      : legacySolidColor.length > 0
        ? [legacySolidColor]
        : ["#171717"];

  const allowedWallpaperFrequencies = [
    "constant",
    "every-tab",
    "every-hour",
    "every-day",
    "daylight"
  ];
  const allowedWallpaperTypes = ["url", "file-upload", "solid-color", "default", "random", "mixed"];
  if (
    !legacy.wallpaper.type ||
    typeof legacy.wallpaper.type !== "string" ||
    !allowedWallpaperTypes.includes(legacy.wallpaper.type)
  ) {
    legacy.wallpaper.type = "default";
  }
  if (
    !legacy.wallpaper.frequency ||
    typeof legacy.wallpaper.frequency !== "string" ||
    !allowedWallpaperFrequencies.includes(legacy.wallpaper.frequency)
  ) {
    legacy.wallpaper.frequency = "constant";
  }

  delete legacy.wallpaper.url;
  delete legacy.wallpaper.solidColor;

  // if config is before v1.11.3
  config.hotkeys.activationKey = normalizeStoredHotkey(config.hotkeys.activationKey);
  config.hotkeys.closePageKey = normalizeStoredHotkey(config.hotkeys.closePageKey);
  config.hotkeys.searchBookmarksKey = normalizeStoredHotkey(config.hotkeys.searchBookmarksKey);

  return config;
};