export const switchButtons = (buttons: HTMLButtonElement[], attr: string) => {
  buttons.forEach((btn) => {
    buttons.forEach((btn) => {
      btn.setAttribute(`btn-option-type`, attr);
      btn.setAttribute("aria-pressed", "false");
    });

    btn.onclick = () => {
      // disable other buttons
      buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
      });

      btn.setAttribute("aria-pressed", "true");
    };
  });
};