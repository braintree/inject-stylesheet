export default function validateSelector(selector): boolean {
  if (selector.trim().length === 0) {
    return false;
  }
  if (/supports/i.test(selector)) {
    return false;
  }
  if (/import/i.test(selector)) {
    return false;
  }
  if (/\{|\}/.test(selector)) {
    return false;
  }
  if (/</.test(selector)) {
    return false;
  }

  return true;
}
