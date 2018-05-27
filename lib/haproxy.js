'use strict';

const Debug = require('debug')('haproxy-manager:haproxy');
//const Parser = require('./parser.js')();
//const Config = require('config');

const internals = {

};
exports = module.exports = internals.Haproxy = class {

    constructor(options) {

        const module = './connector/ssh.js';
        const Connector = require(module);

        this.host = options.host;
        this.connectorOptions = options.connectorOptions;
        this.connectorOptions.host = options.host;
        this.connector = new Connector(this.connectorOptions);
    }

    connect() {

        return this.connector.connect();
    };

    disconnect() {

        return this.connector.disconnect();
    };


    showServersState() {

        return this.connector.showServersState();
    };

    showStat() {

        return this.connector.showStat();
    };

    showInfo() {

        return this.connector.showInfo();
    };


    batch(commands) {

        return Promise.all(commands.map((command) => {

            const c = this[command]();
            return c;
        })

        );
    };

    debugResult(result) {

        return new Promise((resolve) => {

            Debug('RESULT:', result.toString('utf8'));
            resolve();
        });
    };
};

