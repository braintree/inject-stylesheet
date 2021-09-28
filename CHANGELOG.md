# 5.0.0

- Patch exploit where additional CSS rules could be inserted by
  appending them to a rule's value with `&`, `<` or `>`

_Breaking Changes_

- No longer allow `\` in values for CSS rules
- No longer allow `<` or `>` in values for CSS rules

# 4.0.0

_Breaking Changes_

- Ignore `DOMException` errors when calling `insertRule` while
  inserting stylesheet

# 3.0.0

- Add typescript types

_Breaking Changes_

- drop IE8 support
- Throw any errors that are not `SyntaxError` when calling
  `insertRule` while inserting stylesheet

# 2.0.0

_Breaking Changes_

- change `injectWithBlacklist` to `injectWithBlocklist`
- change `injectWithWhitelist` to `injectWithAllowlist`

# 1.0.0

- Initial release
