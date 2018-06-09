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
const ConnectionManagerMock = require('../connector-mock.js');
const Haproxy = require('../../../lib/haproxy.js')(ConnectionManagerMock);

describe('Haproxy', () => {

    let sandbox = null;
    let haproxy = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();

    });

    afterEach(() => {

        sandbox.restore();
        haproxy = null;
    });

    experiment('constructor', () => {

        it('should instantiate connection manager', () => {

            haproxy = new Haproxy();
            expect(haproxy.connectionManager).to.be.an.instanceof(ConnectionManagerMock);
        });
    });

    experiment('connect', () => {

        it('should return a promise', async () => {

            haproxy = new Haproxy();
            await expect(haproxy.connect()).to.be.an.instanceof(Promise);
        });

        it('should call connectionManager.connect', async () => {

            const spy = sandbox.spy(ConnectionManagerMock.prototype, 'connect');
            haproxy = new Haproxy();
            await haproxy.connect();
            expect(spy.calledOnce).to.be.true();
        });
    });

    experiment('disconnect', () => {

        it('should return a promise', async () => {

            haproxy = new Haproxy();
            await expect(haproxy.disconnect()).to.be.an.instanceof(Promise);
        });

        it('should call connectionManager.disconnect', async () => {

            const spy = sandbox.spy(ConnectionManagerMock.prototype, 'disconnect');
            haproxy = new Haproxy();
            await haproxy.disconnect();
            expect(spy.calledOnce).to.be.true();
        });
    });

    experiment('showServersState', () => {

        it('should return a promise', async () => {

            haproxy = new Haproxy();
            await expect(haproxy.showServersState()).to.be.an.instanceof(Promise);
        });

        it('should call connectionManager.showServersState', async () => {

            const spy = sandbox.spy(ConnectionManagerMock.prototype, 'showServersState');
            haproxy = new Haproxy();
            await haproxy.showServersState();
            expect(spy.calledOnce).to.be.true();
        });
    });

    experiment('showStat', () => {

        it('should return a promise', async () => {

            haproxy = new Haproxy();
            await expect(haproxy.showStat()).to.be.an.instanceof(Promise);
        });

        it('should call connectionManager.showStat', async () => {

            const spy = sandbox.spy(ConnectionManagerMock.prototype, 'showStat');
            haproxy = new Haproxy();
            await haproxy.showStat();
            expect(spy.calledOnce).to.be.true();
        });
    });

    experiment('batch', () => {

        it('should return a promise', async () => {

            haproxy = new Haproxy();
            await expect(haproxy.showStat()).to.be.an.instanceof(Promise);
        });

        it('should call connectionManager\'s methods given in batch command', async () => {

            const spy1 = sandbox.spy(ConnectionManagerMock.prototype, 'showStat');
            const spy2 = sandbox.spy(ConnectionManagerMock.prototype, 'showServersState');
            haproxy = new Haproxy();
            await haproxy.batch(['showStat','showServersState']);
            expect(spy1.calledOnce).to.be.true();
            expect(spy2.calledOnce).to.be.true();
        });
    });
});
