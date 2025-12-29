export const logger = {
  log: (...args: never[]) => {
    console.log("[MTAB]", ...args);
  }
};
