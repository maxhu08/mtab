import { evaluate, format, isComplex, isConstantNode, isNumber, isOperatorNode } from "mathjs";
import { hideAssist } from "src/newtab/scripts/utils/search/search-assist-utils";

export const handleMath = (val: string) => {
  try {
    // check for pattern d/dx(expression)
    const derivativeMatch = val.match(/^d\/dx\((.+)\)$/);
    if (derivativeMatch) {
      const expression = derivativeMatch[1];
      val = `derivative("${expression}", "x")`;
    }

    const result = evaluate(val);

    // allow imaginary numbers
    // prevent returning a function val is a function like `atan` or `derivative`
    if (
      result?.re ||
      result?.im ||
      isConstantNode(result) ||
      isComplex(result) ||
      isOperatorNode(result) ||
      isNumber(result)
    ) {
      return { type: "math", result: format(result) } as const;
    }
  } catch {
    if (val !== "date") hideAssist();
  }
};
