'use strict';

var filterStyleValues = require('../lib/filter-style-values');

describe('filterStyleValues', function () {
  it('returns an empty object if passed nothing', function () {
    expect(filterStyleValues()).to.deep.equal({});
  });

  it('returns an empty object if passed an empty object', function () {
    expect(filterStyleValues({})).to.deep.equal({});
  });

  it('prevents expression() statements', function () {
    var result = filterStyleValues({
      color: 'expression(alert(1))',
      fontWeight: '500',
      fontStyle: 'expression(alert(1))'
    });

    var expected = {
      fontWeight: '500'
    };

    expect(result).to.deep.equal(expected);
  });

  it('prevents url() statements', function () {
    var result = filterStyleValues({
      backgroundImage: 'url("foo")',
      fontWeight: '500',
      color: 'url("bar")'
    });

    var expected = {
      fontWeight: '500'
    };

    expect(result).to.deep.equal(expected);
  });

  it('prevents URL() statements', function () {
    var result = filterStyleValues({
      backgroundImage: 'URL("foo")',
      fontWeight: '500',
      color: 'URL("bar")'
    });

    var expected = {
      fontWeight: '500'
    };

    expect(result).to.deep.equal(expected);
  });

  it('prevents -moz-binding declarations', function () {
    var result = filterStyleValues({
      MozBinding: 'url("foo")',
      fontWeight: '500'
    });

    var expected = {
      fontWeight: '500'
    };

    expect(result).to.deep.equal(expected);
  });

  it('HTML escapes a <script> tag', function () {
    var result = filterStyleValues({
      color: '"/><script>alert("foo")</script><input '
    });

    var expected = {
      color: '"/&gt;&lt;script&gt;alert("foo")&lt;/script&gt;&lt;input '
    };

    expect(result.color).to.equal(expected.color);
  });
});
