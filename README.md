# HAProxy Manager

**THIS IS WORK IN PROGRESS - NOT STABLE YET**

[![Build Status](https://travis-ci.org/shebang/haproxy-manager.svg?branch=master)](https://travis-ci.org/shebang/haproxy-manager)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dfd55f1efe23a006e412/test_coverage)](https://codeclimate.com/github/shebang/haproxy-manager/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/dfd55f1efe23a006e412/maintainability)](https://codeclimate.com/github/shebang/haproxy-manager/maintainability)

HAProxy manager is a node module for orchestrating an HAProxy instance.

## Implemented Functionality

### Reading from HAProxy

* show servers state
* show stat

## Example Usage using SSH Connector

see: [examples/query-api.js](examples/query-api.js)
```javascript
const Path = require('path');
const HaproxyManager = require('haproxy-manager');

const pathSshKey = Path.join(__dirname, '../test/docker/dummy-ssh-keys/test-user');

const validOptions = {
    connection: {
        // mscdex/ssh2 options
        ssh: {
            host: 'localhost',
            port: 3022,
            username: 'test-user',
            privateKey: require('fs').readFileSync(pathSshKey)
        }
    }
};

(async () => {

    try {
        const haproxy = new HaproxyManager.Haproxy(validOptions);
        const response = await haproxy.showServersState();
        console.log('unfiltered data:\n', response.data());

        /* OUTPUT:
         *
         * { serversState:
         *   [ { be_id: '3',
         *       be_name: 'servers',
         *       srv_id: '1',
         *       ...... other fields
         *     }
         *   ]
         * }
         */

        const filteredData = response.query(`serversState.({
            "srv_name": $.srv_name,
            "srv_op_state": $.srv_op_state
        })`);
        console.log('filtered data:\n', filteredData);

        /*
         * OUTPUT:
         *
         * [ { srv_name: 'haproxy-manager-http-echo1', srv_op_state: '2' },
         *   { srv_name: 'haproxy-manager-http-echo2', srv_op_state: '2' },
         *   { srv_name: 'haproxy-manager-http-echo3', srv_op_state: '2' }
         * ]
         * */
        await haproxy.disconnect();
    }
    catch (err) {

        console.log('ERROR:', err);
    };
})();

```
## Connect via TCP

```javascript
    connection: {
        tcp: {
            host: 'somehost.example.com',
            port: 2938
        }
    }
};
```

## Connect via Local Unix Domain Socket

```javascript
    connection: {
        unix: {
            socketPath: '/var/run/haproxy/haproxy.sock'
        }
    }
};
```



## Query API

You can use the `response.query` method to filter and transform data received by an HAProxy API call.
See the [jsonata](https://github.com/jsonata-js/jsonata) documentation for writing query expressions.

**Example:**
```javascript
const response = await haproxy.showServersState();
const filteredData = response.query(`serversState.({
    "srv_name": $.srv_name,
    "srv_op_state": $.srv_op_state
})`);
console.log(filteredData);
```

**Result:**
```javascript
[
  { srv_name: 'haproxy-manager-http-echo1', srv_op_state: '2' },
  { srv_name: 'haproxy-manager-http-echo2', srv_op_state: '2' },
  { srv_name: 'haproxy-manager-http-echo3', srv_op_state: '2' }
]
```

## Development Notes
### Integration Test

I've started providing an integration test:

```
npm run integration-test
```

### Docker Test Environment

For integration testing there is a docker test environment provided which is located in the folder [test/docker](test/docker).

### Testing SSH Container

```
# ssh into container
ssh test-user@localhost -i test/docker/dummy-ssh-keys/test-user -p 3022 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no"
# query haproxy inside container
sudo sh -c 'echo "help" | socat /var/run/haproxy/haproxy.sock stdio'
```

