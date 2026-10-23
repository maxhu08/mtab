import { saveConfig } from "~/src/options/scripts/utils/save-config";
import { t } from "~/src/options/scripts/i18n";
import { downloadFile } from "~/src/options/scripts/utils/download-file";
import { createWallpaperArchive } from "~/src/options/scripts/utils/wallpaper-archive";
import { showActionDialog } from "~/src/options/scripts/utils/input-dialog";
import {
  getUploadedWallpaperFile,
  listUploadedWallpaperFiles
} from "~/src/utils/wallpaper-file-storage";
import {
  getMixedUploadedWallpaperFile,
  listMixedUploadedWallpaperFiles
} from "~/src/utils/mixed-wallpaper-storage";

const exportConfig = async (copy = false) => {
  try {
    const config = await saveConfig(false);
    if (!config) return;

    const text = `MTAB_SAVE_FORMAT_v${chrome.runtime.getManifest().version}_${JSON.stringify(config)}`;
    if (copy) {
      await navigator.clipboard.writeText(text);
      toast.success(t("Config saved & copied to clipboard."));
    } else {
      downloadFile(new Blob([text], { type: "text/plain;charset=utf-8" }), "config.txt");
    }
  } catch {
    toast.error(t(copy ? "Could not save config to clipboard." : "Could not export config."));
  }
};

export const saveAndExportConfig = async () => {
  if (document.getElementById("mtab-action-dialog-overlay")) return;

  const uploads = await listUploadedWallpaperFiles();
  const mixed = await listMixedUploadedWallpaperFiles();

  if (document.getElementById("mtab-action-dialog-overlay")) return;

  const empty = !uploads.length && !mixed.length;

  await showActionDialog(t("Export"), {
    variant: "export",
    description:
      t(
        "Wallpapers are not included in the config because they can be too large. You can download them separately as a ZIP file."
      ) + (empty ? `\n\n${t("No uploaded wallpapers to download.")}` : ""),
    actionText: t("download config"),
    onAction: () => exportConfig(),
    additionalAction: {
      text: t("copy to clipboard"),
      onAction: () => exportConfig(true)
    },

    secondaryAction: {
      text: t("download wallpapers"),
      disabled: empty,
      onAction: async () => {
        try {
          const files = [];

          for (const group of [
            { scope: "file-upload" as const, files: uploads, get: getUploadedWallpaperFile },
            { scope: "mixed" as const, files: mixed, get: getMixedUploadedWallpaperFile }
          ]) {
            for (const meta of group.files) {
              const file = await group.get(meta.id);
              if (!file) throw new Error("Stored wallpaper is missing");

              files.push({ name: meta.name, file, scope: group.scope });
            }
          }

          downloadFile(await createWallpaperArchive(files), "wallpapers.zip");
        } catch {
          toast.error(t("Could not export wallpapers."));
        }
      }
    }
  });
};