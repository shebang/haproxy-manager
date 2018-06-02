'use strict';

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

