import xhr from 'mock-xhr';
import Router from 'more-router';
import polyfill from 'babel/polyfill';

// export class MockServerConfiguration {
//     constructor() {
//         this.configuration = new Map();
//     }
//     register({path, name='', method="GET", handler}) {
//         let m = this.configuration.get(path);
//         if (m === undefined) {
//             m = new NestedMap();
//             this.configuration.set(path, m);
//         }
//         m.set([name, method], handler);
//     }
//     mockServer() {
//         let server = new MockServer();
//         for (let path of configuration.keys()) {
//             let m = configuration.get(path);
//             let handler = 
//             for (let keys of m.keys()) {
                
//             }
//         }
//     }
    
// };

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

export class FakeServer extends xhr.server {
    constructor() {
        super();
        this.router = new Router();
    };
    register(path, handler, {method='GET'}) {
        
        this.router.addPattern(path, handler);
    }
    makeResponse(request) {
        let {value, stack, variables} = this.router.resolve(
            request.urlParts.path);
        if (stack.length > 0) {
            return new NotFoundResponse();
        }
        let result = value(variables, request);
        if (result === undefined || result === null) {
            return new NotFoundResponse();
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
