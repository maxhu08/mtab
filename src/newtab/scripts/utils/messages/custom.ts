export const setCustomMessage = (messageEl: HTMLParagraphElement, customText: string) => {
  const date = new Date();

  const hours12 = date.getHours() % 12 || 12;
  const meridianLower = date.getHours() >= 12 ? "pm" : "am";
  const meridianUpper = meridianLower.toUpperCase();

  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const monthOfYear = (date.getMonth() + 1).toString().padStart(2, "0");

  customText = customText;
  customText = customText
    .replace(/\\n/g, "\n")
    .replace(/\\yyyy/g, date.getFullYear().toString()) // must come before \yy
    .replace(/\\yyyy/g, date.getFullYear().toString()) // must come before \yy
    .replace(/\\yy/g, date.getFullYear().toString().slice(-2))
    .replace(/\\MD/g, meridianUpper) // must come before \M
    .replace(/\\M/g, date.toLocaleString("default", { month: "long" }))
    .replace(/\\m\$/g, monthOfYear) // must come before \m
    .replace(/\\mm/g, date.getMinutes().toString().padStart(2, "0")) // must come before \m\
    .replace(/\\md/g, meridianLower) // must come before \m
    .replace(/\\m/g, date.toLocaleString("default", { month: "short" }))
    .replace(/\\D/g, date.toLocaleString("default", { weekday: "long" }))
    .replace(/\\d\$/g, dayOfMonth) // must come before \d
    .replace(/\\d/g, date.toLocaleString("default", { weekday: "short" }))
    .replace(/\\h%/g, hours12.toString().padStart(2, "0"))
    .replace(/\\hh/g, date.getHours().toString().padStart(2, "0"))
    .replace(/\\ss/g, date.getSeconds().toString().padStart(2, "0"));

  messageEl.textContent = customText;
};

export const containsSlashReplacements = (text: string) => {
  const checkChars = [
    "\\yyyy",
    "\\yy",
    "\\M",
    "\\m",
    "\\m$",
    "\\D",
    "\\d",
    "\\d$",
    "\\h%",
    "\\hh",
    "\\mm",
    "\\ss",
    "\\md",
    "\\MD"
  ];

  return checkChars.some((char) => text.includes(char));
};
