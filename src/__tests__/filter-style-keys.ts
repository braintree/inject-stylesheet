import { filterStyleKeys } from "../lib/filter-style-keys";
import allowlist = require("./support/allowlist.json");

describe("filterStyleKeys", () => {
  it("returns an empty object if passed nothing", () => {
    expect(filterStyleKeys({}, [], false)).toEqual({});
  });

  it("returns an empty object if passed an empty object", () => {
    expect(filterStyleKeys({})).toEqual({});
  });

  it("returns an empty object if passed only bad keys", () => {
    const results = filterStyleKeys(
      {
        foo: 200,
        bar: "abc",
        baz: "what is braintree",
      },
      allowlist,
      true
    );

    expect(results).toEqual({});
  });

  it("returns only allowlisted keys", () => {
    const results = filterStyleKeys(
      {
        "background-color": "tomato",
        color: "blue",
        "font-size": 12,
        width: 200,
      },
      allowlist,
      true
    );

    expect(results.color).toBe("blue");
    expect(results["font-size"]).toBe(12);
    expect(results["background-color"]).toBeUndefined();
    expect(results.width).toBeUndefined();
  });
});
