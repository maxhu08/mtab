export const logger = {
  log: (...args: unknown[]) => {
    console.log("[MTAB]", ...args);
  }
};