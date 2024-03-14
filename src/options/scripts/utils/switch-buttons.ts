export const switchButtons = (buttons: HTMLButtonElement[]) => {
  console.log(buttons);

  buttons.forEach((btn) => {
    buttons.forEach((btn) => {
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
