'use strict';
//const Assert = require('assert');

const defaultOptions = {

    connection: {}
};

// define internals
const internals = {

    ConnectionManager: null,
    Joi: null
};
internals.Haproxy = class {

    constructor(options) {

        const localOptions = Object.assign({}, defaultOptions, options);

        this.connectionManager = new internals.ConnectionManager({
            connection: localOptions.connection
        });

        this.providers = {};
    }

    connect() {

        return this.connectionManager.connect();
    };

    disconnect() {

        return this.connectionManager.disconnect();
    };


    showServersState() {

        return this.connectionManager.showServersState();
    };

    showStat() {

        return this.connectionManager.showStat();
    };

    batch(commands) {

        return Promise.all(commands.map((command) => {

            const c = this[command]();
            return c;
        })

        );
    };

    _schedulePossiblePeersUpdate(newPeers) {

        //console.log(newPeers);
    };


    updatePeers(provider, groupName) {

        return new Promise((resolve, reject) => {

            provider.getPeers(groupName)
                .then((peers) => {

                    this._schedulePossiblePeersUpdate(peers);
                });
            resolve();
        });

    };

    /**
     * Registers a data provider for peers and servers.
     *
     * @param {Provider} provider module
     * @param {Object} options
     * @returns
     */
    async registerProvider(module, options) {

        const result = internals.Joi.validate(module.provider, internals.providerSchema);

        if (result.error) {
            throw new Error();
        };

        const funcs = await module.provider.register(options) || {};

        if (typeof funcs.getPeers !== 'function') {
            throw new Error('object returned by register does not have getPeers function');
        };

        if (typeof funcs.getBackendServers !== 'function') {
            throw new Error('object returned by register does not have getBackendServers function');
        };

        this.providers[module.provider.name] = Object.assign({}, funcs);
        this.providers[module.provider.name].name = module.provider.name;

    }

};

module.exports = (ConnectionManager, Joi) => {

    internals.ConnectionManager = ConnectionManager;
    internals.providerSchema = Joi.object().keys({

        name: Joi.string().regex(/^[a-zA-Z0-9_]+$/).required(),
        version: Joi.string().regex(/^[0-9\.]+$/).required(),
        register: Joi.func().required()
    });
    Joi = Joi;
    internals.Joi = Joi;
    return internals.Haproxy;
};
