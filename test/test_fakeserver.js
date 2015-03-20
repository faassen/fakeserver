import chai from 'chai';
import $ from 'jquery';
import {FakeServer, Response} from '../src/fakeserver';

let assert = chai.assert;

suite("fakeserver", function() {
    test("responds to GET request", function(done) {
        let server = new FakeServer();
        function handler(variables, request) {
            return new Response(JSON.stringify({'animal': variables.id}));
        }
        server.register('animals/{id}', handler);

        server.start();
        $.getJSON('animals/chicken').done(function(value) {
            assert.deepEqual({'animal': "chicken"}, value);
            done();
        });
        server.stop();
    })
    test("responds to GET request with body directly", function(done) {
        let server = new FakeServer();
        function handler(variables, request) {
            return JSON.stringify({'animal': variables.id});
        }
        server.register('animals/{id}', handler);

        server.start();
        $.getJSON('animals/chicken').done(function(value) {
            assert.deepEqual({'animal': "chicken"}, value);
            done();
        });
        server.stop();
    })

    test("404", function(done) {
        let server = new FakeServer();
        function handler(variables, request) {
            return new Response(JSON.stringify({'animal': variables.id}));
        }
        server.register('animals/{id}', handler);

        server.start();
        $.getJSON('something_else').fail(function() {
            done();
        });
        server.stop();
    })

});

