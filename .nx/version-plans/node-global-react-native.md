---
__default__: patch
---

An ICU plural or select, or an element inside an `i18n` message, renders on iOS and Android in a development build, where it threw `ASSERTION ERROR: The provided value must be an instance of a DOM Node` and drew nothing.

Angular's development checks test each node with `instanceof Node`. The Metro preset's polyfill defines a `Node` that recognises the engine's nodes, but React Native's `InitializeCore` runs after the polyfills and replaces the global with its own `Node`, which does not. `mount()` now makes whichever `Node` is on the global then answer `true` for engine nodes, and answer as before for every other value, as it already does for `Element`.
