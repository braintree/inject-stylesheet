'use strict';

module.exports = function filterStyleKeys(styleObject, propertyList, isWhitelist) {
  var result = {};

  function whitelistFilter(key) {
    if (propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blacklistFilter(key) {
    if (propertyList.indexOf(key) === -1) {
      result[key] = styleObject[key];
    }
  }

  if (isWhitelist) {
    Object.keys(styleObject).forEach(whitelistFilter);
  } else {
    Object.keys(styleObject).forEach(blacklistFilter);
  }

  return result;
};
