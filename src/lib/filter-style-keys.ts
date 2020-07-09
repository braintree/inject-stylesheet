import { Style } from "./types";

export function filterStyleKeys(
  styleObject: Style,
  propertyList: string[] = [],
  isAllowlist?: boolean
): Style {
  const result = {} as Style;

  function allowlistFilter(key: string): void {
    if (propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blocklistFilter(key: string): void {
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
}
