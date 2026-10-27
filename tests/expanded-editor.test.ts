import { afterEach, describe, expect, mock, test } from "bun:test";
import { JSDOM } from "jsdom";

const pages: JSDOM[] = [];

const evaluate = async (page: JSDOM, path: string, call = "") => {
  page.window.eval(
    new Bun.Transpiler({ loader: "ts" }).transformSync(
      (await Bun.file(path).text()).split("export const ").join("const ")
    ) + call
  );
};

const createPage = async () => {
  const page = new JSDOM(await Bun.file("src/options.html").text(), {
    url: "https://example.com/options.html",
    runScripts: "outside-only"
  });
  pages.push(page);
  page.window.scrollTo = mock(() => {});
  await evaluate(page, "src/options/scripts/utils/expanded-editor.ts", "\ninitExpandedEditor();");
  const document = page.window.document;
  return {
    page,
    document,
    button: document.getElementById("ui-custom-css-expand-button")!,
    close: document.getElementById("expanded-editor-close")!,
    overlay: document.getElementById("expanded-editor")!,
    textarea: document.getElementById("ui-custom-css-textarea") as HTMLTextAreaElement
  };
};

afterEach(() => pages.splice(0).forEach((page) => page.window.close()));

describe("expanded CSS editor", () => {
  test("moves the original editor and description, then restores them without losing edits", async () => {
    const view = await createPage();
    const parent = view.textarea.closest("#ui-custom-css-container")!.parentElement!;
    const children = Array.from(parent.childNodes);
    const description = view.document.getElementById("ui-custom-css-description")!;
    const input = mock(() => {});
    view.textarea.addEventListener("input", input);
    view.button.click();
    expect(view.overlay.hidden).toBe(false);
    expect(view.overlay.contains(view.textarea)).toBe(true);
    expect(view.overlay.contains(description)).toBe(true);
    expect(view.document.getElementById("expanded-editor-title")!.textContent).toBe("ui.customCSS");
    expect(view.document.querySelectorAll("textarea")).toHaveLength(1);
    expect(view.document.activeElement).toBe(view.textarea);
    view.textarea.value = "#message { color: red; }";
    view.textarea.dispatchEvent(new view.page.window.Event("input", { bubbles: true }));
    view.close.click();
    expect(input).toHaveBeenCalledTimes(1);
    expect(view.overlay.hidden).toBe(true);
    expect(Array.from(parent.childNodes)).toEqual(children);
    expect(view.document.getElementById("ui-custom-css-textarea")).toBe(view.textarea);
    expect(view.textarea.value).toBe("#message { color: red; }");
    expect(view.document.activeElement).toBe(view.button);
  });

  test("preserves selection, editor scrolling, and page position", async () => {
    const view = await createPage();
    Object.defineProperty(view.page.window, "scrollY", { value: 900 });
    view.textarea.value = "#message { color: red; }";
    view.textarea.setSelectionRange(2, 5, "backward");
    view.textarea.scrollTop = 120;
    view.textarea.scrollLeft = 30;
    view.button.click();
    expect(view.textarea.selectionStart).toBe(2);
    expect(view.textarea.selectionEnd).toBe(5);
    expect(view.textarea.selectionDirection).toBe("backward");
    expect(view.textarea.scrollTop).toBe(120);
    expect(view.textarea.scrollLeft).toBe(30);
    view.textarea.setSelectionRange(1, 4);
    view.close.click();
    expect(view.textarea.selectionStart).toBe(1);
    expect(view.textarea.selectionEnd).toBe(4);
    expect(view.textarea.scrollTop).toBe(120);
    expect(view.textarea.scrollLeft).toBe(30);
    expect(view.page.window.scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 900,
      behavior: "instant"
    });
  });

  test("keeps the background inert and restores its previous state", async () => {
    const view = await createPage();
    const layout = view.document.querySelector<HTMLElement>(".options-page-layout")!;
    const footer = view.document.body.lastElementChild as HTMLElement;
    footer.inert = true;
    view.button.click();
    expect(layout.inert).toBe(true);
    expect(view.document.getElementById("toaster-wrapper")!.inert).not.toBe(true);
    view.close.click();
    expect(layout.inert).not.toBe(true);
    expect(footer.inert).toBe(true);
    view.button.click();
    view.close.click();
    expect(view.overlay.hidden).toBe(true);
  });

  test("closes with Escape without discarding changes and cycles keyboard focus", async () => {
    const view = await createPage();
    view.button.click();
    view.textarea.dispatchEvent(
      new view.page.window.KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true
      })
    );
    expect(view.document.activeElement).toBe(view.close);
    view.close.dispatchEvent(
      new view.page.window.KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true
      })
    );
    expect(view.document.activeElement).toBe(view.textarea);
    view.textarea.value = "edited CSS";
    view.textarea.dispatchEvent(
      new view.page.window.KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true
      })
    );
    expect(view.overlay.hidden).toBe(true);
    expect(view.textarea.value).toBe("edited CSS");
  });

  test("saves through Ctrl/Cmd+S while expanded or inline, without saving on close", async () => {
    const view = await createPage();
    const save = mock(() => {});
    Object.assign(view.page.window, {
      saveConfig: save,
      saveAndExportConfig: mock(() => {}),
      importConfigAndSave: mock(() => {})
    });
    view.page.window.eval(
      new Bun.Transpiler({ loader: "ts" }).transformSync(
        (await Bun.file("src/options/scripts/keybinds.ts").text())
          .replace(/^import .*;\n/gm, "")
          .replace("export const ", "const ")
      ) + "\nlistenToKeys();"
    );
    for (const expanded of [true, false]) {
      if (expanded) view.button.click();
      for (const modifier of [{ ctrlKey: true }, { metaKey: true }]) {
        const event = new view.page.window.KeyboardEvent("keydown", {
          key: "s",
          bubbles: true,
          cancelable: true,
          ...modifier
        });
        view.textarea.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      }
      if (expanded) view.close.click();
    }
    expect(save).toHaveBeenCalledTimes(4);
  });

  test("restores the inline editor before the reload layout is cached", async () => {
    const view = await createPage();
    Object.defineProperty(view.page.window.performance, "getEntriesByType", { value: () => [] });
    Object.defineProperty(view.page.window, "CSS", { value: { escape: (id: string) => id } });
    await evaluate(view.page, "src/options/scripts/loading.ts");
    view.document.documentElement.classList.remove("options-initializing");
    view.button.click();
    view.page.window.dispatchEvent(new view.page.window.Event("pagehide"));
    expect(view.overlay.hidden).toBe(true);
    expect(view.page.window.sessionStorage.getItem("options-layout")).toContain(
      "#ui-custom-css-container"
    );
    expect(view.document.querySelector(".options-page-layout")!.contains(view.textarea)).toBe(true);
  });
});