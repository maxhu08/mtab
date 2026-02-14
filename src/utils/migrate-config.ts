/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from "src/utils/config";

export const migrateOldConfig = (config: Config): Config => {
  // if config is before v1.6.5
  // prettier-ignore
  if (typeof config.message.font === "string") config.message.font = { type: "default", custom: "" };
  if (typeof config.search.font === "string") config.search.font = { type: "default", custom: "" };

  // if config is before v1.6.7
  // add 'type' property to user-defined bookmarks
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
      if (!node.type) {
        if ("url" in node) return { ...node, type: "bookmark" };
        if ("contents" in node) return { ...node, type: "folder" };
      }
      return node;
    });
  }

  // if config is before v1.6.8
  // replace userDefinedKeys with numberKeys
  if ("userDefinedKeys" in config.bookmarks) {
    config.bookmarks.numberKeys = !!(config.bookmarks as any).userDefinedKeys;
    delete (config.bookmarks as any).userDefinedKeys;
  }

  // if config is before v1.8.0
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
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

        if (current.type === "folder" && Array.isArray(current.contents)) {
          stack.push(...current.contents);
        }
      }

      return node;
    });
  }

  // if config is before v1.8.3
  // remove the resize property from wallpaper
  if (config.wallpaper && (config as any).wallpaper.resize) {
    delete (config as any).wallpaper.resize;
  }

  // if config is before v1.8.3
  // ensure 'filters' object exists (defensive)
  if (!config.wallpaper.filters || typeof config.wallpaper.filters !== "object") {
    (config.wallpaper as any).filters = { blur: "0px", brightness: "1" };
  }

  // if config is before v1.8.3
  // ensure 'blur' and 'brightness' properties exist for wallpaper.filters
  if (!config.wallpaper.filters.blur) config.wallpaper.filters.blur = "0px";
  if (!config.wallpaper.filters.brightness) config.wallpaper.filters.brightness = "1";

  // if config is before v1.8.6
  if (config.wallpaper.url === "./wallpapers/bg-1.png") {
    config.wallpaper.url = "./wallpapers/default.png";
  }

  // if config is before v1.9.2
  if (!config.title) {
    (config as any).title = { effect: "none" };
  } else if (typeof (config.title as any).effect !== "string") {
    (config.title as any).effect = "none";
  }

  if (typeof config.search.suggestions !== "boolean") config.search.suggestions = true;

  // if config is before v1.9.3
  if (!("linkTextColor" in config.search)) (config.search as any).linkTextColor = "#0ea5e9";
  if (typeof config.search.recognizeLinks !== "boolean") config.search.recognizeLinks = true;

  // if config is before v1.9.8
  if (!(config.title as any).typewriter || typeof (config.title as any).typewriter !== "object") {
    (config.title as any).typewriter = { speed: 500, remainCount: 1 };
  } else {
    if (typeof (config.title as any).typewriter.speed !== "number")
      (config.title as any).typewriter.speed = 500;
    if (typeof (config.title as any).typewriter.remainCount !== "number")
      (config.title as any).typewriter.remainCount = 1;
  }

  // if config is before v1.9.9
  if (config.wallpaper.url === "./wallpapers/default.png") {
    config.wallpaper.url = "";

    if (config.wallpaper.type === "url") config.wallpaper.type = "default";
  }

  if (typeof (config.search.assist as any).passwordGenerator !== "boolean") {
    (config.search.assist as any).passwordGenerator = true;
  }

  // if config is before v1.10.1
  if ((config.wallpaper as any).type === "fileUpload")
    (config.wallpaper as any).type = "file-upload";
  if (typeof (config.wallpaper as any).solidColor !== "string")
    (config.wallpaper as any).solidColor = "#171717";
  if (config.ui && "backgroundColor" in (config.ui as any)) {
    const color = (config.ui as any).backgroundColor;
    if (typeof color === "string" && color.trim() !== "") {
      (config.wallpaper as any).solidColor = color;
    }
    delete (config.ui as any).backgroundColor;
  }

  // if config is before v1.10.4
  // add bookmarks.defaultIconColor and drop redundant node.iconColor when it equals the default
  // only runs when defaultIconColor is missing or invalid to avoid messing with users who have already added this property manually
  if (
    !(config.bookmarks as any).defaultIconColor ||
    typeof (config.bookmarks as any).defaultIconColor !== "string"
  ) {
    (config.bookmarks as any).defaultIconColor = "#ffffff";

    if (config.bookmarks.userDefined) {
      const defaultIconColor = (config.bookmarks as any).defaultIconColor;

      config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
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
  if (!(config.search as any).buttons || typeof (config.search as any).buttons !== "object") {
    (config.search as any).buttons = {
      clear: true,
      search: true
    };
  }
  if (typeof (config.search as any).buttons.clear !== "boolean") {
    (config.search as any).buttons.clear = true;
  }
  if (typeof (config.search as any).buttons.search !== "boolean") {
    (config.search as any).buttons.search = true;
  }

  return config;
};
