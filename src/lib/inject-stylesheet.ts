import { validateSelector } from "./validate-selector";
import { filterStyleKeys } from "./filter-style-keys";
import { filterStyleValues } from "./filter-style-values";

import { Style } from "./types";

function isSelectorMediaQuery(selector: string): boolean {
  return /^@media\s+/i.test(selector);
}

function buildRule(
  selector: string,
  styles: Style = {},
  curriedKeysFilter: (styleRule: Style) => Style
): string {
  let result;
  let constructedRule = selector + "{";

  if (isSelectorMediaQuery(selector)) {
    Object.keys(styles).forEach((innerSelector) => {
      if (!validateSelector(innerSelector)) {
        return;
      }

      constructedRule += buildRule(
        innerSelector,
        styles[innerSelector] as Style,
        curriedKeysFilter
      );
    });
  } else {
    result = curriedKeysFilter(styles);

    const sanitized = filterStyleValues(result);

    Object.keys(sanitized).forEach((rule) => {
      constructedRule += rule + ":" + sanitized[rule] + ";";
    });
  }

  constructedRule += "}";

  return constructedRule;
}

export function injectStylesheet(
  styles: Style = {},
  propertyList: string[] = [],
  isAllowlist?: boolean
): HTMLStyleElement {
  let position = 0;
  const styleElement = document.createElement("style");

  (document.querySelector("head") as HTMLHeadElement).appendChild(styleElement);
  const stylesheet = styleElement.sheet as CSSStyleSheet;

  function curriedKeysFilter(styleObject: Style): Style {
    return filterStyleKeys(styleObject, propertyList, isAllowlist);
  }

  Object.keys(styles).forEach((selector) => {
    if (!validateSelector(selector)) {
      return;
    }

    const constructedRule = buildRule(
      selector,
      styles[selector] as Style,
      curriedKeysFilter
    );

    try {
      if (stylesheet.insertRule) {
        stylesheet.insertRule(constructedRule, position);
      } else {
        stylesheet.addRule(
          selector,
          constructedRule.replace(/^[^{]+/, "").replace(/[{}]/g, ""),
          position
        );
      }
      position++;
    } catch (err) {
      if (!(err instanceof SyntaxError || err instanceof DOMException)) {
        throw err;
      }
    }
  });

  return styleElement;
}
