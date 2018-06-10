'use strict';

const Debug = require('debug')('haproxy-manager:socket-connection');

exports = module.exports = class SocketConnection {

    constructor(socket, options) {

        if (!socket) {
            throw Error('invalid options');
        }

        this.socket = socket;
        this.__connectPromise = null;
        this.__retries = 0;
    };

    connect() {

        ++this.__retries;

        if (this.__connectPromise !== null) {

            Debug('already connected');
            return this.__connectPromise;
        };

        this.__connectPromise = new Promise((resolve, reject) => {

            this.socket.on('connect', (err) => {

                if (err) {
                    this.__connectPromise = null;
                    return reject(err);
                };

                Debug('connection successfully established');
                this.__retries = 0;
                // FIXME: what to return in resolve?
                resolve(this);
            });
        });

        return this.__connectPromise;
    };

    disconnect() {

        return new Promise((resolve, reject) => {

            Debug('self.client.disconnect');
            this.socket.end();
            resolve();
        });
    };

    exec(cmd) {

        Debug('socket-connection: exec: cmd=' + cmd);
        const self = this;
        return this.connect().then(() => {

            return new Promise((resolve, reject) => {

                Debug('socket-connection: exec promise' + cmd);

                self.socket.on('data', (data) => {

                    resolve(data);

                }).on('error', (data) => {

                    reject(data);
                });

                self.socket.write(cmd + '\r\n');
            });
        });
    };
};
