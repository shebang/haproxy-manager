'use strict';

//const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Sinon = require('sinon');

const describe = lab.describe;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const it = lab.it;
const experiment = lab.experiment;
//const expect = Code.expect;
/*const Fs = require('fs');
const Path = require('path');*/

describe('SSH Connector', () => {

    let sandbox = null;
    //let SshClientMockFactory = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        /*SshClientMockFactory = {

        };*/
    });

    afterEach(() => {

        //SshClientMockFactory = null;
        sandbox.restore();

    });
    experiment('Constructor', () => {

        it('should use default connector if not specified via options', () => {

            //const Haproxy = require('../../../lib/haproxy.js');
            //const haManager = new Haproxy();

        });
    });

});
