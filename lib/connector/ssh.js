'use strict';
const SshConnection = require('./ssh-connection.js');
const Parser = require('../parser.js')();

const internals = {

};

exports = module.exports = internals.Ssh = class {

    constructor(options) {

        this.sshConfig = options;
        this.sshConnection = new SshConnection(this.sshConfig);
    }

    connect() {

        return this.sshConnection.connect();
    };
    disconnect() {

        return this.sshConnection.disconnect();
    };


    showServersState() {

        return new Promise((resolve, reject) => {

            this.exec('sudo sh -c \'echo "show servers state" | socat /var/run/haproxy/haproxy.sock stdio\'')
                .then((data) => {

                    const result = Parser.parseHaproxyOutput(data.toString(), ' ', 1);
                    resolve({
                        serversState: result
                    });

                });

        });
    };

    showStat() {

        return new Promise((resolve, reject) => {

            this.exec('sudo sh -c \'echo "show stat" | socat /var/run/haproxy/haproxy.sock stdio\'')
                .then((data) => {

                    const result = Parser.parseHaproxyOutput(data.toString(), ',');
                    resolve({
                        stat: result
                    });
                });

        });
    };

    showInfo() {

        return this.exec('sudo sh -c \'echo "show info" | socat /var/run/haproxy/haproxy.sock stdio\'');
    };


    exec(cmd) {

        return this.sshConnection.exec(cmd);

    };
};
