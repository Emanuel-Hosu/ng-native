---
'__default__': minor
---

`<native-tab>` takes `role="search"` and `automaticallyActivatesSearch`, which make a tab the tab bar's search tab on iOS 26.1 and later: a `UISearchTab`, drawn as a circular button at the trailing end of the bar. An app built with the iOS 27 SDK needs it for that button, since `systemItem="search"` alone draws an ordinary item there. Both need react-native-screens 4.29 or later; with an older one they do nothing.
