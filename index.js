'use strict';

var injectStylesheet = require('./lib/inject-stylesheet');

module.exports = {
  injectWithWhitelist: function (styles, list) { return injectStylesheet(styles, list, true); },
  injectWithBlacklist: function (styles, list) { return injectStylesheet(styles, list, false); }
};
