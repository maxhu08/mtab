/* oxlint-disable typescript/no-explicit-any */
export const logger = {
  log: (...args: any[]) => {
    console.log("[MTAB]", ...args);
  }
};