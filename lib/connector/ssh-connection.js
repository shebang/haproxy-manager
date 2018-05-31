'use strict';

const Debug = require('debug')('haproxy-manager:ssh-connection');
//const EventEmitter = require('events');
const SshClient = require('ssh2').Client;

const defaultOptions = {
    port: 22
};

/* SshConnection
 *
 * inspired from https://github.com/sanketbajoria/ssh2-promise/blob/master/src/sshConnection.ts
 *
 * */

exports = module.exports = class SshConnection {

    constructor(options, ssh2Mock) {

        if (!options || !options.host || !options.username) {

            throw new Error('invalid options');
        }

        this.__ssh2Mock = ssh2Mock || null;

        this.sshConfig = Object.assign({}, defaultOptions, options);
        this.__connectPromise = null;
        this.__retries = 0;
        this.__err = null;

    };

    connect() {

        ++this.__retries;

        if (this.__connectPromise !== null) {

            Debug('already connected');
            return this.__connectPromise;
        };

        this.__connectPromise = new Promise((resolve, reject) => {

            if (this.__ssh2Mock) {
                this.sshClient = new this.__ssh2Mock();
            }
            else {
                this.sshClient = new SshClient();
            };

            this.sshClient.on('ready', (err) => {


                if (err) {
                    this.__connectPromise = null;
                    return reject(err);
                };

                Debug('connection successfully established');
                this.__retries = 0;
                this.__err = null;
                resolve(this);
            }).connect(this.sshConfig);
        });

        return this.__connectPromise;
    };

    disconnect() {

        return new Promise((resolve, reject) => {

            this.sshClient.end();
            resolve();
        });
    };


    exec(cmd) {

        const self = this;
        debugger;
        return this.connect().then(() => {

            return new Promise((resolve, reject) => {

                self.sshClient.exec(cmd, (err, stream) => {

                    if (err) {
                        return reject(err);
                    }
                    let buffer = '';
                    stream.on('close', (code, signal) => {

                        resolve(buffer);
                    }).on('data', (data) => {

                        buffer += data;
                    }).stderr.on('data', (data) => {

                        reject(Error(data));
                    });
                });
            });
        });
    };
};
