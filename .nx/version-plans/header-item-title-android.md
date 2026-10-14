---
__default__: patch
---

A `<native-header-item type="title">` no longer crashes a screen on Android. It is committed as `center`: react-native-screens lists `title`, and iOS draws both as the title view, but Android's header throws `Unknown type title` while mounting the item, so a page with a custom title worked on iOS and crashed on Android as it opened.
