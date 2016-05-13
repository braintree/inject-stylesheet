'use strict';

var injectStylesheet = require('../lib/inject-stylesheet');
var whitelist = require('./support/whitelist');

describe('injectStylesheet', function () {
  function getStyle(element, property, state) {
    return window.getComputedStyle(element, state || null).getPropertyValue(property);
  }

  afterEach(function () {
    if (this.element) {
      document.head.removeChild(this.element);
    }
  });

  it('injects a <style> tag', function () {
    var element;

    this.sandbox.stub(document.head, 'appendChild');
    element = injectStylesheet({});
    expect(document.head.appendChild).to.have.been.calledWith(element);
  });

  it('injects a @media query', function () {
    var oldTextShadow;
    var div = document.createElement('div');

    document.body.appendChild(div);

    oldTextShadow = getStyle(div, 'text-shadow');

    this.element = injectStylesheet({
      div: {
        'font-size': '24px'
      },
      '@media not tv': {
        div: {
          color: 'blue'
        }
      },
      '@media only tv': {
        div: {
          'text-shadow': '0 0 10px red'
        }
      }
    }, whitelist, true);

    expect(getStyle(div, 'font-size')).to.equal('24px');
    expect(getStyle(div, 'text-shadow')).to.equal(oldTextShadow);
    expect(getStyle(div, 'color')).to.equal('rgb(0, 0, 255)');
  });

  it('injects the right content into the <style> tag', function () {
    var fooOldFontSize, fooOldBackground, barOldBackground;
    var foo = document.createElement('div');
    var bar = document.createElement('input');

    foo.id = 'foo';
    bar.id = 'bar';
    document.body.appendChild(foo);
    document.body.appendChild(bar);

    fooOldFontSize = getStyle(foo, 'font-size');
    fooOldBackground = getStyle(foo, 'background');
    barOldBackground = getStyle(bar, 'background');

    this.element = injectStylesheet({
      '#foo': {
        'font-size': 'url("http://example.com")',
        background: 'red',
        color: 'orange'
      },
      '#bar': {
        'font-size': '24px',
        background: 'red',
        color: 'aqua'
      }
    }, whitelist, true);

    expect(getStyle(foo, 'font-size')).to.equal(fooOldFontSize);
    expect(getStyle(foo, 'background')).to.equal(fooOldBackground);
    expect(getStyle(foo, 'color')).to.equal('rgb(255, 165, 0)');

    expect(getStyle(bar, 'background')).to.equal(barOldBackground);
    expect(getStyle(bar, 'font-size')).to.equal('24px');
    expect(getStyle(bar, 'color')).to.equal('rgb(0, 255, 255)');
  });
});
