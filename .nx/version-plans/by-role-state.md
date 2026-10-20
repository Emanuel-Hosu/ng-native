---
__default__: patch
---

`ByRole` in `@ng-native/testing` takes `disabled`, `selected`, `checked`, `busy` and `expanded`, as React Native Testing Library's does, so `findByRole('button', { name, disabled: false })` waits for the button to be enabled.

A state is read from the node's `accessibilityState`, which the components and the `aria-*` attributes write. When nothing sets a state, its value is false for `disabled`, `selected` and `busy`, and unset for `checked` and `expanded`; `checked` counts only on a `checkbox`, `radio` or `switch`. A `<text-input>` with `editable` false is disabled.
