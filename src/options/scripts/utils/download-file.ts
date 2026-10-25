export const downloadFile = (file: Blob, name: string) => {
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = name;

  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const wallpaperFilename = (name: string, mime: string) => {
  const filename =
    Array.from(name)
      .filter((char) => char.charCodeAt(0) >= 32)
      .join("")
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/^[. ]+|[. ]+$/g, "") || "wallpaper";

  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "video/quicktime": "mov"
  };

  const extension = extensions[mime];

  if (!extension) return filename;
  if (filename.toLowerCase().endsWith(`.${extension}`)) return filename;
  if (mime === "image/jpeg" && /\.jpeg$/i.test(filename)) return filename;

  return `${filename.replace(/\.[^.]+$/, "")}.${extension}`;
};