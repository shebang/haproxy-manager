'use strict';
const Debug = require('debug')('haproxy-manager:connection-manager');

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
    SshConnection: null,
    SocketConnection: null,
    Response: null

};


internals.ConnectionManager = class {

    constructor(options) {

        this.connection = internals.ConnectionManager.createConnector(
            options
        );
    }

    static createConnector(options) {

        Debug('createConnector: options:', options);
        let connection;
        let socket;

        const localOptions = Object.assign({}, defaultOptions, options);

        if (localOptions.connection.unix) {
            socket = internals.Net.createConnection(localOptions.connection.unix.socketPath);
            connection = new internals.SocketConnection(socket, localOptions);
        }
        else if (localOptions.connection.tcp) {
            socket = internals.Net.createConnection(localOptions.connection.tcp.port, localOptions.connection.tcp.host);
            connection = new internals.SocketConnection(socket, localOptions);
        }
        else if (localOptions.connection.ssh) {
            connection = new internals.SshConnection({
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

        return internals.Response.createResponse(this.connection.exec('show servers state'), 'serversState', {
            csvDelimiter: ' ',
            rawDataOffset: 1
        });
    };

    showStat() {

        return internals.Response.createResponse(this.connection.exec('show stat'), 'stat');
    };

};

module.exports = (Net, SshConnection, SocketConnection, Response) => {

    internals.Net = Net;
    internals.SshConnection = SshConnection;
    internals.SocketConnection = SocketConnection;
    internals.Response = Response;
    return internals.ConnectionManager;
};
