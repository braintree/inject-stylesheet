import injectStylesheet from "../lib/inject-stylesheet";
import allowlist = require("./support/allowlist.json");

describe("injectStylesheet", () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  function getStyle(element, property, state = null): string | number {
    return window.getComputedStyle(element, state).getPropertyValue(property);
  }

  afterEach(() => {
    if (testContext.element && document.head.contains(testContext.element)) {
      document.head.removeChild(testContext.element);
    }
  });

  it("injects a <style> tag", () => {
    jest.spyOn(document.head, "appendChild");
    const element = injectStylesheet({});
    expect(document.head.appendChild).toBeCalledWith(element);
  });

  it("injects a @media query", () => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const oldTextShadow = getStyle(div, "text-shadow");

    testContext.element = injectStylesheet(
      {
        div: {
          "font-size": "24px",
        },
        "@media not tv": {
          div: {
            color: "blue",
          },
        },
        "@media only tv": {
          div: {
            "text-shadow": "0 0 10px red",
          },
        },
      },
      allowlist,
      true
    );

    expect(getStyle(div, "font-size")).toBe("24px");
    expect(getStyle(div, "text-shadow")).toBe(oldTextShadow);
    expect(getStyle(div, "color")).toBe("");
  });

  it("injects the right content into the <style> tag", () => {
    const foo = document.createElement("div");
    const bar = document.createElement("input");

    foo.id = "foo";
    bar.id = "bar";
    document.body.appendChild(foo);
    document.body.appendChild(bar);

    const fooOldFontSize = getStyle(foo, "font-size");
    const fooOldBackground = getStyle(foo, "background");
    const barOldBackground = getStyle(bar, "background");

    testContext.element = injectStylesheet(
      {
        "#foo": {
          "font-size": 'url("http://example.com")',
          background: "red",
          color: "orange",
        },
        "#bar": {
          "font-size": "24px",
          background: "red",
          color: "aqua",
        },
      },
      allowlist,
      true
    );

    expect(getStyle(foo, "font-size")).toBe(fooOldFontSize);
    expect(getStyle(foo, "background")).toBe(fooOldBackground);
    expect(getStyle(foo, "color")).toBe("orange");

    expect(getStyle(bar, "background")).toBe(barOldBackground);
    expect(getStyle(bar, "font-size")).toBe("24px");
    expect(getStyle(bar, "color")).toBe("aqua");
  });
});