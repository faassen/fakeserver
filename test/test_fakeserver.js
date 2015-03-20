import chai from 'chai';
import $ from 'jquery';
import FakeServer from '../src/fakeserver';

let assert = chai.assert;

suite("fakeserver", function() {
    test("basic", function(done) {

        let server = new FakeServer();
        function handler(variables, request) {
            return [200, {'Content-Type': 'application/json'},
                    JSON.stringify({'animal': variables.id})];
        }
        server.register('animals/{id}', handler);

        server.start();
        $.getJSON('animals/chicken').done(function(value) {
            assert.deepEqual({'animal': "chicken"}, value);
            done();
        });
    })
});

