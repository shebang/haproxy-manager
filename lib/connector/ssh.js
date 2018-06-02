'use strict';
const SshConnection = require('./ssh-connection.js');
//const ConnectorBase = require('./connector-base.js');
const Response = require('../response.js');
const Utils = require('../utils.js')();

const defaultOptions = {

    sshConfig: {
        port: 22,
        host: 'localhost'
    },

    exec: {
        useSudo: true,
        haproxySocketPath: '/var/run/haproxy/haproxy.sock'
    }
};

const internals = {

};


exports = module.exports = internals.Ssh = class {

    constructor(options) {

        //super();

        const opts = Object.assign({}, defaultOptions, options);

        this.useSudo = opts.exec.useSudo;
        this.haproxySocketPath = opts.exec.haproxySocketPath;
        this.sshConfig = opts.sshConfig;
        this.sshConfig.host = opts.host;

        if (options.sshConnection) {
            this.sshConnection = options.sshConnection;
        }
        else {
            this.sshConnection = new SshConnection(this.sshConfig);
        }
    }

    /*connect() {

        return this.sshConnection.connect();
    };*/
    disconnect() {

        return this.sshConnection.disconnect();
    };


    showServersState() {

        return this.exec('show servers state', 'serversState', {
            csvDelimiter: ' ',
            rawDataOffset: 1
        });
    };

    showStat() {

        return this.exec('show stat', 'stat');
    };

    exec(cmd, indexName, options) {

        return new Promise((resolve, reject) => {

            const shellCommand = Utils.createHaproxyCommand(cmd, this.useSudo, this.haproxySocketPath);

            this.sshConnection.exec(shellCommand)
                .then((data) => {

                    resolve(Response.createResponse(data, indexName, options));
                });
        });
    };
};
