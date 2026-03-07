import { AssistMath, hideAssist } from "~/src/newtab/scripts/utils/search/search-assist-utils";

type MathJS = typeof import("mathjs");

let mathJSPromise: Promise<MathJS> | null = null;

const loadMathJS = () => {
  if (!mathJSPromise) {
    mathJSPromise = import("mathjs");
  }

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

    const result = math.evaluate(val);

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

const betterFormat = (math: MathJS, expression: unknown): string => {
  return math
    .format(expression)
    .replace(/\s*\*\s*\(/g, "(") // remove '* (' to '('
    .replace(/\s*\*\s*/g, "") // remove '* ' between terms
    .replace(/\s*\^\s*/g, "^") // remove spaces around '^'
    .replace(/\s*(\d)\s*([a-zA-Z])/g, "$1$2") // remove spaces between numbers and variables
    .replace(/\s+/g, " "); // keep single spaces between terms
};
