// @ts-nocheck
// based off https://github.com/JeanxPereira/sonner-js/blob/main/sonner-js/sonner.js

function getAsset(type) {
  const ICONS = {
    success: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20">
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clip-rule="evenodd"
    />
  </svg>`,
    error: `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 20 20"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fill-rule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
      clip-rule="evenodd"
    />
  </svg>`,
    info: `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fill-rule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 8 8 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clip-rule="evenodd"
    />
  </svg>`,
    warning: `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fill-rule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clip-rule="evenodd"
    />
  </svg>`
  };

  return ICONS[type] || null;
}

const VIEWPORT_OFFSET = "32px";
const VISIBLE_TOASTS_AMOUNT = 3;
const GAP = 14;
const TOAST_LIFETIME = 4000;
const TIME_BEFORE_UNMOUNT = 200;
const TOAST_WIDTH = 300;
const DEFAULT_POSITION = "bottom-right";

const __actionHandlers = new Map();

const TOAST_BASE_CLASSES = ["!bg-neutral-900", "!border-2"];

function isAllowedType(type) {
  return type === "success" || type === "info" || type === "warning" || type === "error";
}

function typeToBorderClass(type) {
  if (type === "success") return "!border-emerald-500";
  if (type === "info") return "!border-sky-500";
  if (type === "warning") return "!border-orange-500";
  return "!border-rose-600";
}

function typeToTextClass(type) {
  if (type === "success") return "!text-emerald-500";
  if (type === "info") return "!text-sky-500";
  if (type === "warning") return "!text-orange-500";
  return "!text-rose-600";
}

function basicToast(content, { description = "", type, action } = {}) {
  const wrapper = document.querySelector("#toaster-wrapper");
  if (!wrapper) throw new Error("No wrapper element found, please follow documentation");
  if (!document.getElementById("toaster-list")) renderToaster();

  updatePosition();
  updateRichColors();

  const t = isAllowedType(type) ? type : "info";
  const { toast: toastEl } = createToast(content, { description, type: t, action });
  return toastEl;
}

function renderToaster() {
  const el = document.querySelector("#toaster-wrapper");
  const ol = document.createElement("ol");
  el.append(ol);

  const [y, x] = getPositionAttributes(el, DEFAULT_POSITION);
  const richColors = el.getAttribute("data-rich-colors") === "true";
  const expand = el.getAttribute("data-expand") === "true";
  const position = el.getAttribute("data-position") || DEFAULT_POSITION;

  ol.outerHTML = `
    <ol
      data-sonner-toaster="true"
      data-theme="light"
      data-x-position="${x}"
      data-y-position="${y}"
      ${richColors ? 'data-rich-colors="true"' : ""}
      ${expand ? 'data-expand="true"' : ""}
      data-position="${position}"
      id="toaster-list"
      style="--front-toast-height: 0px; --offset: ${VIEWPORT_OFFSET}; --width: ${TOAST_WIDTH}px; --gap: ${GAP}px; ${getPositionStyles(
        y,
        x
      )}">
    </ol>`;

  registerMouseOver();
  registerDelegatedClicks();
}

function getPositionStyles(y, x) {
  let styles = "";
  if (y === "top") styles += `top: ${VIEWPORT_OFFSET};`;
  else if (y === "bottom") styles += `bottom: ${VIEWPORT_OFFSET};`;

  if (x === "left") styles += `left: ${VIEWPORT_OFFSET};`;
  else if (x === "center") styles += `left: 50%; transform: translateX(-50%);`;
  else if (x === "right") styles += `right: ${VIEWPORT_OFFSET};`;

  return styles;
}

function updatePosition() {
  const list = document.getElementById("toaster-list");
  const [y, x] = getPositionAttributes(list.parentElement, DEFAULT_POSITION);

  if (x !== list.getAttribute("data-x-position") || y !== list.getAttribute("data-y-position")) {
    updateElementAttributes(list, { "data-x-position": x, "data-y-position": y });
    Array.from(list.children).forEach((el) =>
      updateElementAttributes(el, { "data-x-position": x, "data-y-position": y })
    );
  }
}

function updateRichColors() {
  const list = document.getElementById("toaster-list");
  const richColors = list.parentElement.getAttribute("data-rich-colors") || "";
  if (list.getAttribute("data-rich-colors") !== richColors)
    list.setAttribute("data-rich-colors", richColors);
}

function registerMouseOver() {
  const ol = document.getElementById("toaster-list");
  const expandAlways = ol.parentElement.getAttribute("data-expand") === "true";

  if (expandAlways) {
    Array.from(ol.children).forEach((el) => el.setAttribute("data-expanded", "true"));
    return;
  }

  ol.addEventListener("mouseenter", () => {
    Array.from(ol.children).forEach((el) => {
      if (el.getAttribute("data-expanded") === "true") return;
      el.setAttribute("data-expanded", "true");
      clearRemoveTimeout(el);
    });
  });

  ol.addEventListener("mouseleave", () => {
    Array.from(ol.children).forEach((el) => {
      if (el.getAttribute("data-expanded") === "false") return;
      el.setAttribute("data-expanded", "false");
      registerRemoveTimeout(el);
    });
  });
}

function registerDelegatedClicks() {
  const ol = document.getElementById("toaster-list");
  if (!ol) return;
  if (ol.getAttribute("data-delegated-clicks") === "true") return;
  ol.setAttribute("data-delegated-clicks", "true");

  ol.addEventListener("click", (e) => {
    const actionBtn =
      e.target && e.target.closest && e.target.closest('button[data-toast-action="true"]');
    if (actionBtn) {
      const actionId = actionBtn.getAttribute("data-action-id");
      const fn = actionId ? __actionHandlers.get(actionId) : null;
      if (typeof fn === "function") fn();
      const toastEl = actionBtn.closest(".toast");
      if (toastEl) removeElement(toastEl);
      return;
    }

    const toastEl = e.target && e.target.closest && e.target.closest(".toast");
    if (toastEl) removeElement(toastEl);
  });
}

function createToast(message, { description, type, action } = {}) {
  const list = document.getElementById("toaster-list");
  const expandAlways = list.parentElement.getAttribute("data-expand") === "true";
  const toastPosition = list.parentElement.getAttribute("data-position") || DEFAULT_POSITION;

  const { toast: toastEl, id } = renderToast(list, message, {
    description,
    type,
    action,
    position: toastPosition
  });

  setTimeout(() => {
    if (list.children.length > 0) {
      const el = list.children[0];
      const height = el.getBoundingClientRect().height;

      el.setAttribute("data-mounted", "true");
      el.setAttribute("data-initial-height", `${height}`);
      el.style.setProperty("--initial-height", `${height}px`);
      list.style.setProperty("--front-toast-height", `${height}px`);

      if (expandAlways) el.setAttribute("data-expanded", "true");

      refreshProperties();
      registerRemoveTimeout(el);
    }
  }, 16);

  return { toast: toastEl, id };
}

function resetUtilityClasses(toastEl) {
  toastEl.classList.remove(
    "!border-emerald-500",
    "!border-sky-500",
    "!border-orange-500",
    "!border-rose-600",
    "!text-emerald-500",
    "!text-sky-500",
    "!text-orange-500",
    "!text-rose-600"
  );
}

function applyToastClasses(toastEl, type) {
  toastEl.style.background = "";
  toastEl.style.backgroundColor = "";
  toastEl.style.border = "";
  toastEl.style.borderColor = "";
  toastEl.style.boxShadow = "none";

  TOAST_BASE_CLASSES.forEach((c) => toastEl.classList.add(c));

  resetUtilityClasses(toastEl);

  const borderClass = typeToBorderClass(type);
  const textClass = typeToTextClass(type);

  toastEl.classList.add(borderClass);

  const iconContainer = toastEl.querySelector("[data-icon]");
  if (iconContainer) iconContainer.classList.add(textClass);

  const titleEl = toastEl.querySelector("[data-title]");
  if (titleEl) titleEl.classList.add(textClass);

  const descEl = toastEl.querySelector("[data-description]");
  if (descEl) descEl.classList.add(textClass);

  const actionBtn = toastEl.querySelector('button[data-toast-action="true"]');
  if (actionBtn) actionBtn.classList.add(textClass);
}

function renderToast(list, content, { description, type, action, position } = {}) {
  const toastEl = document.createElement("li");
  const id = genid();
  const count = list.children.length;

  const t = isAllowedType(type) ? type : "info";
  const asset = getAsset(t) || "";

  const actionData = action ? registerAction(action, id) : null;
  const actionHtml = actionData ? createActionButton(actionData) : "";

  toastEl.innerHTML = `
    ${asset ? `<div data-icon="">${asset}</div>` : ""}
    <div data-content="">
      <div data-title="">${content}</div>
      ${description ? `<div data-description="">${description}</div>` : ""}
    </div>
    ${actionHtml}`;

  toastEl.classList.add("toast", "text-base");
  updateElementAttributes(toastEl, {
    "data-id": id,
    "data-type": t,
    "data-position": position || "bottom-right",
    "data-removed": "false",
    "data-mounted": "false",
    "data-front": "true",
    "data-expanded": "false",
    "data-index": "0",
    "data-y-position":
      list.getAttribute("data-y-position") || (position || "bottom-right").split("-")[0],
    "data-x-position":
      list.getAttribute("data-x-position") || (position || "bottom-right").split("-")[1],
    style: `--index: 0; --toasts-before: 0; --z-index: ${count}; --offset: 0px; --initial-height: 0px; cursor: pointer;`
  });

  list.prepend(toastEl);
  applyToastClasses(toastEl, t);

  return { toast: toastEl, id };
}

const style = document.createElement("style");
style.innerHTML = `@media(min-width:640px){#toaster-list{--width:350px!important}}@media(min-width:768px){#toaster-list{--width:500px!important}}`;

function refreshProperties() {
  const list = document.getElementById("toaster-list");

  let heightsBefore = 0;
  let removed = 0;

  Array.from(list.children).forEach((el, i) => {
    if (el.getAttribute("data-removed") === "true") {
      removed++;
      return;
    }

    const idx = i - removed;
    updateElementAttributes(el, {
      "data-index": `${idx}`,
      "data-front": idx === 0 ? "true" : "false",
      "data-visible": idx < VISIBLE_TOASTS_AMOUNT ? "true" : "false"
    });

    el.style.setProperty("--index", `${idx}`);
    el.style.setProperty("--toasts-before", `${idx}`);
    el.style.setProperty("--offset", `${GAP * idx + heightsBefore}px`);
    el.style.setProperty("--z-index", `${list.children.length - i}`);
    heightsBefore += Number(el.getAttribute("data-initial-height"));
  });
}

function registerRemoveTimeout(el) {
  const tid = setTimeout(() => removeElement(el), TOAST_LIFETIME);
  el.setAttribute("data-remove-tid", `${tid}`);
}

function clearRemoveTimeout(el) {
  const tid = el.getAttribute("data-remove-tid");
  if (tid != null) clearTimeout(+tid);
}

function removeElement(el) {
  el.setAttribute("data-removed", "true");

  const actionBtn = el.querySelector && el.querySelector('button[data-toast-action="true"]');
  const actionId = actionBtn ? actionBtn.getAttribute("data-action-id") : null;
  if (actionId) __actionHandlers.delete(actionId);

  refreshProperties();

  const tid = setTimeout(() => {
    if (el.parentElement) el.parentElement.removeChild(el);
  }, TIME_BEFORE_UNMOUNT);
  el.setAttribute("data-unmount-tid", `${tid}`);
}

function getPositionAttributes(element, defaultPosition) {
  return (element.getAttribute("data-position") || defaultPosition).split("-");
}

function updateElementAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function genid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

const toast = {
  success: (message, options = {}) => basicToast(message, { ...options, type: "success" }),
  info: (message, options = {}) => basicToast(message, { ...options, type: "info" }),
  warning: (message, options = {}) => basicToast(message, { ...options, type: "warning" }),
  error: (message, options = {}) => basicToast(message, { ...options, type: "error" })
};

window.toast = toast;

if (document && document.head && !document.getElementById("__toaster_action_style__")) {
  style.id = "__toaster_action_style__";
  document.head.appendChild(style);
}
