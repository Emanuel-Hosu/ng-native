---
__default__: patch
---

`DeepLinks` reads `/--/` as Expo Go's launch prefix only in a url's path. One in a query or a fragment cut the link there, so `https://example.com/search?q=/--/x` reached the router as `/x` and `myapp://notes?q=a/--/b` as `/b`.
