import { WallpaperFrequency } from "src/utils/config";
import { resolveWallpaperIndex } from "src/utils/wallpaper-rotation";

const RANDOM_WALLPAPER_QUEUE_KEY = "wallpaperRandomPicsumQueue";
const RANDOM_WALLPAPER_QUEUE_SIZE = 60;
const RANDOM_WALLPAPER_PRELOAD_AHEAD = 4;

type RandomWallpaperQueueState = {
  seeds: string[];
};

const createRandomSeed = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

const getViewportSize = () => {
  const devicePixelRatio = globalThis.devicePixelRatio || 1;
  const density = Math.max(1, Math.min(devicePixelRatio, 2));

  let width = Math.round((globalThis.screen?.width ?? 1920) * density);
  let height = Math.round((globalThis.screen?.height ?? 1080) * density);

  const ratio = width / height;

  if (ratio >= 2) width = height * 2;
  if (ratio <= 0.5) height = width * 2;

  return {
    width: Math.max(640, width),
    height: Math.max(360, height)
  };
};

const buildPicsumUrl = (seed: string) => {
  const { width, height } = getViewportSize();
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
};

const preloadWallpaperUrls = (urls: string[]) => {
  urls.forEach((url) => {
    const img = new Image();
    img.decoding = "async";
    (img as HTMLImageElement & { fetchPriority?: "low" }).fetchPriority = "low";
    img.src = url;
  });
};

const readRandomWallpaperQueueState = (): Promise<RandomWallpaperQueueState> =>
  new Promise((resolve) => {
    chrome.storage.local.get([RANDOM_WALLPAPER_QUEUE_KEY], (data) => {
      const rawState = data[RANDOM_WALLPAPER_QUEUE_KEY] as RandomWallpaperQueueState | undefined;
      const parsedSeeds = Array.isArray(rawState?.seeds)
        ? rawState.seeds.filter(
            (seed: unknown) => typeof seed === "string" && seed.trim().length > 0
          )
        : [];
      const seeds = Array.from(new Set(parsedSeeds)).slice(0, RANDOM_WALLPAPER_QUEUE_SIZE);

      resolve({ seeds });
    });
  });

const writeRandomWallpaperQueueState = (state: RandomWallpaperQueueState): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [RANDOM_WALLPAPER_QUEUE_KEY]: state }, () => resolve());
  });

const ensureMinimumSeeds = (seeds: string[], minSize: number) => {
  const nextSeeds = [...seeds];
  const existing = new Set(nextSeeds);

  while (nextSeeds.length < minSize) {
    const seed = createRandomSeed();
    if (existing.has(seed)) continue;
    existing.add(seed);
    nextSeeds.push(seed);
  }

  return nextSeeds;
};

export const resolveRandomWallpaperUrl = async (frequency: WallpaperFrequency) => {
  const state = await readRandomWallpaperQueueState();
  const seeds = ensureMinimumSeeds(state.seeds, RANDOM_WALLPAPER_QUEUE_SIZE);

  await writeRandomWallpaperQueueState({ seeds });

  const index = await resolveWallpaperIndex({
    rotationKey: "wallpaper-random-picsum",
    frequency,
    itemCount: seeds.length
  });

  if (index < 0) return undefined;

  const currentSeed = seeds[index];
  const currentUrl = buildPicsumUrl(currentSeed);

  const nextUrls: string[] = [];

  for (let offset = 1; offset <= RANDOM_WALLPAPER_PRELOAD_AHEAD; offset += 1) {
    const nextSeed = seeds[(index + offset) % seeds.length];
    nextUrls.push(buildPicsumUrl(nextSeed));
  }

  preloadWallpaperUrls(nextUrls);

  return currentUrl;
};
