'use strict';

const getBackendServers = (backendName) => {

    let retval;

    if (backendName === 'web') {
        retval = [
            { name: 'www1', address: '10.0.1.1', port: 80, param: {}  },
            { name: 'www2', address: '10.0.1.2', port: 80, param: {}  },
            { name: 'www3', address: '10.0.1.3', port: 80, param: {}  }
        ];
    }
    else if (backendName === 'service') {
        retval = [
            { name: 'service1', address: '10.0.2.1', port: 80, param: {}  },
            { name: 'service2', address: '10.0.2.2', port: 80, param: {}  },
            { name: 'service3', address: '10.0.2.3', port: 80, param: {}  }
        ];
    }
    return Promise.resolve(retval);
};

/*
 * @returns {Array}
 **/

const getPeers = () => {

    return Promise.resolve([
        { peername: 'server1', ip: '10.0.0.1', port: 7777 },
        { peername: 'server2', ip: '10.0.0.2', port: 7777 },
        { peername: 'server3', ip: '10.0.0.2', port: 7777 }
    ]);
};


exports.provider = {

    name: 'demoProvider1',
    version: '1.0',
    register: async (options) => {

        //console.log(options);
        await Promise.resolve('initialization done');
        return Promise.resolve({

            getBackendServers,
            getPeers
        });
    }
};
