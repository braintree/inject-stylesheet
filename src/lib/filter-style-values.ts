/**
 * CSS attack vectors: (please add if you find more)
 *
 * - IE 5, 6, and 7 support computed properties via injecting JS with expression().
 * - JS can be executed in place of a url():
 *   - backround-color: "javascript:alert(1)"
 * - CSRF is possible using the url() function.
 * - The -moz-binding property for attaching XBL requires a URL.
 * - The url/expression/javascript/etc exploits can also be accessed by using hexadecimal notation, ie `\\75\\72\\6C` is the hexadecimal representation of `url`.
 *
 * Resources:
 * - https://code.google.com/p/google-caja/wiki/CssAllowsArbitraryCodeExecution
 * - https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.234_-_CSS_Escape_And_Strictly_Validate_Before_Inserting_Untrusted_Data_into_HTML_Style_Property_Values
 */
import { Style } from "./types";

const valueFilters = [
  // prevent injecting additional rules
  /;/,
  // prevent injecting script tags
  /[<>]/,
  // prevent hexadecimal characters
  // (could allow an exploiter to get around the url/expression/javascript rules)
  /\\/,
  /@import/i,
  /expression/i,
  /url/i,
  /javascript/i,
];

export function filterStyleValues(dirty: Style = {}): Style {
  const clean = {} as Style;

  Object.keys(dirty).forEach((key) => {
    const value = String(dirty[key]);
    const unsanitary = valueFilters.some((regex) => regex.test(String(value)));

    if (unsanitary) return;

    clean[key] = value;
  });

  return clean;
}
