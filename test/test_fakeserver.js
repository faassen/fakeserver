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
            assert.deepEqual(value, {'animal': "chicken"});
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
            assert.deepEqual(value, {'animal': "chicken"});
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
        $.getJSON('something_else').fail(function(req) {
            assert.equal(req.status, 404);
            done();
        });
        server.stop();
    })
    test("POST request", function(done) {
        let server = new FakeServer();
        function handler(variables, request) {
            return JSON.stringify({'animal': variables.id});
        }
        server.register('animals/{id}', handler, {
            method: 'POST'
        });
        server.start();
        $.ajax({
            type: 'POST',
            url: 'animals/chicken',
            data: 'somedata',
            dataType: 'json'
        }).done(function(data) {
            assert.deepEqual(data, {'animal': 'chicken'});
            done();
        });
        server.stop();
    });
    test("POST request means no GET", function(done) {
        let server = new FakeServer();
        function handler(variables, request) {
            return JSON.stringify({'animal': variables.id});
        }
        server.register('animals/{id}', handler, {
            method: 'POST'
        });
        server.start();
        $.ajax({
            type: 'GET',
            url: 'animals/chicken',
            data: 'somedata',
            dataType: 'json'
        }).fail(function(req) {
            assert.equal(req.status, 405);
            done();
        });
        server.stop();
    });

});

