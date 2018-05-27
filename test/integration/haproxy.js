'use strict';

const util = require('util');
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
/*const Fs = require('fs');
const Path = require('path');*/

describe('Haproxy Integration Test', () => {

    let sandbox = null;
    let validOptions = null;

    beforeEach(() => {

        validOptions = {
            host: 'localhost',
            connector: 'ssh',
            connectorOptions: {
                port: 3022,
                username: 'test-user',
                privateKey: require('fs').readFileSync('/Users/al/dev/haproxy-manager/test/docker/dummy-ssh-keys/test-user')
            }
        };
        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {

        validOptions = null;
        sandbox.restore();

    });

    experiment('showStat', () => {

        it('should return haproxy stat', () => {

            const Haproxy = require('../../lib/haproxy.js');
            const haproxy = new Haproxy(validOptions);
            haproxy.showStat()
                .then(haproxy.debugResult)
                .catch((err) => {

                    console.log('ERRRRRRRRR', err.toString('utf8'));
                });

            //expect(haproxy.host).to.be.equal('10.0.0.1');

        });
    });

    experiment('batch', () => {

        it('should return batch results', () => {

            const Haproxy = require('../../lib/haproxy.js');
            const haproxy = new Haproxy(validOptions);
            haproxy.batch(['showStat', 'showServersState', 'showInfo'])
                .then((result) => {


                    result.map((r) => {

                        console.log('BATCH RESULT');
                        console.log(util.inspect(r, {showHidden: false, depth: null}))
                    });
                })
                .catch((err) => {

                    console.log('ERRRRRRRRR', err.toString('utf8'));
                });

            //expect(haproxy.host).to.be.equal('10.0.0.1');

        });
    });
});
