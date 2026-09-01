import {
  BookmarkLineOrientation,
  BookmarksLocationChromium,
  BookmarksLocationFirefox,
  BookmarksType,
  Config,
  DefaultBlockyColorType,
  DefaultFaviconSource
} from "~/src/utils/config";
import {
  bookmarksTypeUserDefinedButtonEl,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksUserDefinedColsInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksDefaultBlockyColorInputEl,
  bookmarksShowBookmarkNamesCheckboxEl,
  bookmarksLocationChromiumRootButtonEl,
  bookmarksLocationChromiumBookmarksBarButtonEl,
  bookmarksLocationChromiumOtherButtonEl,
  bookmarksLocationChromiumMobileButtonEl,
  bookmarksLocationFirefoxRootButtonEl,
  bookmarksLocationFirefoxMenuButtonEl,
  bookmarksLocationFirefoxToolbarButtonEl,
  bookmarksLocationFirefoxOtherButtonEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultFaviconSourceGoogleButton,
  bookmarksDefaultFaviconSourceDuckduckgoButton,
  bookmarksNumberKeysCheckboxEl,
  bookmarksEnablePaginationCheckboxEl,
  bookmarksMaxBookmarkRowsPerPageInputEl,
  bookmarksLineOrientationTopButtonEl,
  bookmarksLineOrientationBottomButtonEl,
  bookmarksLineOrientationLeftButtonEl,
  bookmarksLineOrientationRightButtonEl,
  bookmarksLineOrientationNoneButtonEl,
  bookmarksDefaultFolderIconTypeInputEl,
  bookmarksDefaultIconColorInputEl
} from "~/src/options/scripts/ui";
import { fillBookmarkNodeBookmarks } from "~/src/options/scripts/utils/fill-helpers/fill-user-defined-bookmarks";

export const fillBookmarksInputs = (config: Config) => {
  bookmarksShowBookmarkNamesCheckboxEl.checked = config.bookmarks.showBookmarkNames;

  bookmarksUserDefinedColsInputEl.value = config.bookmarks.userDefinedCols.toString();
  bookmarksDefaultBlockyColsInputEl.value = config.bookmarks.defaultBlockyCols.toString();
  bookmarksDefaultBlockyColorInputEl.value = config.bookmarks.defaultBlockyColor;

  bookmarksNumberKeysCheckboxEl.checked = config.bookmarks.numberKeys;
  bookmarksEnablePaginationCheckboxEl.checked = config.bookmarks.enablePagination;
  bookmarksMaxBookmarkRowsPerPageInputEl.value = config.bookmarks.maxBookmarkRowsPerPage.toString();
  bookmarksEnablePaginationCheckboxEl.dispatchEvent(new Event("change"));
  bookmarksDefaultIconColorInputEl.value = config.bookmarks.defaultIconColor;
  bookmarksDefaultFolderIconTypeInputEl.value = config.bookmarks.defaultFolderIconType;

  // prettier-ignore
  const bookmarksTypePairs: Record<BookmarksType, () => void> = {
    "user-defined": () => bookmarksTypeUserDefinedButtonEl.click(),
    "default": () => bookmarksTypeDefaultButtonEl.click(),
    "default-blocky": () => bookmarksTypeDefaultBlockyButtonEl.click(),
    "none": () => bookmarksTypeNoneButtonEl.click()
  };

  bookmarksTypePairs[config.bookmarks.type]();

  // prettier-ignore
  const bookmarkLineOrientationPairs: Record<BookmarkLineOrientation, () => void> = {
    "top": () => bookmarksLineOrientationTopButtonEl.click(),
    "bottom": () => bookmarksLineOrientationBottomButtonEl.click(),
    "left": () => bookmarksLineOrientationLeftButtonEl.click(),
    "right": () => bookmarksLineOrientationRightButtonEl.click(),
    "none": () => bookmarksLineOrientationNoneButtonEl.click()
  };

  bookmarkLineOrientationPairs[config.bookmarks.lineOrientation]();

  // prettier-ignore
  const bookmarksDefaultBlockyColorTypePairs: Record<DefaultBlockyColorType, () => void> = {
    "random": () => bookmarksDefaultBlockyColorTypeRandomButtonEl.click(),
    "custom": () => bookmarksDefaultBlockyColorTypeCustomButtonEl.click(),
  };

  bookmarksDefaultBlockyColorTypePairs[config.bookmarks.defaultBlockyColorType]();

  // prettier-ignore
  const bookmarksLocationChromiumPairs: Record<BookmarksLocationChromium, () => void> = {
    "root": () => bookmarksLocationChromiumRootButtonEl.click(),
    "bookmarks-bar": () => bookmarksLocationChromiumBookmarksBarButtonEl.click(),
    "other": () => bookmarksLocationChromiumOtherButtonEl.click(),
    "mobile": () => bookmarksLocationChromiumMobileButtonEl.click()
  };

  bookmarksLocationChromiumPairs[config.bookmarks.bookmarksLocationChromium]();

  // prettier-ignore
  const bookmarksLocationFirefoxPairs: Record<BookmarksLocationFirefox, () => void> = {
    "root": () => bookmarksLocationFirefoxRootButtonEl.click(),
    "menu": () => bookmarksLocationFirefoxMenuButtonEl.click(),
    "toolbar": () => bookmarksLocationFirefoxToolbarButtonEl.click(),
    "other": () => bookmarksLocationFirefoxOtherButtonEl.click()
  };

  bookmarksLocationFirefoxPairs[config.bookmarks.bookmarksLocationFirefox]();

  // prettier-ignore
  const bookmarksDefaultFaviconSourcePairs: Record<DefaultFaviconSource, () => void> = {
    "google": () => bookmarksDefaultFaviconSourceGoogleButton.click(),
    "duckduckgo": () => bookmarksDefaultFaviconSourceDuckduckgoButton.click(),
  };

  bookmarksDefaultFaviconSourcePairs[config.bookmarks.defaultFaviconSource]();

  fillBookmarkNodeBookmarks(config);
};