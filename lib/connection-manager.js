'use strict';
const Debug = require('debug')('haproxy-manager:connection-manager');
const Response = require('./response');

const defaultOptions = {

    connection: {
        unix: {
            socketPath: '/var/run/haproxy/haproxy.sock'
        }
    }
};

// define internals
const internals = {

    // must be set via DI
    Net: null,
    Ssh2: null

};


internals.ConnectionManager = class {

    constructor(options) {

        this.connection = internals.ConnectionManager.createConnector(
            options
        );
    }

    static createConnector(options) {

        Debug('createConnector: options:', options);
        let ConnectorClass;
        let connection;
        let socket;

        const localOptions = Object.assign({}, defaultOptions, options);

        if (localOptions.connection.unix) {
            ConnectorClass = require('./socket-connection');
            socket = internals.Net.createConnection(localOptions.connection.unix.socketPath);
            connection = new ConnectorClass(socket, localOptions);
        }
        else if (localOptions.connection.tcp) {
            ConnectorClass = require('./socket-connection');
            socket = internals.Net.createConnection(localOptions.connection.tcp.port, localOptions.connection.tcp.host);
            connection = new ConnectorClass(socket, localOptions);
        }
        else if (localOptions.connection.ssh) {
            ConnectorClass = require('./ssh-connection')(internals.Ssh2);
            connection = new ConnectorClass({
                ssh: localOptions.connection.ssh,
                exec: localOptions.connection.exec
            });
        }
        else {

            throw new Error('invalid options');

        };

        return connection;
    };
    /*connect() {

        return this.connection.connect();
    };*/
    disconnect() {

        return this.connection.disconnect();
    };


    showServersState() {

        return Response.createResponse(this.connection.exec('show servers state'), 'serversState', {
            csvDelimiter: ' ',
            rawDataOffset: 1
        });
    };

    showStat() {

        return Response.createResponse(this.connection.exec('show stat'), 'stat');
    };

};

module.exports = (Net, Ssh2) => {

    internals.Net = Net;
    internals.Ssh2 = Ssh2;
    return internals.ConnectionManager;
};
