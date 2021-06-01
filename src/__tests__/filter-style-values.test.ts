import { filterStyleValues } from "../lib/filter-style-values";

describe("filterStyleValues", () => {
  it("returns an empty object if passed nothing", () => {
    expect(filterStyleValues()).toEqual({});
  });

  it("returns an empty object if passed an empty object", () => {
    expect(filterStyleValues({})).toEqual({});
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

  it("HTML escapes a <script> tag", () => {
    const result = filterStyleValues({
      color: '"/><script>alert("foo")</script><input ',
    });

    const expected = {
      color: '"/&gt;&lt;script&gt;alert("foo")&lt;/script&gt;&lt;input ',
    };

    expect(result.color).toBe(expected.color);
  });
});
