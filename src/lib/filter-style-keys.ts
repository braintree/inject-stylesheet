import { Style } from "./types";

// property names or custom properties only; anything else could break out of the declaration
const validKey = /^-{0,2}[a-z_][a-z0-9_-]*$/i;

export function filterStyleKeys(
  styleObject: Style,
  propertyList: string[] = [],
  isAllowlist?: boolean,
): Style {
  const result = {} as Style;
  const blocked = propertyList.map((property) => property.toLowerCase());

  function allowlistFilter(key: string): void {
    if (validKey.test(key) && propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blocklistFilter(key: string): void {
    // CSS property names are ASCII case-insensitive
    if (validKey.test(key) && blocked.indexOf(key.toLowerCase()) === -1) {
      result[key] = styleObject[key];
    }
  }

  if (isAllowlist) {
    Object.keys(styleObject).forEach(allowlistFilter);
  } else {
    Object.keys(styleObject).forEach(blocklistFilter);
  }

  return result;
}
