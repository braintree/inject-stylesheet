# CHANGELOG

## UNRELEASED

- Update dependencies
  - @types/jest to 30.0.0
  - eslint to 8.57.1
  - jest to 30.2.0
  - prettier to 3.7.4
  - ts-jest to 29.4.6
  - typescript to 5.9.3
- Update Node to v24

## 7.0.0

_Breaking Changes_

- Added logic to block `@-rule` selectors and values, excepting `@media`

## 6.0.2

- Update (sub-)dependencies
  - cross-spawn to 7.0.6
  - micromatch to 4.0.8

## 6.0.1

- Updates braces to 3.0.3

## 6.0.0

- Update to node v18

- Dev Dependency Updates
  - Update to TypeScript 5
  - Update prettier to next major version
  - Update eslint-plugin-prettier to next major version
  - Other minor dependency updates

## 5.0.0

- Patch exploit where additional CSS rules could be inserted by
  appending them to a rule's value with `&`, `<` or `>`

_Breaking Changes_

- No longer allow `\` in values for CSS rules
- No longer allow `<` or `>` in values for CSS rules

## 4.0.0

_Breaking Changes_

- Ignore `DOMException` errors when calling `insertRule` while
  inserting stylesheet

## 3.0.0

- Add typescript types

_Breaking Changes_

- drop IE8 support
- Throw any errors that are not `SyntaxError` when calling
  `insertRule` while inserting stylesheet

## 2.0.0

_Breaking Changes_

- change `injectWithBlacklist` to `injectWithBlocklist`
- change `injectWithWhitelist` to `injectWithAllowlist`

## 1.0.0

- Initial release
