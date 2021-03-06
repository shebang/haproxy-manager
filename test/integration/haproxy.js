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
const Path = require('path');

const pathSocket = Path.join(__dirname, '../../test/docker/var/run/haproxy/haproxy-forward.sock');

describe('Haproxy Manager Integration Test', () => {

    let sandbox = null;
    let HaproxyManager = null;
    let validOptionsSsh = null;
    let validOptionsLocal = null;
    let validOptionsTcp = null;

    beforeEach(() => {

        HaproxyManager = require('../..');

        validOptionsSsh = {
            connection: {
                ssh: {
                    host: 'localhost',
                    port: 3022,
                    username: 'test-user',
                    privateKey: require('fs').readFileSync('/Users/al/dev/haproxy-manager/test/docker/dummy-ssh-keys/test-user')
                }
            }
        };
        validOptionsLocal = {
            connection: {
                unix: {
                    socketPath: pathSocket
                }
            }
        };
        validOptionsTcp = {
            connection: {
                tcp: {
                    host: 'localhost',
                    port: 3003
                }
            }
        };
        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {

        HaproxyManager = null;
        validOptionsSsh = null;
        validOptionsLocal = null;
        validOptionsTcp = null;
        sandbox.restore();

    });

    experiment('showStat', { timeout: 3000 }, () => {

        it('should return haproxy stat', async () => {


            const haproxy = new HaproxyManager.Haproxy(validOptionsSsh);
            const result = await haproxy.showStat();

            const expectedResult = [
                { pxname: 'http-in', svname: 'FRONTEND' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo1' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo2' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo3' },
                { pxname: 'servers', svname: 'BACKEND' },
                { pxname: 'websockets', svname: 'BACKEND' }
            ];

            const filtered = result.query(`stat.({
                "pxname": $.pxname,
                "svname": $.svname
            })`);
            expect(filtered).to.be.an.array();
            expect(filtered).to.be.equal(expectedResult);
            await haproxy.disconnect();
        });
    });

    experiment('showStat (local)', { timeout: 3000 }, () => {

        it('should return haproxy stat', async () => {

            const haproxy = new HaproxyManager.Haproxy(validOptionsLocal);
            const result = await haproxy.showStat();

            const expectedResult = [
                { pxname: 'http-in', svname: 'FRONTEND' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo1' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo2' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo3' },
                { pxname: 'servers', svname: 'BACKEND' },
                { pxname: 'websockets', svname: 'BACKEND' }
            ];

            const filtered = result.query(`stat.({
                "pxname": $.pxname,
                "svname": $.svname
            })`);
            expect(filtered).to.be.an.array();
            expect(filtered).to.be.equal(expectedResult);
            await haproxy.disconnect();
        });
    });

    experiment('showStat (tcp)', { timeout: 3000 }, () => {

        it('should return haproxy stat', async () => {

            const haproxy = new HaproxyManager.Haproxy(validOptionsTcp);
            const result = await haproxy.showStat();

            const expectedResult = [
                { pxname: 'http-in', svname: 'FRONTEND' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo1' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo2' },
                { pxname: 'servers', svname: 'haproxy-manager-http-echo3' },
                { pxname: 'servers', svname: 'BACKEND' },
                { pxname: 'websockets', svname: 'BACKEND' }
            ];

            const filtered = result.query(`stat.({
                "pxname": $.pxname,
                "svname": $.svname
            })`);
            expect(filtered).to.be.an.array();
            expect(filtered).to.be.equal(expectedResult);
            await haproxy.disconnect();
        });
    });


    experiment.skip('showServersState', { timeout: 3000 }, () => {

        it('should return haproxy servers state', async () => {

            const haproxy = new HaproxyManager.Haproxy(validOptionsSsh);
            const result = await haproxy.showServersState();

            const expectedResult = [
                { srv_name: 'haproxy-manager-http-echo1', srv_op_state: '2' },
                { srv_name: 'haproxy-manager-http-echo2', srv_op_state: '2' },
                { srv_name: 'haproxy-manager-http-echo3', srv_op_state: '2' }
            ];
            const filtered = result.query(`serversState.({
                "srv_name": $.srv_name,
                "srv_op_state": $.srv_op_state
            })`);
            expect(filtered).to.be.an.array();
            expect(filtered).to.be.equal(expectedResult);
            await haproxy.disconnect();
        });
    });


    experiment.skip('batch', { timeout: 3000 }, () => {

        it.skip('should return batch results', async () => {

            const haproxy = new HaproxyManager.Haproxy(validOptionsSsh);
            const result = await haproxy.batch(['showStat', 'showServersState']);
            result.map((r) => {

            });
            await haproxy.disconnect();
        });
    });
});
