'use strict';

const Debug = require('debug')('haproxy-manager:haproxy');
//const Parser = require('./parser.js')();
//const Config = require('config');


const defaultOptions = {

    connector: 'local',
    host: 'localhost',
    connectorOptions: {}
};

const internals = {

};

exports = module.exports = internals.Haproxy = class {

    constructor(options) {

        let localOptions;

        if (!options) {

            localOptions = defaultOptions;
        }
        else {
            localOptions = options;
        };

        this.connectorName = localOptions.connector || 'local';
        const Connector = require('./connector/' + this.connectorName);

        this.host = localOptions.host || 'localhost';
        this.connectorOptions = localOptions.connectorOptions || {};
        this.connectorOptions.host = this.host;
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

