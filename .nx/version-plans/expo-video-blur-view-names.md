---
__default__: patch
---

`registerExpoViews('expo-video')` registers `SurfaceVideoView` on Android, which is what `expo-video` names its view there, and `registerExpoViews('expo-blur')` registers the `ExpoBlur` module's `ExpoBlurView`. Before, Android stopped with "Can't find ViewManager 'ViewManagerAdapter_ExpoVideo_VideoView'" the first time a video showed, and there is no `ExpoBlurView` module to find. `registerExpoView`'s `viewName` takes `{ ios, android }` for a view named differently on each platform.

`videoPlayer()` gives the player's shared-object `id`, which is what `<expo-video [player]>` takes: bound to `player.native`, the view had no player and drew nothing, while the video kept playing with nothing on screen. Bind `[player]="player.id"`.
