0.2
===

* Renamed 'Response' to 'FakeResponse' so as not to clash with Response from
  fetch API.

* Introduced `FakeFetch`, which is like `FakeServer` but creates a
  `FakeFetch` object. Calling the `getFetch()` method on it gives you
  a simple mock `fetch`.
