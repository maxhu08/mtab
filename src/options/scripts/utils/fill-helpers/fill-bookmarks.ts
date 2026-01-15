import {
  BookmarkLineOrientation,
  BookmarksLocationFirefox,
  BookmarksType,
  Config,
  DefaultBlockyColorType,
  DefaultFaviconSource
} from "src/utils/config";
import {
  bookmarksTypeUserDefinedButtonEl,
  bookmarksTypeDefaultButtonEl,
  bookmarksTypeDefaultBlockyButtonEl,
  bookmarksTypeNoneButtonEl,
  bookmarksUserDefinedColsInputEl,
  bookmarksDefaultBlockyColsInputEl,
  bookmarksDefaultBlockyColorInputEl,
  bookmarksShowBookmarkNamesCheckboxEl,
  bookmarksLocationFirefoxMenuButtonEl,
  bookmarksLocationFirefoxToolbarButtonEl,
  bookmarksLocationFirefoxOtherButtonEl,
  bookmarksDefaultBlockyColorTypeRandomButtonEl,
  bookmarksDefaultBlockyColorTypeCustomButtonEl,
  bookmarksDefaultFaviconSourceGoogleButton,
  bookmarksDefaultFaviconSourceDuckduckgoButton,
  bookmarksNumberKeysCheckboxEl,
  bookmarksLineOrientationTopButtonEl,
  bookmarksLineOrientationBottomButtonEl,
  bookmarksLineOrientationLeftButtonEl,
  bookmarksLineOrientationRightButtonEl,
  bookmarksLineOrientationNoneButtonEl,
  bookmarksDefaultFolderIconTypeInputEl
} from "src/options/scripts/ui";
import { fillBookmarkNodeBookmarks } from "src/options/scripts/utils/fill-helpers/fill-user-defined-bookmarks";
import { handleBookmarkNodesDragging } from "src/options/scripts/utils/bookmarks/handle-bookmark-ui";

export const fillBookmarksInputs = (config: Config) => {
  bookmarksShowBookmarkNamesCheckboxEl.checked = config.bookmarks.showBookmarkNames;

  bookmarksDefaultBlockyColsInputEl.value = config.bookmarks.defaultBlockyCols.toString();
  bookmarksDefaultBlockyColorInputEl.value = config.bookmarks.defaultBlockyColor;

  bookmarksNumberKeysCheckboxEl.checked = config.bookmarks.numberKeys;
  bookmarksDefaultFolderIconTypeInputEl.value = config.bookmarks.defaultFolderIconType;

  // prettier-ignore
  const bookmarksTypePairs: Record<BookmarksType, () => void> = {
    "user-defined": () => {
      bookmarksUserDefinedColsInputEl.value = config.bookmarks.userDefinedCols.toString();
      bookmarksTypeUserDefinedButtonEl.click();
    },
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
  const bookmarksLocationFirefoxPairs: Record<BookmarksLocationFirefox, () => void> = {
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

  // must go before fill function
  handleBookmarkNodesDragging();
  fillBookmarkNodeBookmarks(config);
};
