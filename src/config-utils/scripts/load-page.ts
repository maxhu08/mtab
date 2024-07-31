import { handle } from "src/config-utils/scripts/handle";

export const loadPage = () => {
  const logo = document.getElementById("mtab-logo") as HTMLImageElement;
  logo.classList.add("animate-up-bouncy");

  logo.addEventListener(
    "animationend",
    () => {
      logo.classList.replace("animate-up-bouncy", "animate-float");
    },
    {
      once: true
    }
  );

  handle();
};
