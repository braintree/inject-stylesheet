import injectStylesheet from "./lib/inject-stylesheet";

export function injectWithAllowlist(styles, list): HTMLStyleElement {
  return injectStylesheet(styles, list, true);
}

export function injectWithBlocklist(styles, list): HTMLStyleElement {
  return injectStylesheet(styles, list, false);
}
