type Mergeable = Record<string, unknown>;

const isObject = (value: unknown): value is Mergeable => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const deepMerge = <T extends object>(target: T, source: unknown): T => {
  const output = target as Mergeable;

  if (!isObject(target) || !isObject(source)) {
    return source as T;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = output[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output as T;
};
