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

const Response = require('../../../lib/response');
const SocketConnection = require('../../../lib/socket-connection');

describe('Connection Manager', () => {

    let sandbox = null;
    let NetMock = null;
    let SshConnection = null;
    let ConnectionManager = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        SshConnection = require('../../../lib/ssh-connection')();
        NetMock = {
            createConnection: sandbox.stub().returns({

                on: () => null,
                end: Sinon.stub()
            })

        };

        ConnectionManager = require('../../../lib/connection-manager')(
            NetMock,
            SshConnection,
            SocketConnection,
            Response
        );
    });

    afterEach(() => {

        sandbox.restore();
        NetMock = null;
        SshConnection = null;
        ConnectionManager = null;
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

        it('should call Net.createConnection with correct arguments for a UNIX connection', () => {

            ConnectionManager.createConnector({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(NetMock.createConnection.calledOnce).to.be.true();
            expect(NetMock.createConnection.args[0][0]).to.be.equal('/test.sock');
        });

        it('should call SocketConnection with correct arguements if UNIX connection settings are present in options', () => {

            const SocketConnectionMock = sandbox.stub();
            const CM = require('../../../lib/connection-manager')(
                NetMock,
                SshConnection,
                SocketConnectionMock,
                Response
            );

            CM.createConnector({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });
            expect(SocketConnectionMock.calledOnce).to.be.true();
            expect(SocketConnectionMock.args[0][1].connection.unix.socketPath).to.be.equal('/test.sock');
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

        it('should call SshConnection with correct arguements if ssh settings are present in options', () => {

            const SshConnectionMock = sandbox.stub();
            const CM = require('../../../lib/connection-manager')(
                NetMock,
                SshConnectionMock,
                SocketConnection,
                Response
            );
            CM.createConnector({
                connection: {
                    ssh: {
                        username: 'test',
                        host: 'somehost.example.com'
                    }
                }
            });
            expect(SshConnectionMock.calledOnce).to.be.true();
            expect(SshConnectionMock.args[0][0].ssh.username).to.be.equal('test');
            expect(SshConnectionMock.args[0][0].ssh.host).to.be.equal('somehost.example.com');
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

        it('should call Net.createConnection with valid arguments for a TCP connection', () => {

            ConnectionManager.createConnector({
                connection: {
                    tcp: {
                        port: 3003,
                        host: 'localhost'
                    }
                }
            });
            expect(NetMock.createConnection.calledOnce).to.be.true();
            expect(NetMock.createConnection.args[0][0]).to.be.equal(3003);
            expect(NetMock.createConnection.args[0][1]).to.be.equal('localhost');
        });

        it('should call SocketConnection with correct arguements if tcp settings are present in options', () => {

            const SocketConnectionMock = sandbox.stub();
            const CM = require('../../../lib/connection-manager')(
                NetMock,
                SshConnection,
                SocketConnectionMock,
                Response
            );
            CM.createConnector({
                connection: {
                    tcp: {
                        port: 3003,
                        host: 'localhost'
                    }
                }
            });
            expect(SocketConnectionMock.calledOnce).to.be.true();
            expect(SocketConnectionMock.args[0][1].connection.tcp.port).to.be.equal(3003);
            expect(SocketConnectionMock.args[0][1].connection.tcp.host).to.be.equal('localhost');
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

        it('should call connection.exec with correct arguments', async () => {

            const stub = sandbox.stub(SocketConnection.prototype, 'exec').returns(Promise.resolve('1\na b\n1 2'));
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.showServersState();
            expect(stub.withArgs('show servers state').calledOnce).to.be.true();
            expect(stub.args[0][0]).to.be.equal('show servers state');
        });

        it('should call Response.createResponse with correct arguments', async () => {

            sandbox.stub(SocketConnection.prototype, 'exec').returns(Promise.resolve('1\na b\n1 2'));
            const stub = sandbox.stub(Response, 'createResponse').returns(Promise.resolve('test'));
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.showServersState();
            expect(stub.calledOnce).to.be.true();
            expect(await stub.args[0][0]).to.be.equal('1\na b\n1 2');
            expect(stub.args[0][1]).to.be.equal('serversState');
            expect(stub.args[0][2]).to.be.equal({ csvDelimiter: ' ', rawDataOffset: 1 });
        });
    });

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

        it('should call connection.exec with correct arguments', async () => {

            const stub = sandbox.stub(SocketConnection.prototype, 'exec').returns(Promise.resolve('a,b\n1,2'));
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.showStat();
            expect(stub.withArgs('show stat').calledOnce).to.be.true();
            expect(stub.args[0][0]).to.be.equal('show stat');
        });

        it('should call Response.createResponse with correct arguments', async () => {

            sandbox.stub(SocketConnection.prototype, 'exec').returns(Promise.resolve('a,b\n1,2'));
            const stub = sandbox.stub(Response, 'createResponse').returns(Promise.resolve('test'));
            const manager = new ConnectionManager({
                connection: {
                    unix: {
                        socketPath: '/test.sock'
                    }
                }
            });

            await manager.showStat();
            expect(stub.calledOnce).to.be.true();
            expect(await stub.args[0][0]).to.be.equal('a,b\n1,2');
            expect(stub.args[0][1]).to.be.equal('stat');
        });

    });
});
