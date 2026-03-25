import { uiCustomCSSHighlightEl, uiCustomCSSTextareaEl } from "~/src/options/scripts/ui";

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrapToken = (className: string, value: string): string =>
  `<span class="${className}">${escapeHtml(value)}</span>`;

const isDigit = (char: string | undefined): boolean => /[0-9]/.test(char ?? "");
const isIdentifierStart = (char: string | undefined): boolean => /[A-Za-z_-]/.test(char ?? "");
const isIdentifierChar = (char: string | undefined): boolean => /[A-Za-z0-9_-]/.test(char ?? "");

const cssValueKeywords = new Set([
  "absolute",
  "auto",
  "block",
  "bold",
  "border-box",
  "both",
  "capitalize",
  "center",
  "column",
  "contain",
  "contents",
  "cover",
  "currentcolor",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "end",
  "fixed",
  "flex",
  "grid",
  "hidden",
  "inherit",
  "initial",
  "inline",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "italic",
  "left",
  "linear",
  "none",
  "normal",
  "nowrap",
  "pointer",
  "relative",
  "repeat",
  "right",
  "row",
  "solid",
  "space-around",
  "space-between",
  "space-evenly",
  "start",
  "static",
  "sticky",
  "stretch",
  "transparent",
  "unset",
  "uppercase",
  "visible"
]);

const cssUnits = new Set([
  "%",
  "ch",
  "cm",
  "deg",
  "dvh",
  "dvw",
  "em",
  "fr",
  "grad",
  "in",
  "lh",
  "lvh",
  "lvw",
  "ms",
  "mm",
  "pc",
  "pt",
  "px",
  "rad",
  "rem",
  "s",
  "svh",
  "svw",
  "turn",
  "vh",
  "vi",
  "vmax",
  "vmin",
  "vw"
]);

const tokenizeComment = (value: string, start: number): { html: string; end: number } => {
  const end = value.indexOf("*/", start + 2);
  const endIndex = end === -1 ? value.length : end + 2;
  return {
    html: wrapToken("custom-css-token-comment", value.slice(start, endIndex)),
    end: endIndex
  };
};

const tokenizeString = (value: string, start: number): { html: string; end: number } => {
  const quote = value[start];
  let index = start + 1;

  while (index < value.length) {
    if (value[index] === "\\") {
      index += 2;
      continue;
    }

    if (value[index] === quote) {
      index += 1;
      break;
    }

    index += 1;
  }

  return {
    html: wrapToken("custom-css-token-string", value.slice(start, index)),
    end: index
  };
};

const tokenizeNumber = (value: string, start: number): { html: string; end: number } => {
  let index = start;

  if (value[index] === "+" || value[index] === "-") index += 1;

  while (index < value.length && /[0-9.]/.test(value[index])) {
    index += 1;
  }

  const numberPart = value.slice(start, index);
  let unitEnd = index;

  if (value[index] === "%") {
    unitEnd += 1;
  } else {
    while (unitEnd < value.length && /[A-Za-z]/.test(value[unitEnd])) {
      unitEnd += 1;
    }
  }

  const unitPart = value.slice(index, unitEnd);
  const unitHtml =
    unitPart && cssUnits.has(unitPart.toLowerCase())
      ? wrapToken("custom-css-token-unit", unitPart)
      : escapeHtml(unitPart);

  return {
    html: `${wrapToken("custom-css-token-number", numberPart)}${unitHtml}`,
    end: unitEnd
  };
};

const tokenizeIdentifier = (
  value: string,
  start: number,
  context: "selector" | "property" | "value"
): { html: string; end: number } => {
  let index = start;

  if (value.startsWith("--", start)) {
    index += 2;
    while (index < value.length && isIdentifierChar(value[index])) index += 1;

    return {
      html: wrapToken("custom-css-token-custom-property", value.slice(start, index)),
      end: index
    };
  }

  while (index < value.length && isIdentifierChar(value[index])) index += 1;

  const identifier = value.slice(start, index);

  if (context === "property") {
    return {
      html: wrapToken("custom-css-token-property", identifier),
      end: index
    };
  }

  if (context === "selector") {
    return {
      html: wrapToken("custom-css-token-selector", identifier),
      end: index
    };
  }

  if (value[index] === "(") {
    return {
      html: wrapToken("custom-css-token-function", identifier),
      end: index
    };
  }

  if (cssValueKeywords.has(identifier.toLowerCase())) {
    return {
      html: wrapToken("custom-css-token-value", identifier),
      end: index
    };
  }

  return {
    html: escapeHtml(identifier),
    end: index
  };
};

const tokenizeSelectorTokenAt = (value: string, start: number): { html: string; end: number } => {
  const char = value[start]!;

  if (value.startsWith("/*", start)) return tokenizeComment(value, start);
  if (char === '"' || char === "'") return tokenizeString(value, start);

  if (char === "@") {
    let end = start + 1;
    while (end < value.length && isIdentifierChar(value[end])) end += 1;
    return {
      html: wrapToken("custom-css-token-at-rule", value.slice(start, end)),
      end
    };
  }

  if (char === "." || char === "#") {
    return {
      html: wrapToken("custom-css-token-selector", char),
      end: start + 1
    };
  }

  if (
    char === "[" ||
    char === "]" ||
    char === "(" ||
    char === ")" ||
    char === "{" ||
    char === "}"
  ) {
    return {
      html: wrapToken("custom-css-token-bracket", char),
      end: start + 1
    };
  }

  if (char === ":" && value[start + 1] === ":") {
    return {
      html: wrapToken("custom-css-token-punctuation", "::"),
      end: start + 2
    };
  }

  if (":,>+~=*".includes(char)) {
    return {
      html: wrapToken("custom-css-token-punctuation", char),
      end: start + 1
    };
  }

  if (isIdentifierStart(char) || char === "-") {
    return tokenizeIdentifier(value, start, "selector");
  }

  return {
    html: escapeHtml(char),
    end: start + 1
  };
};

const tokenizeValueTokenAt = (value: string, start: number): { html: string; end: number } => {
  const char = value[start]!;

  if (value.startsWith("/*", start)) return tokenizeComment(value, start);
  if (char === '"' || char === "'") return tokenizeString(value, start);

  if (value.startsWith("!important", start)) {
    return {
      html: wrapToken("custom-css-token-important", "!important"),
      end: start + "!important".length
    };
  }

  if (char === "@") {
    let end = start + 1;
    while (end < value.length && isIdentifierChar(value[end])) end += 1;
    return {
      html: wrapToken("custom-css-token-at-rule", value.slice(start, end)),
      end
    };
  }

  if (char === "#") {
    let end = start + 1;
    while (end < value.length && /[A-Fa-f0-9]/.test(value[end])) end += 1;

    if (end > start + 1) {
      return {
        html: wrapToken("custom-css-token-number", value.slice(start, end)),
        end
      };
    }
  }

  if (
    isDigit(char) ||
    ((char === "+" || char === "-" || char === ".") && isDigit(value[start + 1]))
  ) {
    return tokenizeNumber(value, start);
  }

  if (char === "(" || char === ")" || char === "[" || char === "]" || char === "{") {
    return {
      html: wrapToken("custom-css-token-bracket", char),
      end: start + 1
    };
  }

  if (":,/".includes(char)) {
    return {
      html: wrapToken("custom-css-token-punctuation", char),
      end: start + 1
    };
  }

  if (isIdentifierStart(char) || char === "-") {
    return tokenizeIdentifier(value, start, "value");
  }

  return {
    html: escapeHtml(char),
    end: start + 1
  };
};

const renderCustomCSSValue = (value: string): string => {
  const tokens: string[] = [];
  let inBlock = false;
  let context: "selector" | "property" | "value" = "selector";

  for (let index = 0; index < value.length; ) {
    const char = value[index];

    if (value.startsWith("/*", index)) {
      const token = tokenizeComment(value, index);
      tokens.push(token.html);
      index = token.end;
      continue;
    }

    if (char === '"' || char === "'") {
      const token = tokenizeString(value, index);
      tokens.push(token.html);
      index = token.end;
      continue;
    }

    if (!inBlock) {
      if (char === "{") {
        tokens.push(wrapToken("custom-css-token-bracket", char));
        inBlock = true;
        context = "property";
        index += 1;
        continue;
      }

      const token = tokenizeSelectorTokenAt(value, index);
      tokens.push(token.html);
      index = token.end;
      continue;
    }

    if (context === "property") {
      if (char === "}") {
        tokens.push(wrapToken("custom-css-token-bracket", char));
        inBlock = false;
        context = "selector";
        index += 1;
        continue;
      }

      if (char === ":") {
        tokens.push(wrapToken("custom-css-token-punctuation", char));
        context = "value";
        index += 1;
        continue;
      }

      if (char === ";" || char === ",") {
        tokens.push(wrapToken("custom-css-token-punctuation", char));
        index += 1;
        continue;
      }

      if (char === "(" || char === ")" || char === "[" || char === "]") {
        tokens.push(wrapToken("custom-css-token-bracket", char));
        index += 1;
        continue;
      }

      if (isIdentifierStart(char) || char === "-") {
        const token = tokenizeIdentifier(value, index, "property");
        tokens.push(token.html);
        index = token.end;
        continue;
      }

      tokens.push(escapeHtml(char));
      index += 1;
      continue;
    }

    if (char === ";") {
      tokens.push(wrapToken("custom-css-token-punctuation", char));
      context = "property";
      index += 1;
      continue;
    }

    if (char === "}") {
      tokens.push(wrapToken("custom-css-token-bracket", char));
      inBlock = false;
      context = "selector";
      index += 1;
      continue;
    }

    const token = tokenizeValueTokenAt(value, index);
    tokens.push(token.html);
    index = token.end;
  }

  return tokens.join("");
};

const syncCustomCSSMetrics = () => {
  const computedStyle = window.getComputedStyle(uiCustomCSSTextareaEl);

  uiCustomCSSHighlightEl.style.padding = computedStyle.padding;
  uiCustomCSSHighlightEl.style.font = computedStyle.font;
  uiCustomCSSHighlightEl.style.letterSpacing = computedStyle.letterSpacing;
  uiCustomCSSHighlightEl.style.lineHeight = computedStyle.lineHeight;
  uiCustomCSSHighlightEl.style.tabSize = computedStyle.tabSize;
  uiCustomCSSHighlightEl.style.whiteSpace = computedStyle.whiteSpace;
};

const syncCustomCSSHighlight = () => {
  const value = uiCustomCSSTextareaEl.value;
  const displayValue = value.length === 0 || value.endsWith("\n") ? `${value} ` : value;
  uiCustomCSSHighlightEl.innerHTML = renderCustomCSSValue(displayValue);
};

export const syncCustomCSSHighlightScroll = () => {
  uiCustomCSSHighlightEl.scrollTop = uiCustomCSSTextareaEl.scrollTop;
  uiCustomCSSHighlightEl.scrollLeft = uiCustomCSSTextareaEl.scrollLeft;
};

export const initCustomCSSHighlight = () => {
  syncCustomCSSMetrics();
  syncCustomCSSHighlight();
  syncCustomCSSHighlightScroll();

  uiCustomCSSTextareaEl.addEventListener("input", () => {
    syncCustomCSSHighlight();
    syncCustomCSSHighlightScroll();
  });
  uiCustomCSSTextareaEl.addEventListener("scroll", syncCustomCSSHighlightScroll);
  window.addEventListener("resize", syncCustomCSSMetrics);
};

export const refreshCustomCSSHighlight = () => {
  syncCustomCSSMetrics();
  syncCustomCSSHighlight();
  syncCustomCSSHighlightScroll();
};