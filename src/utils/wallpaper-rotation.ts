import { WallpaperFrequency } from "~/src/utils/config";

export type DaylightPeriod = "night" | "noon" | "day" | "evening";

type WallpaperRotationEntry = {
  activeIndex: number;
  lastChangedAt: number;
  lastDaylightPeriod: DaylightPeriod;
};

type WallpaperRotationState = Record<string, WallpaperRotationEntry>;

const WALLPAPER_ROTATION_STATE_KEY = "wallpaperRotationState";

const getCurrentDaylightPeriod = (now: Date): DaylightPeriod => {
  const hours = now.getHours();

  if (hours < 6) return "night";
  if (hours < 9) return "noon";
  if (hours < 17) return "day";
  if (hours < 20) return "evening";
  return "night";
};

const didHourChange = (lastChangedAt: number, now: Date) => {
  const then = new Date(lastChangedAt);

  return (
    then.getFullYear() !== now.getFullYear() ||
    then.getMonth() !== now.getMonth() ||
    then.getDate() !== now.getDate() ||
    then.getHours() !== now.getHours()
  );
};

const didDayChange = (lastChangedAt: number, now: Date) => {
  const then = new Date(lastChangedAt);

  return (
    then.getFullYear() !== now.getFullYear() ||
    then.getMonth() !== now.getMonth() ||
    then.getDate() !== now.getDate()
  );
};

const getRotationState = (): Promise<WallpaperRotationState> =>
  new Promise((resolve) => {
    chrome.storage.local.get([WALLPAPER_ROTATION_STATE_KEY], (data) => {
      const state = data[WALLPAPER_ROTATION_STATE_KEY];
      if (state && typeof state === "object") {
        resolve(state as WallpaperRotationState);
      } else {
        resolve({});
      }
    });
  });

const saveRotationState = (state: WallpaperRotationState): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [WALLPAPER_ROTATION_STATE_KEY]: state }, () => resolve());
  });

const shouldAdvance = ({
  frequency,
  now,
  entry
}: {
  frequency: WallpaperFrequency;
  now: Date;
  entry: WallpaperRotationEntry;
}) => {
  if (frequency === "constant") return false;
  if (frequency === "every-tab") return true;
  if (frequency === "every-hour") return didHourChange(entry.lastChangedAt, now);
  if (frequency === "every-day") return didDayChange(entry.lastChangedAt, now);

  const currentPeriod = getCurrentDaylightPeriod(now);
  return entry.lastDaylightPeriod !== currentPeriod;
};

export const resolveWallpaperIndex = async ({
  rotationKey,
  frequency,
  itemCount
}: {
  rotationKey: string;
  frequency: WallpaperFrequency;
  itemCount: number;
}): Promise<number> => {
  if (itemCount <= 0) return -1;

  const now = new Date();
  const currentPeriod = getCurrentDaylightPeriod(now);
  const state = await getRotationState();

  if (frequency === "constant") {
    state[rotationKey] = {
      activeIndex: 0,
      lastChangedAt: now.getTime(),
      lastDaylightPeriod: currentPeriod
    };
    await saveRotationState(state);
    return 0;
  }

  const existing = state[rotationKey];

  if (!existing) {
    state[rotationKey] = {
      activeIndex: 0,
      lastChangedAt: now.getTime(),
      lastDaylightPeriod: currentPeriod
    };

    await saveRotationState(state);
    return 0;
  }

  const entry: WallpaperRotationEntry = {
    activeIndex:
      Number.isFinite(existing.activeIndex) && existing.activeIndex >= 0
        ? existing.activeIndex % itemCount
        : 0,
    lastChangedAt:
      Number.isFinite(existing.lastChangedAt) && existing.lastChangedAt > 0
        ? existing.lastChangedAt
        : now.getTime(),
    lastDaylightPeriod: existing.lastDaylightPeriod ?? currentPeriod
  };

  if (itemCount === 1) {
    entry.activeIndex = 0;
    entry.lastChangedAt = now.getTime();
    entry.lastDaylightPeriod = currentPeriod;
    state[rotationKey] = entry;
    await saveRotationState(state);
    return 0;
  }

  if (shouldAdvance({ frequency, now, entry })) {
    entry.activeIndex = (entry.activeIndex + 1) % itemCount;
    entry.lastChangedAt = now.getTime();
    entry.lastDaylightPeriod = currentPeriod;
    state[rotationKey] = entry;
    await saveRotationState(state);
    return entry.activeIndex;
  }

  entry.lastDaylightPeriod = currentPeriod;
  state[rotationKey] = entry;
  await saveRotationState(state);
  return entry.activeIndex;
};

export const resolveWallpaperIndexStateless = ({
  frequency,
  itemCount
}: {
  frequency: WallpaperFrequency;
  itemCount: number;
}) => {
  if (itemCount <= 0) return -1;
  if (itemCount === 1) return 0;
  if (frequency === "every-tab") return 1;
  return 0;
};
