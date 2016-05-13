/**
 * CSS attack vectors: (please add if you find more)
 *
 * - IE 5, 6, and 7 support computed properties via injecting JS with expression().
 * - JS can be executed in place of a url():
 *   -  backround-color: "javascript:alert(1)"
 * - CSRF is possible using the url() function.
 * - The -moz-binding property for attaching XBL requires a URL.
 *
 * Resources:
 * - https://code.google.com/p/google-caja/wiki/CssAllowsArbitraryCodeExecution
 * - https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.234_-_CSS_Escape_And_Strictly_Validate_Before_Inserting_Untrusted_Data_into_HTML_Style_Property_Values
 */

'use strict';

var valueFilters = [
  /;/,
  /@import/i,
  /expression/i,
  /url/i,
  /javascript/i
];

function htmlEscape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function filterStyleValues(dirty) {
  var clean = {};

  dirty = dirty || {};

  Object.keys(dirty).forEach(function (key) {
    var value = dirty[key];
    var unsanitary = valueFilters.some(function (regex) {
      return regex.test(value);
    });

    if (unsanitary) { return; }

    clean[key] = htmlEscape(dirty[key]);
  });

  return clean;
}

module.exports = filterStyleValues;
