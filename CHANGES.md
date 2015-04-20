0.3
===

* It turns out fakefetch functions need to return a promise instead of
  a value. This is because otherwise it cannot deal with the request
  body, which in the fetch API is also a promise.

0.2
===

* Renamed 'Response' to 'FakeResponse' so as not to clash with Response from
  fetch API.

* Introduced `FakeFetch`, which is like `FakeServer` but creates a
  `FakeFetch` object. Calling the `getFetch()` method on it gives you
  a simple mock `fetch`.
