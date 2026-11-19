export function validateSelector(selector: string): boolean {
  if (selector.trim().length === 0) {
    return false;
  }
  // escapes can disguise at-rules (e.g. `@\69 mport`) and other tokens
  if (/\\/.test(selector)) {
    return false;
  }
  // comments can swallow the rest of the rule
  if (/\/\*/.test(selector)) {
    return false;
  }
  // block all @-rules except @media, like the value filter
  if (/@(?!media\b)/i.test(selector)) {
    return false;
  }
  if (/[{}]/.test(selector)) {
    return false;
  }

  return !/</.test(selector);
}
