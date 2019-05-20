'use strict';

var validateSelector = require('./validate-selector');
var filterStyleKeys = require('./filter-style-keys');
var filterStyleValues = require('./filter-style-values');

function isSelectorMediaQuery(selector) {
  return /^@media\s+/i.test(selector);
}

function buildRule(selector, styles, curriedKeysFilter) {
  var result, sanitized;
  var constructedRule = selector + '{';

  styles = styles || {};

  if (isSelectorMediaQuery(selector)) {
    Object.keys(styles).forEach(function (innerSelector) {
      if (!validateSelector(innerSelector)) { return; }

      constructedRule += buildRule(innerSelector, styles[innerSelector], curriedKeysFilter);
    });
  } else {
    result = curriedKeysFilter(styles);
    sanitized = filterStyleValues(result);

    Object.keys(sanitized).forEach(function (rule) {
      constructedRule += rule + ':' + sanitized[rule] + ';';
    });
  }

  constructedRule += '}';

  return constructedRule;
}

function injectStylesheet(styles, propertyList, isAllowlist) {
  var stylesheet;
  var position = 0;
  var styleElement = document.createElement('style');

  document.querySelector('head').appendChild(styleElement);
  stylesheet = styleElement.sheet || styleElement.styleSheet;

  styles = styles || {};
  propertyList = propertyList || [];

  function curriedKeysFilter(styleObject) {
    return filterStyleKeys(styleObject, propertyList, isAllowlist);
  }

  Object.keys(styles).forEach(function (selector) {
    var constructedRule;

    if (!validateSelector(selector)) { return; }

    constructedRule = buildRule(selector, styles[selector], curriedKeysFilter);

    try {
      if (stylesheet.insertRule) {
        stylesheet.insertRule(constructedRule, position);
      } else {
        stylesheet.addRule(selector, constructedRule.replace(/^[^{]+/, '').replace(/{|}/g, ''), position);
      }
      position++;
    } catch (err) {
      if (!err instanceof SyntaxError) { throw err; }
    }
  });

  return styleElement;
}

module.exports = injectStylesheet;
