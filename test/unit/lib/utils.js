'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Sinon = require('sinon');

const describe = lab.describe;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const it = lab.it;
const experiment = lab.experiment;
const expect = Code.expect;

describe('Utils', () => {

    let sandbox = null;
    let Utils = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        Utils = require('../../../lib/utils.js')();
    });

    afterEach(() => {

        Utils = null;
        sandbox.restore();

    });

    experiment('createHaproxyCommand', () => {

        it('should return a shell command wrapped in sudo if useSudo is true', () => {

            const expectedResult = 'sudo sh -c \'echo "show stat" | socat /var/run/haproxy/haproxy.sock stdio\'';
            const result = Utils.createHaproxyCommand('show stat', true, '/var/run/haproxy/haproxy.sock');
            expect(result).to.be.equal(expectedResult);
        });

        it('should return a shell command not wrapped in sudo if useSudo is false', () => {

            const expectedResult = 'echo "show stat" | socat /var/run/haproxy/haproxy.sock stdio';
            const result = Utils.createHaproxyCommand('show stat', false, '/var/run/haproxy/haproxy.sock');
            expect(result).to.be.equal(expectedResult);
        });
    });

});
