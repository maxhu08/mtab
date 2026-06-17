import {
  getBookmarkNodeBookmarkData,
  getBookmarkNodeFolderData
} from "~/src/options/scripts/utils/bookmarks/get-bookmark-node-data";

export const exportBookmarkNode = async (uuid: string) => {
  const extensionVersion = chrome.runtime.getManifest().version;

  const nodeEl = document.querySelector(`[bookmark-node-uuid="${uuid}"]`) as HTMLElement | null;

  if (!nodeEl) return;

  const nodeType = nodeEl.getAttribute("node-type");
  const result =
    nodeType === "bookmark"
      ? getBookmarkNodeBookmarkData(uuid)
      : nodeType === "folder"
        ? getBookmarkNodeFolderData(uuid)
        : null;
  const prefix =
    nodeType === "bookmark"
      ? `MTAB_USER_DEFINED_BOOKMARK_FORMAT_v${extensionVersion}_`
      : nodeType === "folder"
        ? `MTAB_USER_DEFINED_FOLDER_FORMAT_v${extensionVersion}_`
        : "";

  if (!result) return;

  const formattedExport = `${prefix}${JSON.stringify(result)}`;

  await navigator.clipboard.writeText(formattedExport);

  if (nodeType === "bookmark") {
    toast.success("bookmark copied to clipboard");
  } else if (nodeType === "folder") {
    toast.success("folder and contents copied to clipboard");
  }
};