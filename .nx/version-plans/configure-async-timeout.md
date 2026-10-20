---
__default__: patch
---

`configure({ asyncUtilTimeout })` and `resetToDefaults()` from `@ng-native/testing` set how long `waitFor`, every `findBy*` query and `waitForElementToBeRemoved` keep trying when a call passes no `timeout`, as in React Native Testing Library.

The default is still 1000 milliseconds, and a `timeout` a call passes still wins.
