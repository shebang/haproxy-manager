'use strict';

//const Debug = require('debug')('haproxy-manager:utils');

module.exports = () => {

    const internals = {

    };

    internals.createHaproxyCommand = (cmd, useSudo, socketPath) => {

        let retval;
        retval = `echo "${cmd}" | socat ${socketPath} stdio`;

        if (useSudo) {
            retval = `sudo sh -c \'${retval}\'`;
        }

        return retval;
    };

    return {
        createHaproxyCommand: internals.createHaproxyCommand
    };
};
