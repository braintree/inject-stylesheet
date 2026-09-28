import { filterStyleValues } from "../lib/filter-style-values";

describe("filterStyleValues", () => {
  it("returns an empty object if passed nothing", () => {
    expect(filterStyleValues()).toEqual({});
  });

  it("returns an empty object if passed an empty object", () => {
    expect(filterStyleValues({})).toEqual({});
  });

  it("prevents hexadecimal statements", () => {
    const result = filterStyleValues({
      color: "\\6a\\61\\76\\61\\73\\63\\72\\69\\70\\74",
      fontWeight: "500",
      fontStyle: "\\4a\\41\\56\\41\\53\\43\\52\\49\\50\\54",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents at-rule statements", () => {
    const result = filterStyleValues({
      color: "@import",
      fontWeight: "500",
      fontStyle: "@IMPORT",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents javascript statements", () => {
    const result = filterStyleValues({
      color: "javascript",
      fontWeight: "500",
      fontStyle: "JAVASCRIPT",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents expression() statements", () => {
    const result = filterStyleValues({
      color: "expression(alert(1))",
      fontWeight: "500",
      fontStyle: "expression(alert(1))",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents url() statements", () => {
    const result = filterStyleValues({
      backgroundImage: 'url("foo")',
      fontWeight: "500",
      color: 'url("bar")',
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents URL() statements", () => {
    const result = filterStyleValues({
      backgroundImage: 'URL("foo")',
      fontWeight: "500",
      color: 'URL("bar")',
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents -moz-binding declarations", () => {
    const result = filterStyleValues({
      MozBinding: 'url("foo")',
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents < or >", () => {
    const result = filterStyleValues({
      color: '"/><script>alert("foo")</script><input ',
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents any /", () => {
    const result = filterStyleValues({
      backgroundImage: "https://evil.example/leak",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents any }", () => {
    const result = filterStyleValues({
      color: "red}",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents any {", () => {
    const result = filterStyleValues({
      color: "body{anchor-name:--hf-field!important",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents @ rules not followed by a plain letter", () => {
    const result = filterStyleValues({
      color: "@\x12 ontainer",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("allows @media", () => {
    const result = filterStyleValues({
      color: "@media screen and (min-width: 480px)",
      fontWeight: "500",
    });

    const expected = {
      color: "@media screen and (min-width: 480px)",
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents @-rules that only look like @media", () => {
    const result = filterStyleValues({
      color: "@mediaXfoo",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents image-set", () => {
    const result = filterStyleValues({
      color: "image-set('https://evil.example/leak.png' 1x)",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });

  it("prevents image", () => {
    const result = filterStyleValues({
      color: "image('https://evil.example/leak.png' 1x)",
      fontWeight: "500",
    });

    const expected = {
      fontWeight: "500",
    };

    expect(result).toEqual(expected);
  });
});
