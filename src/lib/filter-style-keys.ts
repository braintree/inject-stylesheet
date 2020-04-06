export default function filterStyleKeys(
  styleObject,
  propertyList?,
  isAllowlist?
): Record<string, any> {
  const result = {};

  function allowlistFilter(key): void {
    if (propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blocklistFilter(key): void {
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
