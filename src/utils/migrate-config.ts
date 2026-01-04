/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from "src/utils/config";

export const migrateOldConfig = (config: Config): Config => {
  // if config is before v1.9.2
  if (!("linkTextColor" in config.search)) (config.search as any).linkTextColor = "#0ea5e9";
  if (typeof config.search.recognizeLinks !== "boolean") config.search.recognizeLinks = true;
  if (typeof config.search.suggestions !== "boolean") config.search.suggestions = true;

  // if config is before v1.6.5
  // prettier-ignore
  if (typeof config.message.font === "string") config.message.font = { type: "default", custom: "" };
  if (typeof config.search.font === "string") config.search.font = { type: "default", custom: "" };

  // if config is before v.1.6.7
  // add 'type' property to user-defined bookmarks
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
      if (!node.type) {
        if ("url" in node) return { ...node, type: "bookmark" }; // add type for bookmarks
        if ("contents" in node) return { ...node, type: "folder" }; // add type for folders
      }
      return node;
    });
  }

  // if config is before v1.6.8
  // replace userDefinedKeys with numberKeys
  if ("userDefinedKeys" in config.bookmarks) {
    // ensure userDefinedKeys is a boolean
    config.bookmarks.numberKeys = !!config.bookmarks.userDefinedKeys;
    delete config.bookmarks.userDefinedKeys;
  }

  // if config is before v1.8.0
  // ensure 'fill' property exists for user-defined bookmarks
  if (config.bookmarks.userDefined) {
    config.bookmarks.userDefined = config.bookmarks.userDefined.map((node: any) => {
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();

        if (
          ((current.type === "bookmark" || current.type === "folder") && !("fill" in current)) ||
          current.fill === "undefined"
        ) {
          current.fill = "";
        }

        if (current.type === "folder" && (!("iconType" in current) || !current.iconType)) {
          current.iconType = config.bookmarks.defaultFolderIconType;
        }

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
  // ensure 'blur' and 'brightness' properties exist for wallpaper.filter
  if (!config.wallpaper.filters.blur) config.wallpaper.filters.blur = "0px";
  if (!config.wallpaper.filters.brightness) config.wallpaper.filters.brightness = "1";

  // if config is before v1.8.6
  if (config.wallpaper.url === "./wallpapers/bg-1.png") {
    config.wallpaper.url = "./wallpapers/default.png";
  }

  return config;
};
