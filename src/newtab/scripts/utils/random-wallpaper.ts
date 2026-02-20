import { WallpaperFrequency } from "src/utils/config";
import { resolveWallpaperIndex } from "src/utils/wallpaper-rotation";

const RANDOM_WALLPAPER_QUEUE_KEY = "wallpaperRandomPicsumQueue";
const RANDOM_WALLPAPER_QUEUE_SIZE = 60;
const RANDOM_WALLPAPER_PRELOAD_AHEAD = 4;
const PICSUM_PAGE_SIZE = 100;
const PICSUM_POOL_MAX_PAGE = 100;
const PICSUM_FETCH_ATTEMPTS = 8;

type RandomWallpaperItem = {
  id: string;
  author: string;
  url: string;
};

type RandomWallpaperQueueState = {
  items: RandomWallpaperItem[];
};

export type RandomWallpaperSelection = {
  url: string;
  author: string;
  authorLink: string;
};

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

const buildPicsumUrl = (id: string) => {
  const { width, height } = getViewportSize();
  return `https://picsum.photos/id/${encodeURIComponent(id)}/${width}/${height}`;
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
      const rawState = data[RANDOM_WALLPAPER_QUEUE_KEY] as
        | {
            items?: unknown;
            seeds?: unknown;
          }
        | undefined;

      const rawItems = Array.isArray(rawState?.items) ? rawState.items : [];
      const items: RandomWallpaperItem[] = [];
      const idSet = new Set<string>();

      rawItems.forEach((item) => {
        const id =
          typeof (item as RandomWallpaperItem)?.id === "string"
            ? (item as RandomWallpaperItem).id.trim()
            : "";
        const author =
          typeof (item as RandomWallpaperItem)?.author === "string"
            ? (item as RandomWallpaperItem).author.trim()
            : "";
        const url =
          typeof (item as RandomWallpaperItem)?.url === "string"
            ? (item as RandomWallpaperItem).url.trim()
            : "";

        if (!id || idSet.has(id)) return;

        idSet.add(id);
        items.push({ id, author, url });
      });

      resolve({ items: items.slice(0, RANDOM_WALLPAPER_QUEUE_SIZE) });
    });
  });

const writeRandomWallpaperQueueState = (state: RandomWallpaperQueueState): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [RANDOM_WALLPAPER_QUEUE_KEY]: state }, () => resolve());
  });

const randomPage = () => Math.floor(Math.random() * PICSUM_POOL_MAX_PAGE) + 1;

const fetchPicsumItems = async (page: number): Promise<RandomWallpaperItem[]> => {
  try {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${PICSUM_PAGE_SIZE}`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const json = (await response.json()) as unknown;

    if (!Array.isArray(json)) return [];

    return json
      .map((item) => {
        const id =
          typeof (item as { id?: unknown }).id === "string"
            ? (item as { id: string }).id.trim()
            : "";
        const author =
          typeof (item as { author?: unknown }).author === "string"
            ? (item as { author: string }).author.trim()
            : "";
        const url =
          typeof (item as { url?: unknown }).url === "string"
            ? (item as { url: string }).url.trim()
            : "";

        if (!id) return undefined;

        return {
          id,
          author,
          url
        };
      })
      .filter((item): item is RandomWallpaperItem => !!item);
  } catch {
    return [];
  }
};

const ensureMinimumItems = async (
  currentItems: RandomWallpaperItem[],
  minSize: number
): Promise<RandomWallpaperItem[]> => {
  const items = [...currentItems];
  const idSet = new Set(items.map((item) => item.id));

  if (items.length >= minSize) {
    return items.slice(0, minSize);
  }

  for (let attempt = 0; attempt < PICSUM_FETCH_ATTEMPTS && items.length < minSize; attempt += 1) {
    const fetched = await fetchPicsumItems(randomPage());

    for (const item of fetched) {
      if (idSet.has(item.id)) continue;

      idSet.add(item.id);
      items.push(item);

      if (items.length >= minSize) {
        break;
      }
    }
  }

  return items.slice(0, minSize);
};

export const resolveRandomWallpaper = async (
  frequency: WallpaperFrequency
): Promise<RandomWallpaperSelection | undefined> => {
  const state = await readRandomWallpaperQueueState();
  const items = await ensureMinimumItems(state.items, RANDOM_WALLPAPER_QUEUE_SIZE);

  await writeRandomWallpaperQueueState({ items });

  if (items.length === 0) return undefined;

  const index = await resolveWallpaperIndex({
    rotationKey: "wallpaper-random-picsum",
    frequency,
    itemCount: items.length
  });

  if (index < 0) return undefined;

  const current = items[index];

  const nextUrls: string[] = [];

  for (let offset = 1; offset <= RANDOM_WALLPAPER_PRELOAD_AHEAD; offset += 1) {
    const next = items[(index + offset) % items.length];
    nextUrls.push(buildPicsumUrl(next.id));
  }

  preloadWallpaperUrls(nextUrls);

  return {
    url: buildPicsumUrl(current.id),
    author: current.author,
    authorLink: current.url
  };
};
