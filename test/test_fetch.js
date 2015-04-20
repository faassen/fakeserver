import chai from 'chai';
import {FakeFetch, FakeResponse,
        notFoundHandler, methodNotAllowedHandler} from '../src/fakeserver';
import {json} from '../src/jsonfetch';

let assert = chai.assert;

let keySpec = [
    {
        name: 'name',
        defaultKey: '',
        extract: request => request.viewName,
        fallback: (variables, request) => Promise.resolve(notFoundHandler(variables, request))
    },
    {
        name: 'method',
        defaultKey: 'GET',
        fallback: (variables, request) => Promise.resolve(methodNotAllowedHandler(variables, request))
    }
];

suite("fakeserver fetch", function() {
    test("responds to GET request", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return Promise.resolve(new FakeResponse(JSON.stringify({'animal': variables.id})));
        }
        server.register('animals/{id}', handler);

        const fetch = server.getFetch();

        fetch('/animals/chicken').then(json).then(function(value) {
            assert.deepEqual(value, {'animal': "chicken"});
            done();
        });
    })
    test("responds to GET request with body directly", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return Promise.resolve(JSON.stringify({'animal': variables.id}));
        }
        server.register('animals/{id}', handler);

        const fetch = server.getFetch();

        fetch('/animals/chicken').then(json).then(function(value) {
            assert.deepEqual(value, {'animal': "chicken"});
            done();
        });
    })

    test("404", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return new Promise.resolve(FakeResponse(JSON.stringify({'animal': variables.id})));
        }
        server.register('animals/{id}', handler);

        const fetch = server.getFetch();

        fetch('/something_else').then(function(response) {
            assert.equal(response.status, 404);
            done();
        });
    })
    test("POST request", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return Promise.resolve(JSON.stringify({'animal': variables.id}));
        }
        server.register('animals/{id}', handler, {
            method: 'POST'
        });

        const fetch = server.getFetch();

        fetch(
            '/animals/chicken',
            {
                method: 'POST',
            }).then(json).then(function(data) {
            assert.deepEqual(data, {'animal': 'chicken'});
            done();
        });
    });
    test("POST request means no GET", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return Promise.resolve(JSON.stringify({'animal': variables.id}));
        }
        server.register('animals/{id}', handler, {
            method: 'POST'
        });

        const fetch = server.getFetch();

        fetch('/animals/chicken').then(function(response) {
            assert.equal(response.status, 405);
            done();
        });
    });
    test("POST request with JSON body", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return request.json().then(JSON.stringify);
        }
        server.register('animals/{id}', handler, {
            method: 'POST'
        });

        const fetch = server.getFetch();

        fetch(
            '/animals/chicken',
            {
                method: 'POST',
                body: JSON.stringify({
                    foo: 'bar'
                })
            }).then(json).then(function(data) {
            assert.deepEqual(data, {'foo': 'bar'});
            done();
        });
    });
});

