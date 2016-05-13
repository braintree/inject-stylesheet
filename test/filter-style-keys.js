'use strict';

var filterStyleKeys = require('../lib/filter-style-keys');
var whitelist = require('./support/whitelist.json');

describe('filterStyleKeys', function () {
  it('returns an empty object if passed nothing', function () {
    expect(filterStyleKeys({}, [], false)).to.deep.equal({});
  });

  it('returns an empty object if passed an empty object', function () {
    expect(filterStyleKeys({})).to.deep.equal({});
  });

  it('returns an empty object if passed only bad keys', function () {
    var results = filterStyleKeys({
      foo: 200,
      bar: 'abc',
      baz: 'what is braintree'
    }, whitelist, true);

    expect(results).to.deep.equal({});
  });

  it('returns only whitelisted keys', function () {
    var results = filterStyleKeys({
      'background-color': 'tomato',
      color: 'blue',
      'font-size': 12,
      width: 200
    }, whitelist, true);

    expect(results.color).to.equal('blue');
    expect(results['font-size']).to.equal(12);
    expect(results['background-color']).to.be.undefined;
    expect(results.width).to.be.undefined;
  });
});
