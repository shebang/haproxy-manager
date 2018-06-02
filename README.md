# HAProxy Manager

**WORK IN PROGRESS - NOT READY OR USABLE YET!**

[![Build Status](https://travis-ci.org/waelse72/haproxy-manager.svg?branch=master)](https://travis-ci.org/waelse72/haproxy-manager)
[![Test Coverage](https://api.codeclimate.com/v1/badges/23279385b3b0a9064739/test_coverage)](https://codeclimate.com/github/waelse72/haproxy-manager/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/waelse72/haproxy-manager/maintainability)

HAProxy manager is a node module for orchestrating an HAProxy instance.

## Example Usage using SSH Connector

```javascript
const Path = require('path');
const HaproxyManager = require('..');

const pathSshKey = Path.join(__dirname, '../test/docker/dummy-ssh-keys/test-user');

const validOptions = {
    host: 'localhost',
    connectorName: 'ssh',
    connectorOptions: {
        // mscdex/ssh2 options
        sshConfig: {
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
        console.log(response.data());

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
        console.log(filteredData);

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
## Query API

You can use the `response.query` method to filter and transform data received by an HAProxy API call.
See the [jsonata](https://github.com/jsonata-js/jsonata) documentation for writing query expressions.


## Development Notes

### Docker Test Environment

For integration testing there is a docker test environment provided which is located in the folder [test/docker](test/docker).

### Testing SSH Container

```
# ssh into container
ssh test-user@localhost -i test/docker/dummy-ssh-keys/test-user -p 3022 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no"
# query haproxy inside container
sudo sh -c 'echo "help" | socat /var/run/haproxy/haproxy.sock stdio'
```

