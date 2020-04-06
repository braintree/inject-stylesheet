import injectStylesheet from "./lib/inject-stylesheet";

export = {
  injectWithAllowlist: function (styles, list): HTMLStyleElement {
    return injectStylesheet(styles, list, true);
  },
  injectWithBlocklist: function (styles, list): HTMLStyleElement {
    return injectStylesheet(styles, list, false);
  },
};
