---
__default__: minor
---

`Camera` records video: `record(options)` resolves with `{ uri }` once the recording stops, and `stopRecording()` stops it. Like `takePicture()`, they call the functions `expo-camera` defines on the view, with the view's tag, so no React ref is needed. The view needs `mode="video"`.
