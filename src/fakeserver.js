import xhr from 'mock-xhr';
import {Publisher} from 'more-router';
import polyfill from 'babel/polyfill';

export class Response {
    constructor(body, status=200, headers=null) {
        if (headers === null) {
            headers = {'Content-Type': 'application/json'};
        }
        this.status = status;
        this.headers = headers;
        this.body = body;
    }
    execute(request) {
        for (let key of Object.keys(this.headers)) {
            request.setResponseHeader(key, this.headers[key]);
        }
        request.receive(this.status, this.body);
    }
};

export class NotFoundResponse extends Response {
    constructor() {
        super('Not Found', 404, {'Content-Type': 'text/plain'});
    }
};

export function notFoundHandler(variables, request) {
    return new NotFoundResponse();
}

export function methodNotAllowedHandler(variables, request) {
    return new Response('Method not allowed', 405,
                        {'Content-Type': 'text/plain'});
}

export class FakeServer extends xhr.server {
    constructor(keySpec) {
        super();
        this.publisher = new Publisher(keySpec);
    };

    register(path, handler, keyObj=null) {
        if (keyObj === null) {
            keyObj = {};
        }
        this.publisher.register(path, keyObj, handler);
    }
    makeResponse(request) {
        let result = this.publisher.resolve(request.urlParts.path, request);
        if (result === null) {
            return notFoundHandler({}, request);
        }
        if (result instanceof Response) {
            return result;
        }
        return new Response(result);
    }
    handle(request) {
        let response = this.makeResponse(request);
        response.execute(request);
    }
};
