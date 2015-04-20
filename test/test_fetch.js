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
        fallback: notFoundHandler
    },
    {
        name: 'method',
        defaultKey: 'GET',
        fallback: methodNotAllowedHandler
    }
];

suite("fakeserver fetch", function() {
    test("responds to GET request", function(done) {
        let server = new FakeFetch(keySpec);
        function handler(variables, request) {
            return new FakeResponse(JSON.stringify({'animal': variables.id}));
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
            return JSON.stringify({'animal': variables.id});
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
            return new FakeResponse(JSON.stringify({'animal': variables.id}));
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
            return JSON.stringify({'animal': variables.id});
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
            return JSON.stringify({'animal': variables.id});
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

});

