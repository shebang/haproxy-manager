'use strict';

const Haproxy = require('../lib/haproxy.js');

const validOptions = {
    host: 'localhost',
    connectorName: 'ssh',
    connectorOptions: {
        port: 3022,
        username: 'test-user',
        privateKey: require('fs').readFileSync('/Users/al/dev/haproxy-manager/test/docker/dummy-ssh-keys/test-user')
    }
};

const getData = async () => {

    try {
        const haproxy = new Haproxy(validOptions);
        const result = await haproxy.batch(['showStat', 'showServersState']);
        result.map((r) => {

            console.log('BATCH RESULT');
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
