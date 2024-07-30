import { titleCustomFaviconInputEl } from "src/options/scripts/ui";
import { previewFavicon } from "src/options/scripts/utils/preview";

export const handleCustomFaviconUpload = () => {
  titleCustomFaviconInputEl.addEventListener("change", (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        chrome.storage.local.set({ userUploadedFavicon: e.target.result });
        previewFavicon(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
};
