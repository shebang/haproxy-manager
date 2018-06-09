'use strict';

const Debug = require('debug')('haproxy-manager:ssh-connection');
const Utils = require('./utils')();

const defaultOptions = {
    ssh: {
        port: 22
    },
    sshProxy: {},
    exec: {
        socketPath: '/var/run/haproxy/haproxy.sock',
        useSudo: true
    }
};

const internals = {

    // must be set via DI
    Ssh2: null
};


/* SshConnection
 *
 * inspired from https://github.com/sanketbajoria/ssh2-promise/blob/master/src/sshConnection.ts
 *
 * */

internals.SshConnection = class {

    /**
     * @description
     * Creates a new SSH Connection (lazy)
     *
     * @param {Object} options
     * @param {Object} options.ssh       SSH2 options
     * @param {Object} options.sshProxy  SSH2 options for proxying
     * @param {Object} options.exec      execution options
     * @param {Boolean} options.exec.useSudo  use sudo when excuting socat
     * @param {Boolean} options.exec.socketPath  path to haproxy unix domain socket
     *
     * options.ssh and options.sshProxy can contain any valid ssh2 property
     */

    constructor(options) {

        this.execOptions = Object.assign({}, defaultOptions.exec, options.exec);
        this.sshConfig = Object.assign({}, defaultOptions.ssh, options.ssh);
        this.sshProxyConfig = Object.assign({}, defaultOptions.sshProxy, options.sshProxy);
        /*console.log('SSH connection options - execOptions\n', this.execOptions);
        console.log('SSH connection options - sshConfig\n', this.sshConfig);
        console.log('SSH connection options - sshProxyConfig\n', this.sshProxyConfig);*/

        if (!this.sshConfig.host || !this.sshConfig.username) {

            throw new Error('invalid options');
        };

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

            this.sshClient = new internals.Ssh2.Client();

            this.sshClient.on('ready', (err) => {


                if (err) {
                    this.__connectPromise = null;
                    return reject(err);
                };

                Debug('connection successfully established');
                this.__retries = 0;
                // FIXME: what to return in resolve?
                resolve(this);
            }).connect(this.sshConfig);
        });

        return this.__connectPromise;
    };

    disconnect() {

        return new Promise((resolve, reject) => {

            Debug('self.sshClient.disconnect');
            this.sshClient.end();
            resolve();
        });
    };


    exec(cmd) {

        const self = this;
        const shellCommand = Utils.createHaproxyCommand(cmd, this.execOptions.useSudo, this.execOptions.socketPath);
        return this.connect().then(() => {

            return new Promise((resolve, reject) => {

                self.sshClient.exec(shellCommand, (err, stream) => {

                    if (err) {
                        Debug('self.sshClient.exec: err', err);
                        return reject(err);
                    }

                    let buffer = '';
                    let bufferErr = '';

                    const onData = (data) => {

                        Debug('self.sshClient.exec: on.data', data);
                        buffer += data;

                    };
                    stream.on('close', (code, signal) => {

                        Debug('self.sshClient.exec: on.close code: ' + code + ', signal: ' + signal);
                        if (bufferErr) {
                            Debug('self.sshClient.exec: on.close reject stderr: ' + bufferErr);
                            reject(bufferErr);
                        }
                        else {
                            Debug('self.sshClient.exec: on.close resolve: ' + buffer);
                            resolve(buffer);
                        };
                    }).on('data', (onData)).on('end', () => {

                        Debug('self.sshClient.exec: on.end');
                        // be extra sure all data is received by 'end'
                        // https://github.com/mscdex/ssh2/issues/666
                        stream.removeListener('data', onData);

                    }).stderr.on('data', (data) => {

                        Debug('self.sshClient.exec: stderr.on.data', data);
                        bufferErr += data;
                    });
                });
            });
        });
    };
};

module.exports = (Ssh2) => {

    internals.Ssh2 = Ssh2;
    return internals.SshConnection;
};
