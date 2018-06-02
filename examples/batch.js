'use strict';

const Path = require('path');
const Haproxy = require('../lib/haproxy.js');
const pathSshKey = Path.join(__dirname, '../test/docker/dummy-ssh-keys/test-user');

const validOptions = {
    host: 'localhost',
    connectorName: 'ssh',
    connectorOptions: {
        sshConfig: {
            port: 3022,
            username: 'test-user',
            privateKey: require('fs').readFileSync(pathSshKey)
        }
    }
};

const getData = async () => {

    try {
        const haproxy = new Haproxy(validOptions);
        const result = await haproxy.batch(['showStat', 'showServersState']);
        result.map((r) => {

            console.log('BATCH RESULT\n');
            if (r.serversState) {

                console.log('serversState: be_name: ' + r.serversState[0].be_name + ' srv_addr: ' + r.serversState[0].srv_addr);
            }
            else if (r.stat) {

                console.log('stat: pxname: ' + r.stat[0].pxname + ' svname: ' + r.stat[0].svname);
            };

        });
        await haproxy.disconnect();
    }
    catch (err) {

        console.log('ERROR:', err);

    };
};

setInterval(() => {

    getData();
},1000);
