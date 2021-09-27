import { filterStyleValues } from "../lib/filter-style-values";

describe("filterStyleValues", () => {
  it("returns an empty object if passed nothing", () => {
    expect(filterStyleValues()).toEqual({});
  });

  it("returns an empty object if passed an empty object", () => {
    expect(filterStyleValues({})).toEqual({});
  });

  it("prevents hexademcial statements", () => {
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

  it("prevents @import statements", () => {
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
});
