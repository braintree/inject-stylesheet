const injectStylesheet = require('../lib/inject-stylesheet');
const allowlist = require('./support/allowlist');

describe('injectStylesheet', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  function getStyle(element, property, state) {
    return window.getComputedStyle(element, state || null).getPropertyValue(property);
  }

  afterEach(() => {
    if (testContext.element && document.head.contains(testContext.element)) {
      document.head.removeChild(testContext.element);
    }
  });

  test('injects a <style> tag', () => {
    let element;

    jest.spyOn(document.head, 'appendChild');
    element = injectStylesheet({});
    expect(document.head.appendChild).toBeCalledWith(element);
  });

  test('injects a @media query', () => {
    let oldTextShadow;
    const div = document.createElement('div');

    document.body.appendChild(div);

    oldTextShadow = getStyle(div, 'text-shadow');

    testContext.element = injectStylesheet({
      div: {
        'font-size': '24px'
      },
      '@media not tv': {
        div: {
          color: 'blue'
        }
      },
      '@media only tv': {
        div: {
          'text-shadow': '0 0 10px red'
        }
      }
    }, allowlist, true);

    expect(getStyle(div, 'font-size')).toBe('24px');
    expect(getStyle(div, 'text-shadow')).toBe(oldTextShadow);
    expect(getStyle(div, 'color')).toBe('');
  });

  test('injects the right content into the <style> tag', () => {
    let fooOldFontSize, fooOldBackground, barOldBackground;
    const foo = document.createElement('div');
    const bar = document.createElement('input');

    foo.id = 'foo';
    bar.id = 'bar';
    document.body.appendChild(foo);
    document.body.appendChild(bar);

    fooOldFontSize = getStyle(foo, 'font-size');
    fooOldBackground = getStyle(foo, 'background');
    barOldBackground = getStyle(bar, 'background');

    testContext.element = injectStylesheet({
      '#foo': {
        'font-size': 'url("http://example.com")',
        background: 'red',
        color: 'orange'
      },
      '#bar': {
        'font-size': '24px',
        background: 'red',
        color: 'aqua'
      }
    }, allowlist, true);

    expect(getStyle(foo, 'font-size')).toBe(fooOldFontSize);
    expect(getStyle(foo, 'background')).toBe(fooOldBackground);
    expect(getStyle(foo, 'color')).toBe('orange');

    expect(getStyle(bar, 'background')).toBe(barOldBackground);
    expect(getStyle(bar, 'font-size')).toBe('24px');
    expect(getStyle(bar, 'color')).toBe('aqua');
  });
});
