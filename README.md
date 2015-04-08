fakeserver
==========

Introduction
------------

fakeserver is a little framework that lets you implement a web server while
you really do not: the fake server runs in the browser and no real server
is involved. It does this by replacing XMLHTTPRequest with an object
that completely handles your requests on the client.

fakeserver is built on more-router and mock-xhr.

Usage
-----

```javascript
  import {FakeServer, Response,
          methodNotAllowedHandler, notFoundHandler} from 'fakeserver';

  // when looking up a handler we do it by using
  // last bit of the URL that wasn't handled
  // by the router (the viewName, set by fakeserver, may also be empty),
  // and by request.method
  let keySpec = [
    {
        name: 'name',
        defaultKey: '',
        extract: request => request.viewName,
        fallback: notFoundHandler
    },
    {
        name: 'method',
        defaultKey: 'GET',
        fallback: methodNotAllowedHandler
    }
  ];

  let fakeserver = new FakeServer(keySpec);

  function handler(variables, request) {
      // construct a Response object with a JSON content-type and 200 OK
      // This is the default: you can pass in the status and response headers
      // as extra arguments to the Response constructor
      return new Response(JSON.stringify({animal: animals.id}));
  }

  // register it for a path, and for GET and empty view name by default
  fakeserver.register('animals/{id}', handler);

  // this is how to handle a PUT request:
  // fakeserver.register('animals/{id}', { method: 'PUT'});

  // override default XMLHTTPRequest
  fakeserver.start();

  // now all XMLHTTPRequests are handled by fakeserver

  // go back to the original XMLHTTPRequest, disable fake server again
  fakeserver.stop();
```
