---
__default__: patch
---

On iOS, `SvgImages.render()` no longer asks react-native-svg for a view that is not mounted yet, which showed a red box in development (`Invalid svg returned from registry, expecting RNSVGSvgView, got: (null)`) and left a release build's tab icon missing after three seconds.

Fabric mounts a commit on the main thread after the JavaScript task that made it, and `render()` asked for the view from inside that task. iOS finds no view then, and react-native-svg logs an error and never calls back rather than retrying. `render()` now asks a frame after the commit, once the view is mounted. Android already waited for the view, and is asked a frame later too. Fixes #986.
