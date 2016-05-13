inject-stylesheet
=================

This library takes a blacklist (or whitelist) of CSS properties and sanitizes for known CSS exploits.

## API

Where mentioned, `styles` is an object with its keys being CSS selectors and values being CSS property key-value pairs.

```
var stylesheet = injectStylesheet.injectWithBlacklist(styles [, blacklist]);
var stylesheet = injectStylesheet.injectWithWhitelist(styles [, whitelist]);
```

After usage, `stylesheet` will refer to the `<style>` tag that was injected into the `<head>` of the document.

```javascript
var injectStylesheet = require('inject-stylesheet');
var styles = {
  "input": {
    "font-size": "16pt",
    "color": "#3A3A3A"
  },
  ".invalid": {
    "color": "tomato"
  },
  "@media screen and (max-width: 700px)": {
    "input": {
      "font-size": "14pt"
    }
  }
};
var whitelist = [ 'font-size', 'color' ];
var blacklist = [ 'background', 'display' ];

injectStylesheet.injectWithBlacklist(styles, blacklist);
injectStylesheet.injectWithWhitelist(styles, whitelist);
```

## Sanitization

### Selectors

Selectors are filtered for things such as `{}`, `@import`, etc.

### Keys

Keys are filtered based on whether or not a blacklist or whitelist was given. `injectStylesheet` will assume that its second parameter is a blacklist unless the third parameter is `true`, which will designate it as a whitelist. This listing is used to filter the given CSS properties for exclusion or inclusion.

### Values

Values are checked against usages of `url()`, `evaluate()`, and other potentially abused and powerful CSS functions.

## Browser Support

All modern browsers, and IE9+
