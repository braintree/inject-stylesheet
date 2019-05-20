'use strict';

var injectStylesheet = require('./lib/inject-stylesheet');

module.exports = {
  injectWithAllowlist: function (styles, list) { return injectStylesheet(styles, list, true); },
  injectWithBlocklist: function (styles, list) { return injectStylesheet(styles, list, false); }
};
