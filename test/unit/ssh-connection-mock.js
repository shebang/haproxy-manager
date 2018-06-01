'use strict';
/*
 *
 **/

exports = module.exports = class SshConnectionMock {

    constructor(options) {

        if (!options) {

        }
        else {
            this.execReturns = options.execReturns || null;
        }
    };

    connect() {

        return Promise.resolve();
    }

    disconnect() {

        return Promise.resolve();
    }

    showServersState() {

        return Promise.resolve();
    }

    showStat() {

        return Promise.resolve();
    }

    exec(cmd) {

        return Promise.resolve(this.execReturns);
    }
};

