import {
  AnimationInitialType,
  BookmarkLineOrientation,
  BookmarkNode,
  BookmarkNodeFolder,
  BookmarkTiming,
  Config,
  UIStyle
} from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import { handleAnimation } from "src/newtab/scripts/utils/animations/handle-animation";
import { getBookmarkIconDetails } from "src/newtab/scripts/utils/bookmarks/bookmark-icon";
import { openBookmark } from "src/newtab/scripts/utils/bookmarks/open-bookmark";
import { openFolder } from "src/newtab/scripts/utils/bookmarks/open-folder";
import { focusElementBorder, unfocusElementBorder } from "src/newtab/scripts/utils/focus-utils";
import { getTabKeyPressed } from "src/newtab/scripts/utils/tab-key-pressed";
import { genid } from "src/utils/genid";

type RenderedNode = {
  uuid: string;
  buttonEl: HTMLButtonElement;
  borderEl: HTMLDivElement;
};

type RenderedBackButton = {
  buttonEl: HTMLButtonElement;
  borderEl: HTMLDivElement;
};

type FolderMeta = {
  node: BookmarkNodeFolder;
  parentFolderUUID: string;
  folderAreaEl: HTMLDivElement | null;
};

type RenderRuntime = {
  config: Config;
  folderMetaByUUID: Map<string, FolderMeta>;
  folderAreaByUUID: Map<string, HTMLDivElement>;
  paginationStateByFolderUUID: Map<string, PaginationState>;
  currentOpenFolderEl: HTMLDivElement;
};

type PaginationState = {
  enabled: boolean;
  itemsPerPage: number;
  currentPage: number;
  controlsEl: HTMLDivElement | null;
  prevButtonEl: HTMLButtonElement | null;
  nextButtonEl: HTMLButtonElement | null;
};

let renderRuntime: RenderRuntime | null = null;
let delegatedHandlersRegistered = false;

const BOOKMARK_ACTION_ATTR = "data-bookmark-action";
const BORDER_ROLE_ATTR = "data-bookmark-role";

const getFolderUUIDFromArea = (folderAreaEl: HTMLDivElement) =>
  folderAreaEl.getAttribute("data-folder-uuid") ?? "";

const getBorderEl = (buttonEl: HTMLButtonElement) =>
  buttonEl.querySelector(`[${BORDER_ROLE_ATTR}='border']`) as HTMLDivElement | null;

const sanitizePositiveInt = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;

const getBookmarkCols = (config: Config) => {
  if (config.bookmarks.type === "default-blocky") {
    return sanitizePositiveInt(config.bookmarks.defaultBlockyCols, 1);
  }

  return sanitizePositiveInt(config.bookmarks.userDefinedCols, 1);
};

const getItemsPerPage = (config: Config) => {
  if (!config.bookmarks.enablePagination) return Number.POSITIVE_INFINITY;

  const rows = sanitizePositiveInt(config.bookmarks.maxBookmarkRowsPerPage, 1);
  const cols = getBookmarkCols(config);
  return rows * cols;
};

const handleBookmarkAction = (actionButtonEl: HTMLButtonElement, openInNewTab: boolean) => {
  if (!renderRuntime) return;

  const action = actionButtonEl.getAttribute("data-bookmark-action");

  if (action === "bookmark") {
    const url = actionButtonEl.getAttribute("data-bookmark-url");
    if (!url) return;

    openBookmark(
      url,
      renderRuntime.config.animations.enabled,
      renderRuntime.config.animations.bookmarkType,
      openInNewTab
    );
    return;
  }

  if (action === "folder") {
    const folderUUID = actionButtonEl.getAttribute("data-folder-uuid");
    if (!folderUUID) return;

    openFolderByUUID(folderUUID);
    return;
  }

  if (action === "back") {
    const parentFolderUUID = actionButtonEl.getAttribute("data-parent-folder-uuid");
    if (!parentFolderUUID) return;

    openParentFolder(parentFolderUUID);
  }
};

const ensureDelegatedHandlers = () => {
  if (delegatedHandlersRegistered) return;

  bookmarksContainerEl.addEventListener("mouseup", (e) => {
    if (!renderRuntime) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const actionButtonEl = target.closest(
      `button[${BOOKMARK_ACTION_ATTR}]`
    ) as HTMLButtonElement | null;
    if (!actionButtonEl) return;

    if (e.button !== 0 && e.button !== 1) return;
    handleBookmarkAction(actionButtonEl, e.ctrlKey || e.metaKey || e.button === 1);
  });

  bookmarksContainerEl.addEventListener("keydown", (e) => {
    if (!renderRuntime) return;
    if (e.key !== "Enter") return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const actionButtonEl = target.closest(
      `button[${BOOKMARK_ACTION_ATTR}]`
    ) as HTMLButtonElement | null;
    if (!actionButtonEl) return;

    handleBookmarkAction(actionButtonEl, e.ctrlKey || e.metaKey);
  });

  bookmarksContainerEl.addEventListener(
    "focusin",
    (e) => {
      if (!renderRuntime) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const actionButtonEl = target.closest(
        `button[${BOOKMARK_ACTION_ATTR}]`
      ) as HTMLButtonElement | null;
      if (!actionButtonEl) return;

      const borderEl = getBorderEl(actionButtonEl);
      if (!borderEl) return;

      if (getTabKeyPressed()) {
        focusElementBorder(borderEl, renderRuntime.config.search.focusedBorderColor, e);
      }
    },
    true
  );

  bookmarksContainerEl.addEventListener(
    "focusout",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const actionButtonEl = target.closest(
        `button[${BOOKMARK_ACTION_ATTR}]`
      ) as HTMLButtonElement | null;
      if (!actionButtonEl) return;

      const borderEl = getBorderEl(actionButtonEl);
      if (!borderEl) return;

      unfocusElementBorder(borderEl);
    },
    true
  );

  delegatedHandlersRegistered = true;
};

const openParentFolder = (parentFolderUUID: string) => {
  if (!renderRuntime) return;

  const openFolderAreaEl = renderRuntime.folderAreaByUUID.get(parentFolderUUID);
  if (!openFolderAreaEl) return;

  openFolder(renderRuntime.currentOpenFolderEl, openFolderAreaEl);
  renderRuntime.currentOpenFolderEl = openFolderAreaEl;
};

const openFolderByUUID = (folderUUID: string) => {
  if (!renderRuntime) return;

  const meta = renderRuntime.folderMetaByUUID.get(folderUUID);
  if (!meta) return;

  if (!meta.folderAreaEl) {
    const folderAreaEl = createFolderArea(folderUUID);
    const folderActionsAreaEl = folderAreaEl.children[1] as HTMLDivElement;

    renderRuntime.folderAreaByUUID.set(folderUUID, folderAreaEl);
    meta.folderAreaEl = folderAreaEl;

    if (meta.node.contents.length > 0) {
      renderBookmarkNodes(meta.node.contents, folderAreaEl, false, renderRuntime.config);
    }

    const backRendered = addFolderBackButton(
      folderActionsAreaEl,
      folderUUID,
      renderRuntime.config.ui.style,
      false,
      renderRuntime.config.animations.initialType,
      0,
      renderRuntime.config.message.textColor
    );

    initializeRenderedButton(backRendered.borderEl);
    backRendered.buttonEl.setAttribute("data-bookmark-action", "back");
    backRendered.buttonEl.setAttribute("data-parent-folder-uuid", meta.parentFolderUUID);
    applyPagination(folderAreaEl, renderRuntime.config);

    const folderFrag = document.createDocumentFragment();
    folderFrag.appendChild(folderAreaEl);
    bookmarksContainerEl.appendChild(folderFrag);
  }

  const targetFolderAreaEl = meta.folderAreaEl;
  if (!targetFolderAreaEl) return;

  openFolder(renderRuntime.currentOpenFolderEl, targetFolderAreaEl);
  renderRuntime.currentOpenFolderEl = targetFolderAreaEl;
};

const initializeRenderedButton = (borderEl: HTMLDivElement) => {
  borderEl.setAttribute("data-bookmark-role", "border");
};

export const initBookmarkRenderRuntime = (rootFolderAreaEl: HTMLDivElement, config: Config) => {
  ensureDelegatedHandlers();

  const rootFolderUUID = getFolderUUIDFromArea(rootFolderAreaEl);

  renderRuntime = {
    config,
    folderMetaByUUID: new Map(),
    folderAreaByUUID: new Map([[rootFolderUUID, rootFolderAreaEl]]),
    paginationStateByFolderUUID: new Map(),
    currentOpenFolderEl: rootFolderAreaEl
  };
};

const updatePaginationControls = (
  folderActionsAreaEl: HTMLDivElement,
  totalPages: number,
  paginationState: PaginationState
) => {
  if (!paginationState.controlsEl) return;
  if (!paginationState.prevButtonEl || !paginationState.nextButtonEl) return;

  const backButtonEl = folderActionsAreaEl.querySelector(
    "button[data-bookmark-action='back']"
  ) as HTMLButtonElement | null;

  if (totalPages <= 1) {
    if (backButtonEl && backButtonEl.parentElement === paginationState.controlsEl) {
      folderActionsAreaEl.appendChild(backButtonEl);
    }
    paginationState.controlsEl.style.display = "none";
    return;
  }

  const atStart = paginationState.currentPage <= 1;
  const atEnd = paginationState.currentPage >= totalPages;
  const showPrev = !atStart;
  const showNext = !atEnd;

  const leftSlotEl = document.createElement("div");
  leftSlotEl.className = "grid place-items-center";
  leftSlotEl.appendChild(showPrev ? paginationState.prevButtonEl : createPaginationSpacer());

  const centerSlotEl = document.createElement("div");
  centerSlotEl.className = "grid place-items-center";
  centerSlotEl.appendChild(backButtonEl ?? createPaginationSpacer());

  const rightSlotEl = document.createElement("div");
  rightSlotEl.className = "grid place-items-center";
  rightSlotEl.appendChild(showNext ? paginationState.nextButtonEl : createPaginationSpacer());

  paginationState.controlsEl.className =
    "mt-2 grid grid-cols-[max-content_max-content_max-content] items-center justify-center gap-2";
  paginationState.controlsEl.replaceChildren(leftSlotEl, centerSlotEl, rightSlotEl);
  paginationState.controlsEl.style.display = "grid";

  folderActionsAreaEl.appendChild(paginationState.controlsEl);
};

const createPaginationSpacer = () => {
  const spacerEl = document.createElement("div");
  spacerEl.className = "h-9 md:h-12 aspect-square invisible pointer-events-none";
  return spacerEl;
};

const createPaginationNavButton = (
  uiStyle: UIStyle,
  messageTextColor: string,
  iconType: string,
  onClick: () => void
) => {
  const buttonEl = document.createElement("button");
  buttonEl.type = "button";
  buttonEl.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect " : ""}corner-style h-9 md:h-12 aspect-square overflow-hidden outline-none`;
  buttonEl.addEventListener("click", onClick);

  const borderDiv = document.createElement("div");
  borderDiv.className =
    "absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style";

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20";

  const iconWrapper = document.createElement("div");
  iconWrapper.className = "grid h-full w-full place-items-center text-xl md:text-2xl";
  iconWrapper.style.color = messageTextColor;

  const iconEl = document.createElement("i");
  iconEl.className = iconType;
  iconWrapper.appendChild(iconEl);

  buttonEl.appendChild(borderDiv);
  buttonEl.appendChild(hoverDiv);
  buttonEl.appendChild(iconWrapper);

  return buttonEl;
};

const buildPaginationControls = (
  folderActionsAreaEl: HTMLDivElement,
  paginationState: PaginationState,
  uiStyle: UIStyle,
  messageTextColor: string,
  updatePage: (nextPage: number) => void
) => {
  const controlsEl = document.createElement("div");
  controlsEl.className = "mt-2 grid gap-2 place-items-center";

  const prevButtonEl = createPaginationNavButton(
    uiStyle,
    messageTextColor,
    "ri-arrow-left-s-line",
    () => {
      updatePage(paginationState.currentPage - 1);
    }
  );

  const nextButtonEl = createPaginationNavButton(
    uiStyle,
    messageTextColor,
    "ri-arrow-right-s-line",
    () => {
      updatePage(paginationState.currentPage + 1);
    }
  );

  controlsEl.appendChild(prevButtonEl);
  controlsEl.appendChild(nextButtonEl);
  folderActionsAreaEl.appendChild(controlsEl);

  paginationState.controlsEl = controlsEl;
  paginationState.prevButtonEl = prevButtonEl;
  paginationState.nextButtonEl = nextButtonEl;
};

const applyPagination = (folderAreaEl: HTMLDivElement, config: Config) => {
  if (!renderRuntime) return;

  const folderUUID = getFolderUUIDFromArea(folderAreaEl);
  const itemsContainerEl = folderAreaEl.children[0] as HTMLDivElement;
  const folderActionsAreaEl = folderAreaEl.children[1] as HTMLDivElement;

  let paginationState = renderRuntime.paginationStateByFolderUUID.get(folderUUID);
  if (!paginationState) {
    paginationState = {
      enabled: config.bookmarks.enablePagination,
      itemsPerPage: getItemsPerPage(config),
      currentPage: 1,
      controlsEl: null,
      prevButtonEl: null,
      nextButtonEl: null
    };
    renderRuntime.paginationStateByFolderUUID.set(folderUUID, paginationState);
  }

  paginationState.enabled = config.bookmarks.enablePagination;
  paginationState.itemsPerPage = getItemsPerPage(config);

  const itemButtonEls = Array.from(itemsContainerEl.children) as HTMLButtonElement[];
  if (!paginationState.enabled || itemButtonEls.length === 0) {
    itemButtonEls.forEach((buttonEl) => buttonEl.classList.remove("hidden"));
    if (paginationState.controlsEl) {
      const backButtonEl = folderActionsAreaEl.querySelector(
        "button[data-bookmark-action='back']"
      ) as HTMLButtonElement | null;
      if (backButtonEl && backButtonEl.parentElement === paginationState.controlsEl) {
        folderActionsAreaEl.appendChild(backButtonEl);
      }
      paginationState.controlsEl.style.display = "none";
    }
    paginationState.currentPage = 1;
    return;
  }

  const totalPages = Math.max(1, Math.ceil(itemButtonEls.length / paginationState.itemsPerPage));
  paginationState.currentPage = Math.min(paginationState.currentPage, totalPages);

  const applyPage = () => {
    if (!paginationState) return;

    const start = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const end = start + paginationState.itemsPerPage;

    itemButtonEls.forEach((buttonEl, index) => {
      if (index >= start && index < end) {
        buttonEl.classList.remove("hidden");
      } else {
        buttonEl.classList.add("hidden");
      }
    });

    updatePaginationControls(folderActionsAreaEl, totalPages, paginationState);
  };

  if (!paginationState.controlsEl) {
    buildPaginationControls(
      folderActionsAreaEl,
      paginationState,
      config.ui.style,
      config.message.textColor,
      (nextPage) => {
        paginationState!.currentPage = Math.min(Math.max(1, nextPage), totalPages);
        applyPage();
      }
    );
  }

  applyPage();
};

export const getOpenFolderVisibleBookmarkButtons = () => {
  const currentFolderAreaEl = bookmarksContainerEl.querySelector(
    '[folder-state="open"]'
  ) as HTMLDivElement | null;
  if (!currentFolderAreaEl) return [] as HTMLButtonElement[];

  const itemsContainerEl = currentFolderAreaEl.children[0] as HTMLDivElement;
  return Array.from(itemsContainerEl.children).filter(
    (child) => !child.classList.contains("hidden")
  ) as HTMLButtonElement[];
};

export const navigateOpenFolderPagination = (direction: "prev" | "next") => {
  if (!renderRuntime) return false;
  if (!renderRuntime.config.bookmarks.enablePagination) return false;

  const folderAreaEl = renderRuntime.currentOpenFolderEl;
  const folderUUID = getFolderUUIDFromArea(folderAreaEl);
  const paginationState = renderRuntime.paginationStateByFolderUUID.get(folderUUID);
  if (!paginationState || !paginationState.enabled) return false;

  const itemsContainerEl = folderAreaEl.children[0] as HTMLDivElement;
  const totalItems = itemsContainerEl.children.length;
  if (totalItems === 0 || !Number.isFinite(paginationState.itemsPerPage)) return false;

  const totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
  if (totalPages <= 1) return false;

  const targetPage =
    direction === "prev"
      ? Math.max(1, paginationState.currentPage - 1)
      : Math.min(totalPages, paginationState.currentPage + 1);

  if (targetPage === paginationState.currentPage) return false;

  paginationState.currentPage = targetPage;
  applyPagination(folderAreaEl, renderRuntime.config);
  return true;
};

export const renderBookmarkNodes = (
  bookmarkNodes: BookmarkNode[],
  folderAreaEl: HTMLDivElement,
  withAnimations: boolean,
  config: Config
) => {
  if (!renderRuntime) {
    initBookmarkRenderRuntime(folderAreaEl, config);
  }

  const uiStyle = config.ui.style;

  const bookmarkTiming = config.animations.bookmarkTiming;
  const showBookmarkNames = config.bookmarks.showBookmarkNames;
  const messageTextColor = config.message.textColor;
  const animationsInitialType = config.animations.initialType;
  const bookmarksLineOrientation = config.bookmarks.lineOrientation;

  const bookmarksDefaultIconColor = config.bookmarks.defaultIconColor;
  const bookmarksDefaultFolderIconType = config.bookmarks.defaultFolderIconType;

  const itemsContainerEl = folderAreaEl.children[0] as HTMLDivElement;
  const parentFolderUUID = getFolderUUIDFromArea(folderAreaEl);

  const frag = document.createDocumentFragment();
  const nodesToAnimate: HTMLButtonElement[] = [];

  bookmarkNodes.forEach((bookmarkNode, index) => {
    if (bookmarkNode.type === "bookmark") {
      const rendered = renderBlockBookmark(
        bookmarkTiming,
        bookmarkNodes.length,
        index,
        bookmarkNode.name,
        bookmarkNode.color,
        bookmarkNode.iconType,
        bookmarkNode.iconColor,
        bookmarksDefaultIconColor,
        bookmarkNode.fill ?? "",
        uiStyle,
        bookmarksLineOrientation,
        showBookmarkNames,
        messageTextColor,
        withAnimations,
        animationsInitialType
      );

      initializeRenderedButton(rendered.borderEl);
      rendered.buttonEl.setAttribute("data-bookmark-action", "bookmark");
      rendered.buttonEl.setAttribute("data-bookmark-url", bookmarkNode.url);
      if (withAnimations) nodesToAnimate.push(rendered.buttonEl);

      frag.appendChild(rendered.buttonEl);
      return;
    }

    const rendered = renderBlockFolder(
      bookmarkTiming,
      bookmarkNodes.length,
      index,
      bookmarkNode.name,
      bookmarkNode.color,
      bookmarkNode.iconType ?? bookmarksDefaultFolderIconType,
      bookmarkNode.iconColor,
      bookmarksDefaultIconColor,
      bookmarkNode.fill ?? "",
      uiStyle,
      bookmarksLineOrientation,
      showBookmarkNames,
      messageTextColor,
      withAnimations,
      animationsInitialType
    );

    initializeRenderedButton(rendered.borderEl);
    rendered.buttonEl.setAttribute("data-bookmark-action", "folder");
    rendered.buttonEl.setAttribute("data-folder-uuid", rendered.uuid);
    if (withAnimations) nodesToAnimate.push(rendered.buttonEl);

    renderRuntime?.folderMetaByUUID.set(rendered.uuid, {
      node: bookmarkNode,
      parentFolderUUID,
      folderAreaEl: null
    });

    frag.appendChild(rendered.buttonEl);
  });

  itemsContainerEl.appendChild(frag);
  applyPagination(folderAreaEl, config);
  if (withAnimations) {
    for (const buttonEl of nodesToAnimate) {
      handleAnimation(buttonEl, animationsInitialType);
    }
  }
};

export const createFolderArea = (uuid: string, state: boolean = false) => {
  const folderDiv = document.createElement("div");
  folderDiv.id = `folder-${uuid}`;
  folderDiv.setAttribute("data-folder-uuid", uuid);
  folderDiv.setAttribute("folder-state", state ? "open" : "closed");
  folderDiv.className = `w-full ${state ? "grid" : "hidden"} grid-flow-row gap-2`;

  const itemsDiv = document.createElement("div");
  itemsDiv.id = `folder-${uuid}-items`;
  itemsDiv.className = "grid gap-2 bookmarks-cols";

  const actionsDiv = document.createElement("div");
  actionsDiv.id = `folder-${uuid}-actions`;
  actionsDiv.className = "w-full grid place-items-center";

  folderDiv.appendChild(itemsDiv);
  folderDiv.appendChild(actionsDiv);

  return folderDiv as HTMLDivElement;
};

const calcDelay = (timing: BookmarkTiming, length: number, index: number) => {
  if (timing === "uniform") return 150;
  if (timing === "left") return (index + 2) * 50;
  if (timing === "right") return (length + 2 - index) * 50;
  return 0;
};

const orientationClasses: Record<BookmarkLineOrientation, string> = {
  top: "w-full h-1 top-0 left-0",
  bottom: "w-full h-1 bottom-0 left-0",
  left: "h-full w-1 left-0 top-0",
  right: "h-full w-1 right-0 top-0",
  none: "hidden"
};

export const renderBlockBookmark = (
  bookmarkTiming: BookmarkTiming,
  bookmarksLength: number,
  bookmarkIndex: number,
  bookmarkName: string,
  bookmarkColor: string,
  bookmarkIconType: string,
  bookmarkIconColor: string | undefined,
  bookmarksDefaultIconColor: string,
  bookmarkFill: string,
  uiStyle: UIStyle,
  lineOrientation: BookmarkLineOrientation,
  showName: boolean,
  nameTextColor: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType
): RenderedNode => {
  const delay = calcDelay(bookmarkTiming, bookmarksLength, bookmarkIndex);

  const { iconHTML, iconSizeClass, iconColor } = getBookmarkIconDetails(
    bookmarkIconType,
    bookmarkIconColor,
    bookmarksDefaultIconColor
  );

  const uuid = genid();

  const button = document.createElement("button");
  button.id = `bookmark-node-${uuid}`;
  button.setAttribute("node-type", "bookmark");
  button.className = `relative duration-[250ms] ease-out ${bookmarkFill.length === 0 ? "bg-foreground " : ""}cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0` : ""} outline-none`;
  if (bookmarkFill.length > 0) button.style.backgroundColor = bookmarkFill;
  if (animationsEnabled) button.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-node-${uuid}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";

  const colorBar = document.createElement("div");
  colorBar.style.backgroundColor = bookmarkColor;
  colorBar.className = `absolute ${orientationClasses[lineOrientation]}`;

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-node-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  iconDiv.style.color = iconColor;
  iconDiv.innerHTML = iconHTML;

  let nameSpan: HTMLSpanElement | null = null;
  if (showName) {
    nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = bookmarkName;
  }

  button.appendChild(borderDiv);
  button.appendChild(colorBar);
  button.appendChild(hoverDiv);
  gridDiv.appendChild(iconDiv);
  if (nameSpan) gridDiv.appendChild(nameSpan);
  button.appendChild(gridDiv);

  return { uuid, buttonEl: button, borderEl: borderDiv };
};

export const renderBlockFolder = (
  bookmarkTiming: BookmarkTiming,
  nodesLength: number,
  nodeIndex: number,
  folderName: string,
  folderColor: string,
  folderIconType: string,
  folderIconColor: string | undefined,
  bookmarksDefaultIconColor: string,
  folderFill: string,
  uiStyle: UIStyle,
  lineOrientation: BookmarkLineOrientation,
  showName: boolean,
  nameTextColor: string,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType
): RenderedNode => {
  const delay = calcDelay(bookmarkTiming, nodesLength, nodeIndex);

  const { iconHTML, iconSizeClass, iconColor } = getBookmarkIconDetails(
    folderIconType,
    folderIconColor,
    bookmarksDefaultIconColor
  );

  const uuid = genid();

  const button = document.createElement("button");
  button.id = `bookmark-node-${uuid}`;
  button.setAttribute("node-type", "folder");
  button.className = `relative duration-[250ms] ease-out ${folderFill.length === 0 ? "bg-foreground " : ""}cursor-pointer ${uiStyle === "glass" ? "glass-effect" : ""} corner-style h-bookmark overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 ` : ""}outline-none`;
  if (folderFill.length > 0) button.style.backgroundColor = folderFill;
  if (animationsEnabled) button.style.animationDelay = `${delay}ms`;

  const borderDiv = document.createElement("div");
  borderDiv.id = `bookmark-node-${uuid}-border`;
  borderDiv.className = "absolute w-full h-full border-2 border-transparent corner-style";

  const colorBar = document.createElement("div");
  colorBar.style.backgroundColor = folderColor;
  colorBar.className = `absolute ${orientationClasses[lineOrientation]}`;

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute w-full h-full hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className = "p-1 md:p-2 grid place-items-center h-full";

  const iconDiv = document.createElement("div");
  iconDiv.className = `bookmark-node-icon${iconSizeClass ? " " + iconSizeClass : ""}`;
  iconDiv.style.color = iconColor;
  iconDiv.innerHTML = iconHTML;

  let nameSpan: HTMLSpanElement | null = null;
  if (showName) {
    nameSpan = document.createElement("span");
    nameSpan.className =
      "visibilty-bookmark-name w-full font-message font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap";
    nameSpan.style.color = nameTextColor;
    nameSpan.textContent = folderName;
  }

  button.appendChild(borderDiv);
  button.appendChild(colorBar);
  button.appendChild(hoverDiv);
  gridDiv.appendChild(iconDiv);
  if (nameSpan) gridDiv.appendChild(nameSpan);
  button.appendChild(gridDiv);

  return { uuid, buttonEl: button, borderEl: borderDiv };
};

export const addFolderBackButton = (
  folderActionsAreaEl: HTMLDivElement,
  uuid: string,
  uiStyle: UIStyle,
  animationsEnabled: boolean,
  animationsInitialType: AnimationInitialType,
  delay: number,
  messageTextColor: string
): RenderedBackButton => {
  const backButton = document.createElement("button");
  backButton.id = `folder-back-button-${uuid}`;
  backButton.className = `relative duration-[250ms] ease-out bg-foreground cursor-pointer ${uiStyle === "glass" ? "glass-effect " : ""}corner-style h-9 md:h-12 px-1 md:px-2 overflow-hidden ${animationsEnabled ? `${animationsInitialType} opacity-0 ` : ""}outline-none`;
  if (animationsEnabled) {
    backButton.style.animationDelay = `${delay}ms`;
  }

  const borderDiv = document.createElement("div");
  borderDiv.id = `folder-back-button-${uuid}-border`;
  borderDiv.className =
    "absolute top-0 left-0 w-full h-9 md:h-12 border-2 border-transparent corner-style";

  const hoverDiv = document.createElement("div");
  hoverDiv.className = "absolute top-0 left-0 w-full h-9 md:h-12 hover:bg-white/20";

  const gridDiv = document.createElement("div");
  gridDiv.className =
    "grid grid-cols-[max-content_auto] gap-2 font-message text-base md:text-2xl w-full";
  gridDiv.style.color = messageTextColor;

  const icon = document.createElement("i");
  icon.className = "ri-arrow-left-line";

  const span = document.createElement("span");
  span.textContent = "Back";

  gridDiv.appendChild(icon);
  gridDiv.appendChild(span);

  backButton.appendChild(borderDiv);
  backButton.appendChild(hoverDiv);
  backButton.appendChild(gridDiv);

  folderActionsAreaEl.appendChild(backButton);

  return { buttonEl: backButton, borderEl: borderDiv };
};
