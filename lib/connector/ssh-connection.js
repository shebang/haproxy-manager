'use strict';

const Debug = require('debug')('haproxy-manager:ssh-connection');
//const EventEmitter = require('events');
const SshClient = require('ssh2').Client;

const defaultOptions = {
    port: 22
};


//exports = module.exports = class SshConnection extends EventEmitter {
exports = module.exports = class SshConnection {


    constructor(options) {

        //super();
        this.sshConfig = Object.assign({}, defaultOptions, options);
        this.sshClient = new SshClient();
    };

    connect() {

        return new Promise((resolve, reject) => {

            this.sshClient.on('ready', function () {

                Debug('connection successfully established');
                resolve(this);
            }).connect(this.sshConfig);
        });
    };
    disconnect() {

        return new Promise((resolve, reject) => {

            this.sshClient.end();
            resolve();
        });
    };


    exec(cmd) {

        const self = this;
        return this.connect().then(() => {

            return new Promise((resolve, reject) => {

                self.sshClient.exec(cmd, (err, stream) => {

                    if (err) {
                        return reject(err);
                    }
                    let buffer = '';
                    stream.on('close', (code, signal) => {

                        resolve(buffer);
                        //self.sshClient.end();
                    }).on('data', (data) => {

                        buffer += data;
                    }).stderr.on('data', (data) => {

                        reject(data);
                    });
                });
            });
        });
    };
};
