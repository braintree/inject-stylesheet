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
  curriedKeysFilter: (styleRule: Style) => Style,
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
        curriedKeysFilter,
      );
    });
      } else {
        // addRule is the IE-only fallback for when insertRule is unavailable;
        // unreachable in any modern browser or jsdom so coverage is suppressed.
        /* istanbul ignore next */
        stylesheet.addRule(
          selector,
          constructedRule.replace(/^[^{]+/, "").replace(/[{}]/g, ""),
          position,
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
