import { titleCustomFaviconInputEl } from "~/src/options/scripts/ui";
import { previewFavicon } from "~/src/options/scripts/utils/preview";

export const handleCustomFaviconUpload = () => {
  titleCustomFaviconInputEl.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement | null)?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        const result = loadEvent.target?.result;

        if (typeof result !== "string") {
          return;
        }

        chrome.storage.local.set({ userUploadedFavicon: result });
        previewFavicon(result);
      };
      reader.readAsDataURL(file);
    }
  });
};

export const handleCustomFaviconReset = () => {
  chrome.storage.local.set({ userUploadedFavicon: null });
  previewFavicon("");
};
