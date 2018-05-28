'use strict';

//const Util = require('util');
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

        it('should return haproxy stat', async () => {

            const Haproxy = require('../../lib/haproxy.js');
            const haproxy = new Haproxy(validOptions);
            const result = await haproxy.showStat();
            expect(result.stat).to.be.an.array();
            expect(result.stat[0].pxname).to.be.equal('http-in');
            await haproxy.disconnect();
        });
    });

    experiment('batch', () => {

        it('should return batch results', async () => {

            const Haproxy = require('../../lib/haproxy.js');
            const haproxy = new Haproxy(validOptions);
            const result = await haproxy.batch(['showStat', 'showServersState']);
            result.map((r) => {

                //console.log('BATCH RESULT');
                //console.log(Util.inspect(r, { showHidden: false, depth: null }));
                if (r.stat) {
                    expect(r.stat).to.be.an.array();
                    expect(r.stat[0].pxname).to.be.equal('http-in');
                }
                else if (r.serversState) {
                    expect(r.serversState).to.be.an.array();
                    expect(r.serversState[0].be_name).to.be.equal('servers');
                }
            });
            await haproxy.disconnect();
        });
    });
});
