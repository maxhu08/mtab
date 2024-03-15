export const switchButtons = (buttons: HTMLButtonElement[], attr: string) => {
  buttons.forEach((btn) => {
    buttons.forEach((btn) => {
      btn.setAttribute(`btn-option-type`, attr);
      btn.setAttribute("selected", "no");
    });

    btn.onclick = () => {
      // disable other buttons
      buttons.forEach((btn) => {
        btn.setAttribute("selected", "no");
      });

      btn.setAttribute("selected", "yes");
    };
  });
};
