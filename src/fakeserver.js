import xhr from 'mock-xhr';
import {Publisher} from 'more-router';
import polyfill from 'babel/polyfill';

export class FakeResponse {
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
    fetchResponse() {
//        return new Promise((resolve, reject) => {
            return new Response(this.body, { status: this.status,
                                             headers: this.headers });
//        });
    }
};

export class NotFoundResponse extends FakeResponse {
    constructor() {
        super('Not Found', 404, {'Content-Type': 'text/plain'});
    }
};

export function notFoundHandler(variables, request) {
    return new NotFoundResponse();
}

export function methodNotAllowedHandler(variables, request) {
    return new FakeResponse('Method not allowed', 405,
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
        if (result instanceof FakeResponse) {
            return result;
        }
        return new FakeResponse(result);
    }
    handle(request) {
        let response = this.makeResponse(request);
        response.execute(request);
    }
};

export class FakeFetch {
    constructor(keySpec) {
        this.publisher = new Publisher(keySpec);
    }

    register(path, handler, keyObj=null) {
        if (keyObj === null) {
            keyObj = {};
        }
        this.publisher.register(path, keyObj, handler);
    }
    getFetch() {
        return (uri, init) => {
            if (init === undefined) {
                init = {};
            }
            const u = new URL(uri, window.location);
            const request = new Request(uri, init);

            const p = this.publisher.resolve(u.pathname, request);
            if (p === null) {
                return Promise.resolve(notFoundHandler({}, request));
            }
            return p.then(r => {
                let response = null;
                if (r === null) {
                    response = notFoundHandler({}, request);
                } else if (r instanceof FakeResponse) {
                    response = r;
                } else {
                    response = new FakeResponse(r);
                }
                return response.fetchResponse();
            });
        };
    }
};
