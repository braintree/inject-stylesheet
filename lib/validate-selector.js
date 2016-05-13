'use strict';

function validateSelector(selector) {
  if (selector.trim().length === 0) { return false; }
  if (/supports/i.test(selector)) { return false; }
  if (/import/i.test(selector)) { return false; }
  if (/\{|\}/.test(selector)) { return false; }
  if (/</.test(selector)) { return false; }

  return true;
}

module.exports = validateSelector;
