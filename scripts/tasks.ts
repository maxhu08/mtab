import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type BrowserTarget = "chrome" | "firefox";
type TaskName = "clean" | "dev" | "build" | "package" | "rc" | "source";

const ROOT = process.cwd();
const DIST_DIR = resolve(ROOT, "dist");
const OUTPUT_DIR = resolve(ROOT, "output");
const SRC_DIR = resolve(ROOT, "src");
const ASSETS_DIR = resolve(SRC_DIR, "assets");
const STATIC_DIR = resolve(SRC_DIR, "static");
const VERSION_FILE = resolve(ROOT, "EXTENSION_VERSION.txt");

const MANIFESTS: Record<BrowserTarget, Record<string, unknown>> = {
  chrome: {
    manifest_version: 3,
    name: "mtab",
    author: "Max Hu",
    description: "a simple configurable new tab extension",
    permissions: ["storage", "unlimitedStorage", "bookmarks", "favicon"],
    background: { service_worker: "sw.js" },
    host_permissions: ["https://duckduckgo.com/*"],
    chrome_url_overrides: { newtab: "index.html" },
    icons: {
      16: "16.png",
      32: "32.png",
      48: "48.png",
      64: "64.png",
      128: "128.png"
    },
    action: {
      default_icon: {
        16: "16.png",
        32: "32.png",
        48: "48.png",
        64: "64.png",
        128: "128.png"
      },
      default_title: "mtab",
      default_popup: "popup.html"
    },
    options_page: "options.html"
  },
  firefox: {
    manifest_version: 3,
    name: "mtab",
    author: "Max Hu",
    description: "a simple configurable new tab extension",
    permissions: ["storage", "bookmarks"],
    background: { scripts: ["sw.js"] },
    host_permissions: ["https://duckduckgo.com/*"],
    chrome_url_overrides: { newtab: "index.html" },
    chrome_settings_overrides: { homepage: "index.html" },
    icons: {
      16: "16.png",
      32: "32.png",
      48: "48.png",
      64: "64.png",
      128: "128.png"
    },
    action: {
      default_icon: {
        16: "16.png",
        32: "32.png",
        48: "48.png",
        64: "64.png",
        128: "128.png"
      },
      default_title: "mtab",
      default_popup: "popup.html"
    },
    options_ui: {
      page: "options.html",
      open_in_tab: true
    },
    browser_specific_settings: {
      gecko: {
        id: "contact@maxhu.dev"
      }
    }
  }
};

async function main() {
  const [taskArg, targetArg, versionArg] = process.argv.slice(2);
  const task = parseTask(taskArg);

  if (task === "clean") {
    clean();
    return;
  }

  if (task === "source") {
    packageSource();
    return;
  }

  const target = parseTarget(targetArg);

  switch (task) {
    case "dev":
      clean();
      ensureDist();
      syncStaticFiles();
      writeManifest(target);
      runParcel("watch");
      return;
    case "build":
      clean();
      buildBundle(target);
      return;
    case "package":
      clean();
      buildBundle(target);
      packageBundle(target);
      return;
    case "rc": {
      const rcVersion = versionArg ?? (await promptForRcVersion());
      const release = parseRcVersion(rcVersion);

      clean();
      buildBundle(target, release.baseVersion);
      annotateRcBuild(release.rcVersion);
      packageBundle(target, {
        packageVersion: release.rcVersion,
        zipVersion: release.rcVersion
      });
      return;
    }
  }
}

function parseTask(value: string | undefined): TaskName {
  if (
    value === "clean" ||
    value === "dev" ||
    value === "build" ||
    value === "package" ||
    value === "rc" ||
    value === "source"
  ) {
    return value;
  }

  throw new Error(
    "Usage: bun run ./scripts/tasks.ts <clean|dev|build|package|rc|source> [chrome|firefox] [rc-version]"
  );
}

function parseTarget(value: string | undefined): BrowserTarget {
  if (value === "chrome" || value === "firefox") {
    return value;
  }

  throw new Error("Expected browser target: chrome or firefox");
}

function clean() {
  rmSync(resolve(ROOT, ".parcel-cache"), { force: true, recursive: true });
  rmSync(DIST_DIR, { force: true, recursive: true });
}

function buildBundle(target: BrowserTarget, version = readVersion()) {
  ensureDist();
  runParcel("build");
  syncStaticFiles();
  writeManifest(target, version);
}

function ensureDist() {
  mkdirSync(DIST_DIR, { recursive: true });
}

function syncStaticFiles() {
  copyDirectoryContents(ASSETS_DIR, DIST_DIR);
  copyDirectoryContents(STATIC_DIR, DIST_DIR);
}

function writeManifest(target: BrowserTarget, version = readVersion()) {
  const manifest = {
    ...MANIFESTS[target],
    version
  };

  writeFileSync(resolve(DIST_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

function readVersion() {
  return readFileSync(VERSION_FILE, "utf8").trim();
}

function runParcel(mode: "build" | "watch") {
  const entries = getHtmlEntries();
  const bunExecutable = process.execPath;
  const args = ["x", "parcel"];

  if (mode === "build") {
    args.push("build", ...entries, "--no-source-maps", "--no-scope-hoist");
    runCommand(bunExecutable, args);
    return;
  }

  args.push("watch", ...entries);
  const child = spawn(bunExecutable, args, { cwd: ROOT, stdio: "inherit" });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

function getHtmlEntries() {
  const entries = collectHtmlEntries(SRC_DIR)
    .map((file) => join("src", file))
    .sort();

  if (entries.length === 0) {
    throw new Error("No HTML entrypoints found under src/");
  }

  return entries;
}

function packageBundle(
  target: BrowserTarget,
  options: {
    packageVersion?: string;
    zipVersion?: string;
    dirSuffix?: string;
    zipSuffix?: string;
  } = {}
) {
  const packageVersion = options.packageVersion ?? readVersion();
  const zipVersion = options.zipVersion ?? packageVersion;
  const dirSuffix = options.dirSuffix ?? "";
  const zipSuffix = options.zipSuffix ?? dirSuffix;
  const packageDirName = `mtab-v${packageVersion}-${target}${dirSuffix}`;
  const packageZipName = `mtab-v${zipVersion}-${target}${zipSuffix}.zip`;
  const packageDir = resolve(OUTPUT_DIR, packageDirName);
  const zipPath = resolve(OUTPUT_DIR, packageZipName);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  rmSync(packageDir, { force: true, recursive: true });
  rmSync(zipPath, { force: true });
  mkdirSync(packageDir, { recursive: true });
  copyDirectoryContents(DIST_DIR, packageDir);

  if (!existsSync(resolve(packageDir, "index.html"))) {
    throw new Error("Missing expected build output: dist/index.html");
  }

  runCommand("zip", ["-r", "-FS", zipPath, "."], packageDir);

  console.log(`Build complete\nExtension: ${packageDir}\nZip: ${zipPath}`);
}

function packageSource() {
  const version = readVersion();
  const zipPath = resolve(OUTPUT_DIR, `mtab-v${version}-source.zip`);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  rmSync(zipPath, { force: true });

  runCommand("zip", [
    "-r",
    "-FS",
    zipPath,
    ".",
    "-x",
    "*.git*",
    "-x",
    "node_modules/*",
    "-x",
    "assets/*",
    "-x",
    ".parcel-cache/*",
    "-x",
    "dist/*",
    "-x",
    "output/*",
    "-x",
    ".husky/*"
  ]);

  console.log(`Source package complete\nZip: ${zipPath}`);
}

function runCommand(command: string, args: string[], cwd = ROOT) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function copyDirectoryContents(sourceDir: string, destinationDir: string) {
  for (const entry of readdirSync(sourceDir)) {
    cpSync(resolve(sourceDir, entry), resolve(destinationDir, entry), {
      force: true,
      recursive: true
    });
  }
}

function collectHtmlEntries(directory: string, baseDir = directory): string[] {
  const entries: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      entries.push(...collectHtmlEntries(absolutePath, baseDir));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      entries.push(absolutePath.slice(baseDir.length + 1));
    }
  }

  return entries;
}

function annotateRcBuild(rcVersion: string) {
  annotateHtml(resolve(DIST_DIR, "index.html"), {
    "rc-version-info": rcVersion,
    "extension-version": rcVersion
  });
  annotateHtml(resolve(DIST_DIR, "options.html"), {
    "rc-version-info": rcVersion
  });
}

function annotateHtml(filePath: string, attributes: Record<string, string>) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing expected build output: ${filePath}`);
  }

  const file = readFileSync(filePath, "utf8");
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  const updatedFile = file.replace(/<html\b([^>]*)>/, `<html$1 ${attributesString}>`);

  if (updatedFile === file) {
    throw new Error(`Failed to annotate HTML root in ${filePath}`);
  }

  writeFileSync(filePath, updatedFile);
}

async function promptForRcVersion() {
  const rl = createInterface({ input, output });

  try {
    return await rl.question("Enter release candidate version (example: 1.10.8-rc1): ");
  } finally {
    rl.close();
  }
}

function parseRcVersion(value: string) {
  const rcVersion = value.trim();
  const match = /^([0-9]+\.[0-9]+\.[0-9]+)-rc([0-9A-Za-z.-]*)$/.exec(rcVersion);

  if (!match) {
    throw new Error("Invalid RC version. Expected format like 1.10.8-rc1.");
  }

  return {
    baseVersion: match[1],
    rcVersion
  };
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
