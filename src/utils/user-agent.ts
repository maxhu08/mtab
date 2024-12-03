export const getUserAgent = () => {
  if (navigator.userAgent.indexOf("Chrome") !== -1) return "chrome";
  else if (navigator.userAgent.indexOf("Firefox") !== -1) return "firefox";
  else return "unknown";
};
