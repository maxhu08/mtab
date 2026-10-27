export const initExpandedEditor = (): void => {
  const overlay = document.getElementById("expanded-editor")!;
  const title = document.getElementById("expanded-editor-title")!;
  const button = document.getElementById("ui-custom-css-expand-button")!;
  const collapse = document.getElementById("expanded-editor-close")!;
  const description = document.getElementById("ui-custom-css-description")!;
  const container = document.getElementById("ui-custom-css-container")!;
  const textarea = container.querySelector("textarea")!;
  let close: ((focus?: boolean) => void) | undefined;

  button.addEventListener("click", () => {
    if (close) return;

    const selection = [textarea.selectionStart, textarea.selectionEnd] as const;
    const direction = textarea.selectionDirection;
    const scroll = [textarea.scrollTop, textarea.scrollLeft] as const;
    const position = { left: window.scrollX, top: window.scrollY, behavior: "instant" } as const;
    // Preserve the inline layout while the original editor and its listeners are in the overlay.
    const placements = [description, container].map((element) => {
      const placeholder = document.createElement("div");
      placeholder.style.height = `${element.getBoundingClientRect().height}px`;
      element.replaceWith(placeholder);
      return { element, placeholder };
    });
    const background = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== overlay && element.id !== "toaster-wrapper"
      )
      .map((element) => ({ element, inert: element.inert }));

    title.textContent = "ui.customCSS";
    overlay.append(description, container);
    background.forEach((item) => (item.element.inert = true));
    document.documentElement.classList.add("expanded-editor-open");
    overlay.hidden = false;
    window.dispatchEvent(new Event("resize"));
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(selection[0], selection[1], direction);
    textarea.scrollTop = scroll[0];
    textarea.scrollLeft = scroll[1];
    textarea.dispatchEvent(new Event("scroll"));

    close = (focus = true) => {
      const selection = [textarea.selectionStart, textarea.selectionEnd] as const;
      const direction = textarea.selectionDirection;
      const scroll = [textarea.scrollTop, textarea.scrollLeft] as const;

      placements.forEach((item) => item.placeholder.replaceWith(item.element));
      background.forEach((item) => (item.element.inert = item.inert));
      overlay.hidden = true;
      document.documentElement.classList.remove("expanded-editor-open");
      window.dispatchEvent(new Event("resize"));
      window.scrollTo(position);
      if (focus) button.focus({ preventScroll: true });
      textarea.setSelectionRange(selection[0], selection[1], direction);
      textarea.scrollTop = scroll[0];
      textarea.scrollLeft = scroll[1];
      textarea.dispatchEvent(new Event("scroll"));
      close = undefined;
    };
  });

  collapse.addEventListener("click", () => close?.());
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      close?.();
    }

    if (event.key !== "Tab" || event.defaultPrevented) return;

    if (event.shiftKey && document.activeElement === collapse) {
      event.preventDefault();
      textarea.focus();
    } else if (!event.shiftKey && document.activeElement === textarea) {
      event.preventDefault();
      collapse.focus();
    }
  });

  window.addEventListener("options-before-layout-snapshot", () => close?.(false));
};