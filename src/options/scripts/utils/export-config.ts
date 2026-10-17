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

export const saveAndExportConfig = async () => {
  if (document.getElementById("mtab-action-dialog-overlay")) return;

  const uploads = await listUploadedWallpaperFiles();
  const mixed = await listMixedUploadedWallpaperFiles();

  if (document.getElementById("mtab-action-dialog-overlay")) return;

  const empty = !uploads.length && !mixed.length;

  await showActionDialog(t("export"), {
    variant: "export",
    description:
      t(
        "wallpapers are not included in the config because they can be too large. you can download them separately as a zip file."
      ) + (empty ? `\n\n${t("no uploaded wallpapers to download")}` : ""),
    actionText: t("download config"),
    onAction: async () => {
      try {
        const config = await saveConfig(false);
        if (!config) return;

        downloadFile(
          new Blob(
            [`MTAB_SAVE_FORMAT_v${chrome.runtime.getManifest().version}_${JSON.stringify(config)}`],
            { type: "text/plain;charset=utf-8" }
          ),
          "config.txt"
        );
      } catch {
        toast.error(t("could not export config"));
      }
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
          toast.error(t("could not export wallpapers"));
        }
      }
    }
  });
};