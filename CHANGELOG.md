# Release notes

## 1.4.1

### Documentation

- Restore and expand TabContent DocBlocks for all methods, including the
  constructor, with parameter, return, validation, and lifecycle documentation.
- Document public state shapes and callback behavior with JSDoc typedefs.
- Regenerate distribution bundles and source maps. Executable behavior and
  public API are unchanged from 1.4.0.

### Publishing

The patch package version and Git tag are both `1.4.1`. If npm authentication
is unavailable, an authorized maintainer must run `npm publish --access public`
from this tagged commit.

## 1.4.0

### TabContent

- Add vertical Up/Down navigation and honor authored `aria-orientation`, while
  retaining horizontal Left/Right defaults and manual Enter/Space activation.
- Maintain coherent tab/tablist/tabpanel roles on desktop and native button/
  labelled region semantics in accordion mode, including visibility and focus.
- Preserve the active item across responsive transitions.
- Add opt-in `accordion.singleOpen` (default `false`) and
  `accordion.collapsible` (default `true`).
- Preserve fractional breakpoint precision across browsers. The existing
  inclusive minimum-width default remains `768`; use `768.0001` for accordion
  through 768px and tabs above it.
- Add `getState()` and synchronous `onChange` notifications after initialization,
  state/layout changes, and destruction for lazy video iframe lifecycle.
- Make repeated init/destroy safe; restore authored DOM and remove responsive
  listeners and generated state.

### Compatibility and validation

- Existing exports, default horizontal/manual keyboard interaction, expanded
  class names, integer breakpoint boundary, and multi-open/collapsible accordion
  defaults remain unchanged. Mobile tab roles and invalid ARIA are corrected.
- Menu and the other components are unchanged. Browser regressions cover a
  SurfMenu-style subclass with custom selectors and inherited Menu behavior.
- Add Playwright tests for Chromium, Firefox, and WebKit and package ESM/UMD/
  minified build smoke tests. Run `npx playwright install chromium firefox webkit`,
  `npm run build`, and `npm test` after `npm ci`.

### Publishing

The release version and Git tag are both `1.4.0`. npm publication requires valid
publish credentials for `@atendesign/javascript-components`. If authentication
is unavailable, this tag is release-ready but is not available on npm until an
authorized maintainer runs `npm publish --access public` from the tagged commit.
