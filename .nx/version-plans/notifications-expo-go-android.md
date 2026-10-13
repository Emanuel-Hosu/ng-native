---
__default__: patch
---

`Notifications` starts in Expo Go on Android. `expo-notifications` throws there from `addPushTokenListener`, since push left Expo Go on Android with SDK 53, and that made injecting the service throw, even in an app that never asks for a push token. The other listeners, local notifications and the permission work as before; `devicePushToken` stays null.
