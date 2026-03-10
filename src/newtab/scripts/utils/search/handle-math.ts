import { AssistMath, hideAssist } from "~/src/newtab/scripts/utils/search/search-assist-utils";

type MathJSGlobal = {
  evaluate: (expression: string) => unknown;
  format: (expression: unknown) => string;
  isConstantNode: (value: unknown) => boolean;
  isComplex: (value: unknown) => boolean;
  isOperatorNode: (value: unknown) => boolean;
  isNumber: (value: unknown) => boolean;
};

let mathJSPromise: Promise<MathJSGlobal> | null = null;

const getMathGlobal = (): MathJSGlobal | null => {
  const maybeMath = (globalThis as typeof globalThis & { math?: MathJSGlobal }).math;
  if (
    maybeMath &&
    typeof maybeMath.evaluate === "function" &&
    typeof maybeMath.format === "function" &&
    typeof maybeMath.isConstantNode === "function" &&
    typeof maybeMath.isComplex === "function" &&
    typeof maybeMath.isOperatorNode === "function" &&
    typeof maybeMath.isNumber === "function"
  ) {
    return maybeMath;
  }

  return null;
};

const loadMathJS = () => {
  if (mathJSPromise) return mathJSPromise;

  mathJSPromise = new Promise<MathJSGlobal>((resolve, reject) => {
    const existingMath = getMathGlobal();
    if (existingMath) {
      resolve(existingMath);
      return;
    }

    const script = document.createElement("script");
    script.src =
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL("vendor/mathjs/math.js")
        : "/vendor/mathjs/math.js";
    script.async = true;

    script.onload = () => {
      const loadedMath = getMathGlobal();
      if (!loadedMath) {
        reject(new Error("mathjs loaded but global `math` is unavailable"));
        return;
      }

      resolve(loadedMath);
    };

    script.onerror = () => {
      reject(new Error("Failed to load mathjs vendor script"));
    };

    document.head.appendChild(script);
  });

  return mathJSPromise;
};

const isLikelyMathInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (/^d\/dx\(.+\)$/i.test(trimmed)) return true;

  return /[\d()+\-*/^%=]|(?:sqrt|sin|cos|tan|log|ln|abs|pi)\b/i.test(trimmed);
};

export const handleMath = async (val: string) => {
  if (!isLikelyMathInput(val)) return;

  try {
    const math = await loadMathJS();

    // check for pattern d/dx(expression)
    const derivativeMatch = val.match(/^d\/dx\((.+)\)$/);
    if (derivativeMatch) {
      const expression = derivativeMatch[1];
      val = `derivative("${expression}", "x")`;
    } else {
      val = normalizeMultiplicationInput(val);
    }

    const result = math.evaluate(val) as { re?: unknown; im?: unknown };

    // allow imaginary numbers
    // prevent returning a function val is a function like `atan` or `derivative`
    if (
      result?.re ||
      result?.im ||
      math.isConstantNode(result) ||
      math.isComplex(result) ||
      math.isOperatorNode(result) ||
      math.isNumber(result)
    ) {
      return { type: "math", result: betterFormat(math, result) } satisfies AssistMath;
    }
  } catch {
    if (val.trim() !== "date") hideAssist();
  }
};

const normalizeMultiplicationInput = (expression: string): string => {
  return expression.replace(/(?<=\d|\))\s*[xX×]\s*(?=\d|\()/g, "*");
};

const betterFormat = (math: MathJSGlobal, expression: unknown): string => {
  return math
    .format(expression)
    .replace(/\s*\*\s*\(/g, "(") // remove '* (' to '('
    .replace(/\s*\*\s*/g, "") // remove '* ' between terms
    .replace(/\s*\^\s*/g, "^") // remove spaces around '^'
    .replace(/\s*(\d)\s*([a-zA-Z])/g, "$1$2") // remove spaces between numbers and variables
    .replace(/\s+/g, " "); // keep single spaces between terms
};
