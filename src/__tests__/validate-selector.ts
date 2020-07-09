import { validateSelector as validate } from "../lib/validate-selector";

describe("validateSelector", () => {
  it("should return true for simple selectors", () => {
    expect(validate("input")).toBe(true);
    expect(validate("body")).toBe(true);
    expect(validate("what")).toBe(true);
  });

  it("should return true for media queries", () => {
    expect(validate("@media only screen and (max-width : 1140px)")).toBe(true);
  });

  it('should return false if "{" or "}" is present', () => {
    expect(validate("input { color: red; }")).toBe(false);
    expect(validate("input {")).toBe(false);
    expect(validate("input }")).toBe(false);
    expect(validate("{")).toBe(false);
  });

  it("should return false if @import is present", () => {
    expect(validate("@import http://example.com/malicious.css")).toBe(false);
    expect(validate("@IMPORT http://example.com/malicious.css")).toBe(false);
  });

  it("should return false if @supports is present", () => {
    expect(validate("@supports")).toBe(false);
    expect(validate("@supports (-webkit-appearance:none) {}")).toBe(false);
    expect(validate("@SUPPORTS (-webkit-appearance:none) {}")).toBe(false);
  });

  it("should return false if HTML is present", () => {
    expect(
      validate('</style><script>console.log("creditCard");</script> *')
    ).toBe(false);
  });

  it("should return false for the empty string", () => {
    expect(validate("")).toBe(false);
  });

  it("should return false for strings that are just whitespace", () => {
    expect(validate("   ")).toBe(false);
  });
});
