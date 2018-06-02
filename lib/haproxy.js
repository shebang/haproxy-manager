'use strict';

//const Debug = require('debug')('haproxy-manager:haproxy');

const defaultOptions = {

    connectorName: 'local',
    host: 'localhost',
    connectorOptions: {}
};

const internals = {

};

exports = module.exports = internals.Haproxy = class {

    constructor(options) {

        const localOptions = Object.assign({}, defaultOptions, options);

        this.host = localOptions.host;
        this.connectorOptions = localOptions.connectorOptions;
        this.connectorOptions.host = this.host;
        this.connectorName = localOptions.connectorName;

        if (localOptions.connector) {

            this.connector = new localOptions.connector(this.connectorOptions);
        }
        else  {

            const Connector = require('./connector/' + this.connectorName);
            this.connector = new Connector(this.connectorOptions);
        };
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

    batch(commands) {

        return Promise.all(commands.map((command) => {

            const c = this[command]();
            return c;
        })

        );
    };

};

