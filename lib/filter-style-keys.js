'use strict';

module.exports = function filterStyleKeys(styleObject, propertyList, isAllowlist) {
  var result = {};

  function allowlistFilter(key) {
    if (propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blocklistFilter(key) {
    if (propertyList.indexOf(key) === -1) {
      result[key] = styleObject[key];
    }
  }

  if (isAllowlist) {
    Object.keys(styleObject).forEach(allowlistFilter);
  } else {
    Object.keys(styleObject).forEach(blocklistFilter);
  }

  return result;
};
