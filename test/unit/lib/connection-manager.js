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

const SocketConnection = require('../../../lib/socket-connection');
const SshConnection = require('../../../lib/ssh-connection')();
const NetMock = {

    default: () => {

        const stub = Sinon.stub();
        stub.createConnection = Sinon.stub().returns({

            on: () => null,
            end: Sinon.stub()
        });
        return stub;
    }
};
const ConnectionManager = require('../../../lib/connection-manager')(NetMock.default());

describe('Connection Manager', () => {

    let sandbox = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {

        sandbox.restore();
    });

    experiment('constructor', () => {

        it('should instantiate unix connection as default', () => {

            const conn = new ConnectionManager();
            expect(conn.connection).to.be.an.instanceof(SocketConnection);
        });

    });

    experiment('createConnector', () => {

        it('should return a unix connection if unix settings are present in options', () => {

            const connection = ConnectionManager.createConnector({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(connection).to.be.an.instanceof(SocketConnection);
        });

        it('should return an ssh connection if ssh settings are present in options', () => {

            const connection = ConnectionManager.createConnector({
                connection: {
                    ssh: {
                        username: 'test',
                        host: 'somehost.example.com'
                    }
                }
            });
            expect(connection).to.be.an.instanceof(SshConnection);
        });

        it('should return a tcp connection if tcp settings are present in options', () => {

            const connection = ConnectionManager.createConnector({
                connection: {
                    tcp: {
                        port: 3003,
                        host: 'localhost'
                    }
                }
            });
            expect(connection).to.be.an.instanceof(SocketConnection);
        });

        it('should throw an error if options are invalid', () => {

            const throws = () => {

                ConnectionManager.createConnector({
                    connection: {
                        invalid: null
                    }
                });
            };
            expect(throws).to.throw();
        });
    });

    experiment('disconnect', () => {

        it('should return a Promise', () => {

            const connection = ConnectionManager.createConnector({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(connection.disconnect()).to.be.an.instanceof(Promise);
        });

        it('should call connection.disconnect', async () => {

            const spy = sandbox.spy(SocketConnection.prototype, 'disconnect');
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.disconnect();
            expect(spy.calledOnce).to.be.true();
        });
    });

    // FIXME: provide more detailed tests
    experiment('showServersState', () => {

        it('should return a Promise', () => {

            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(manager.showServersState()).to.be.an.instanceof(Promise);
        });

        // FIXME: this is messy, please use sandbox only or provide a mock
        // for SocketConnection
        it.skip('should call connection.exec', async () => {

            const execSave = SocketConnection.prototype.exec;
            SocketConnection.prototype.exec = () => Promise.resolve('test');
            const spy = sandbox.spy(SocketConnection.prototype, 'exec');
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.showServersState();
            expect(spy.calledOnce).to.be.true();
            SocketConnection.prototype.exec = execSave;
        });

    });

    // FIXME: provide more detailed tests
    experiment('showStat', () => {

        it('should return a Promise', () => {

            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(manager.showStat()).to.be.an.instanceof(Promise);
        });

    });
});
