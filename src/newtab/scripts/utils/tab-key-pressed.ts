let tabKeyPressed = false;

document.addEventListener("keydown", (e) => e.key === "Tab" && (tabKeyPressed = true));
document.addEventListener("keyup", (e) => e.key === "Tab" && (tabKeyPressed = false));

export const getTabKeyPressed = () => tabKeyPressed;
