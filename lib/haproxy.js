'use strict';

const defaultOptions = {

    connection: {}
};

// define internals
const internals = {

    ConnectionManager: null

};

internals.Haproxy = class {

    constructor(options) {

        const localOptions = Object.assign({}, defaultOptions, options);

        this.connectionManager = new internals.ConnectionManager({
            connection: localOptions.connection
        });
    }

    connect() {

        return this.connectionManager.connect();
    };

    disconnect() {

        return this.connectionManager.disconnect();
    };


    showServersState() {

        return this.connectionManager.showServersState();
    };

    showStat() {

        return this.connectionManager.showStat();
    };

    batch(commands) {

        return Promise.all(commands.map((command) => {

            const c = this[command]();
            return c;
        })

        );
    };

};

module.exports = (ConnectionManager) => {

    internals.ConnectionManager = ConnectionManager;
    return internals.Haproxy;
};
