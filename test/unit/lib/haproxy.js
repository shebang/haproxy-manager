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


describe('Haproxy', () => {

    let sandbox = null;
    let haproxy = null;
    let providerMock = null;
    let JoiMock = null;
    let ConnectionManagerMock = null;
    let Haproxy = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        providerMock = require('../provider-mock');

        JoiMock = {

            object: Sinon.stub()
                .returns({
                    keys: Sinon.stub()
                }),
            string: Sinon.stub()
                .returns({
                    regex: Sinon.stub()
                        .returns({
                            required: Sinon.stub()
                        })
                }),
            func: Sinon.stub()
                .returns({
                    required: Sinon.stub()
                }),

            validate: Sinon.stub().returns({
                error: null
            })
        };

        ConnectionManagerMock = require('../connection-manager-mock');
        Haproxy = require('../../../lib/haproxy.js')(ConnectionManagerMock, JoiMock);


    });

    afterEach(() => {

        sandbox.restore();
        providerMock = null;
        haproxy = null;
        JoiMock = null;
        ConnectionManagerMock = null;
        Haproxy = null;
    });

    experiment('constructor', () => {

        it('should instantiate connection manager', () => {

            haproxy = new Haproxy();
            expect(haproxy.connectionManager).to.be.an.instanceof(ConnectionManagerMock);
        });

        it.skip('should set this.backendProviders to an empty object', () => {

            haproxy = new Haproxy();
            expect(haproxy.backendProviders).to.be.equal({});
            expect(haproxy.backendProviders).to.be.an.object();
        });

        it.skip('should set this.peerProvider to an empty object', () => {

            haproxy = new Haproxy();
            expect(haproxy.peerProvider).to.be.equal({});
            expect(haproxy.peerProvider).to.be.an.object();
        });

        it('should set this.providers to an empty object', () => {

            haproxy = new Haproxy();
            expect(haproxy.providers).to.be.equal({});
            expect(haproxy.providers).to.be.an.object();
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

    experiment('async registerProvider(module, options)', () => {

        it('should not throw if no error occured', () => {

            haproxy = new Haproxy();
            const register = () => {

                haproxy.registerProvider(providerMock, {
                    key: 'value'
                });
            };
            expect(register).to.not.throw();
        });

        it('validates module.provider', async () => {

            haproxy = new Haproxy();
            await haproxy.registerProvider(providerMock, {
                key: 'value'
            });
            expect(JoiMock.validate.called).to.be.true();
            expect(JoiMock.validate.args[0][0].name).to.be.equal('demoProvider1');
            expect(JoiMock.validate.args[0][0].version).to.be.equal('1.0');
            expect(JoiMock.validate.args[0][0].register).to.be.a.function();
        });

        it('rejects when module.provider is invalid', () => {

            JoiMock.validate = sandbox.stub().returns({
                error: true
            });

            haproxy = new Haproxy();
            const result = haproxy.registerProvider(providerMock, { key: 'value' });
            expect(result).to.reject();
        });

        it('calls module.provider.register', () => {

            const spy = sandbox.spy(providerMock.provider, 'register');

            haproxy = new Haproxy();
            haproxy.registerProvider(providerMock, { key: 'value' });
            expect(spy.args[0][0].key).to.be.equal('value');
            expect(spy.calledOnce).to.be.true();
        });

        it('rejects when module.provider.register returns empty object', () => {

            sandbox.stub(providerMock.provider, 'register').returns(null);

            haproxy = new Haproxy();
            const result = haproxy.registerProvider(providerMock, { key: 'value' });
            expect(result).to.reject();
        });

        it('rejects when the object returned by module.provider.register does not contain a function getPeers', () => {

            sandbox.stub(providerMock.provider, 'register').returns({ getBackendServers: () => null });

            haproxy = new Haproxy();
            const result = haproxy.registerProvider(providerMock, { key: 'value' });
            expect(result).to.reject();
        });

        it('rejects when the object returned by module.provider.register does not contain a function getBackendServers', () => {

            sandbox.stub(providerMock.provider, 'register').returns({ getPeers: () => null });

            haproxy = new Haproxy();
            const result = haproxy.registerProvider(providerMock, { key: 'value' });
            expect(result).to.reject();
        });

        it('registers the module at the provider registry', async () => {

            haproxy = new Haproxy();
            await haproxy.registerProvider(providerMock, { key: 'value' });
            expect(haproxy.providers.demoProvider1.name).to.be.equal('demoProvider1');
        });
    });

    experiment('updatePeers(provider, groupName)', () => {

        it('calls provider.getPeers with param groupName', async () => {

            haproxy = new Haproxy();
            await haproxy.registerProvider(providerMock, { });

            const provider = haproxy.providers.demoProvider1;
            sandbox.spy(provider, 'getPeers');

            await haproxy.updatePeers(provider, 'test');
            expect(provider.getPeers.calledOnce).to.be.true();
            expect(provider.getPeers.args[0][0]).to.be.equal('test');
        });

        it('resolves when no error occurs', async () => {

            haproxy = new Haproxy();
            await haproxy.registerProvider(providerMock, { });

            const provider = haproxy.providers.demoProvider1;

            expect(haproxy.updatePeers(provider, 'test')).to.not.reject();
        });

        it('calls this._schedulePossiblePeersUpdate', async () => {

            haproxy = new Haproxy();
            await haproxy.registerProvider(providerMock, { });
            sandbox.spy(haproxy, '_schedulePossiblePeersUpdate');
            const provider = haproxy.providers.demoProvider1;

            const expectedArgs = [{ peername: 'server1', ip: '10.0.0.1', port: 7777 },
                { peername: 'server2', ip: '10.0.0.2', port: 7777 },
                { peername: 'server3', ip: '10.0.0.2', port: 7777 }];

            await haproxy.updatePeers(provider, 'test');
            expect(haproxy._schedulePossiblePeersUpdate.calledOnce).to.be.true();
            expect(haproxy._schedulePossiblePeersUpdate.args[0][0]).to.be.equal(expectedArgs);
        });
    });
});
