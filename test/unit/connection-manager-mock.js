'use strict';
/*
 *
 **/

exports = module.exports = class ConnectorMock {

    constructor() {

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
};

