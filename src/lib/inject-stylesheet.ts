import validateSelector from "./validate-selector";
import filterStyleKeys from "./filter-style-keys";
import filterStyleValues from "./filter-style-values";

function isSelectorMediaQuery(selector): boolean {
  return /^@media\s+/i.test(selector);
}

function buildRule(selector, styles, curriedKeysFilter): string {
  let result, sanitized;
  let constructedRule = selector + "{";

  styles = styles || {};

  if (isSelectorMediaQuery(selector)) {
    Object.keys(styles).forEach(function (innerSelector) {
      if (!validateSelector(innerSelector)) {
        return;
      }

      constructedRule += buildRule(
        innerSelector,
        styles[innerSelector],
        curriedKeysFilter
      );
    });
  } else {
    result = curriedKeysFilter(styles);
    sanitized = filterStyleValues(result);

    Object.keys(sanitized).forEach(function (rule) {
      constructedRule += rule + ":" + sanitized[rule] + ";";
    });
  }

  constructedRule += "}";

  return constructedRule;
}

export default function injectStylesheet(
  styles?,
  propertyList?,
  isAllowlist?
): HTMLStyleElement {
  let position = 0;
  const styleElement = document.createElement("style");

  document.querySelector("head").appendChild(styleElement);
  const stylesheet = styleElement.sheet as CSSStyleSheet;

  styles = styles || {};
  propertyList = propertyList || [];

  function curriedKeysFilter(styleObject): Record<string, any> {
    return filterStyleKeys(styleObject, propertyList, isAllowlist);
  }

  Object.keys(styles).forEach(function (selector) {
    if (!validateSelector(selector)) {
      return;
    }

    const constructedRule = buildRule(
      selector,
      styles[selector],
      curriedKeysFilter
    );

    try {
      if (stylesheet.insertRule) {
        stylesheet.insertRule(constructedRule, position);
      } else {
        stylesheet.addRule(
          selector,
          constructedRule.replace(/^[^{]+/, "").replace(/{|}/g, ""),
          position
        );
      }
      position++;
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw err;
      }
    }
  });

  return styleElement;
}
