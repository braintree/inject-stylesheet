'use strict';

var validate = require('../lib/validate-selector');

describe('validateSelector', function () {
  it('should return true for simple selectors', function () {
    expect(validate('input')).to.be.true;
    expect(validate('body')).to.be.true;
    expect(validate('what')).to.be.true;
  });

  it('should return true for media queries', function () {
    expect(validate('@media only screen and (max-width : 1140px)')).to.be.true;
  });

  it('should return false if "{" or "}" is present', function () {
    expect(validate('input { color: red; }')).to.be.false;
    expect(validate('input {')).to.be.false;
    expect(validate('input }')).to.be.false;
    expect(validate('{')).to.be.false;
  });

  it('should return false if @import is present', function () {
    expect(validate('@import http://example.com/malicious.css')).to.be.false;
    expect(validate('@IMPORT http://example.com/malicious.css')).to.be.false;
  });

  it('should return false if @supports is present', function () {
    expect(validate('@supports')).to.be.false;
    expect(validate('@supports (-webkit-appearance:none) {}')).to.be.false;
    expect(validate('@SUPPORTS (-webkit-appearance:none) {}')).to.be.false;
  });

  it('should return false if HTML is present', function () {
    expect(validate('</style><script>console.log("creditCard");</script> *')).to.be.false;
  });

  it('should return false for the empty string', function () {
    expect(validate('')).to.be.false;
  });

  it('should return false for strings that are just whitespace', function () {
    expect(validate('   ')).to.be.false;
  });
});
