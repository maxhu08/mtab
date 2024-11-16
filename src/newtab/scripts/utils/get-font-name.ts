export const getFontNameFromURL = (url: string) => {
  const urlParams = new URLSearchParams(url.split("?")[1]);
  const fontFamily = urlParams.get("family");
  if (fontFamily) return fontFamily.split(":")[0].replace(/\+/g, " "); // replace '+' with spaces to get the proper font name

  return null;
};
