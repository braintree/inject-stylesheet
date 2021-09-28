import { injectStylesheet } from "../lib/inject-stylesheet";
import { allowlist } from "../../support";

import { mocked } from "ts-jest/utils";

describe("injectStylesheet", () => {
  let testContext: Record<string, HTMLStyleElement>;

  beforeEach(() => {
    testContext = {};
  });

  function getStyle(element: HTMLElement, property: string): string | number {
    return window.getComputedStyle(element).getPropertyValue(property);
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

  it.each`
    errorType         | ErrorClass
    ${"DOMException"} | ${DOMException}
    ${"SyntaxError"}  | ${SyntaxError}
  `("ignores $errorType errors when calling insertRule", ({ ErrorClass }) => {
    const second = document.createElement("div");

    second.id = "second";
    document.body.appendChild(second);

    jest.spyOn(CSSStyleSheet.prototype, "insertRule");
    mocked(CSSStyleSheet.prototype.insertRule).mockImplementationOnce(
      (str: string) => {
        throw new ErrorClass(`fake dom exception from ${str}`);
      }
    );

    testContext.element = injectStylesheet(
      {
        "#first": {
          color: "orange",
        },
        "#second": {
          color: "aqua",
        },
        "#third": {
          color: "aqua",
        },
      },
      allowlist,
      true
    );

    expect(CSSStyleSheet.prototype.insertRule).toBeCalledTimes(3);
    expect(CSSStyleSheet.prototype.insertRule).toBeCalledWith(
      "#first{color:orange;}",
      0
    );
    expect(CSSStyleSheet.prototype.insertRule).toBeCalledWith(
      "#second{color:aqua;}",
      0
    );
    expect(CSSStyleSheet.prototype.insertRule).toBeCalledWith(
      "#third{color:aqua;}",
      1
    );
    expect(getStyle(second, "color")).toBe("aqua");

    mocked(CSSStyleSheet.prototype.insertRule).mockRestore();
  });

  it("does not allow unsanitary rules", () => {
    const foo = document.createElement("div");

    foo.id = "foo";
    document.body.appendChild(foo);

    const fooOldBackground = getStyle(foo, "background");
    const fooOldColor = getStyle(foo, "color");

    testContext.element = injectStylesheet(
      {
        "#foo": {
          color: "red<background:blue",
          background: "orange;color:white",
        },
      },
      allowlist,
      true
    );

    expect(getStyle(foo, "background")).toBe(fooOldBackground);
    expect(getStyle(foo, "color")).toBe(fooOldColor);
  });
});
