import { injectStylesheet } from "./lib/inject-stylesheet";
import { Style } from "./lib/types";

export function injectWithAllowlist(
  styles: Style,
  list: string[]
): HTMLStyleElement {
  return injectStylesheet(styles, list, true);
}

export function injectWithBlocklist(
  styles: Style,
  list: string[]
): HTMLStyleElement {
  return injectStylesheet(styles, list, false);
}
