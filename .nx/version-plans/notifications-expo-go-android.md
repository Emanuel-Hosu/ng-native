---
__default__: patch
---

An app that injects `Notifications` starts in Expo Go on Android, where it stopped on a red screen.

`expo-notifications` cannot be imported there: it subscribes to push tokens as it loads, and that throws in Expo Go on Android, which has had no push since Expo SDK 53. The service now runs with no module behind it there, as it does on the web: nothing is scheduled or received, the permission is never granted, and a warning in the console says so. Expo Go on iOS and a development build are as before.
