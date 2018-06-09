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
const SocketMock = require('../mocks').SocketMock;

describe('Socket Connection', () => {

    let sandbox = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {

        sandbox.restore();

    });

    experiment('constructor', () => {

        it('should throw an error if socket is empty', () => {

            const throws = () => {

                return new SocketConnection();
            };
            expect(throws).to.throw(Error, 'invalid options');
        });

        it('should set __retries to zero', () => {

            const socketMock = new SocketMock();
            const socket = new SocketConnection(socketMock);
            expect(socket.__retries).to.be.equal(0);
        });

        it('should set __connectPromise to null', () => {

            const socketMock = new SocketMock();
            const socket = new SocketConnection(socketMock);
            expect(socket.__connectPromise).to.be.equal(null);
        });
    });

    experiment('disconnect', () => {

        it('should resolve when no error has occured', async () => {

            const socketMock = new SocketMock();
            const socket = new SocketConnection(socketMock);
            await expect(socket.disconnect()).to.not.reject();
        });

        it('should call socket.end', async () => {

            const spy1 = sandbox.spy(SocketMock.prototype, 'end');
            const socketMock = new SocketMock();
            const socket = new SocketConnection(socketMock);

            await socket.disconnect();
            expect(spy1.calledOnce).to.be.true();
        });
    });

    experiment('connect', () => {

        it('should return the connection promise if already connected', async () => {

            const socketMock = new SocketMock();
            const conn = new SocketConnection(socketMock);

            conn.__connectPromise = Promise.resolve('connected');
            const result = await conn.connect();
            expect(result).to.be.equal('connected');
        });


        it('should set retries to zero when connection is in ready state', async () => {

            const socketMock = new SocketMock();
            const emitEvents = () => {

                setInterval(() => {

                    socketMock.emit('connect');
                }, 100);
            };
            emitEvents();
            const conn = new SocketConnection(socketMock);
            conn.__retries = 1;
            await conn.connect();
            expect(conn.__retries).to.be.equal(0);
        });

        it('should reject an error when connection is in ready state and an error has occured', async () => {

            const socketMock = new SocketMock();
            socketMock.on = sandbox.stub()
                .withArgs('connect', (err) => err)
                .callsArgWith(1, Error('error'));
            const conn = new SocketConnection(socketMock);
            await expect(conn.connect()).to.reject();
        });
    });

    experiment('exec', () => {

        it('should reject when socket raises an error event', async () => {

            const socketMock = new SocketMock();
            socketMock.on = sandbox.stub()
                .returns({ on: sandbox.stub()
                    .withArgs('error', (err) => err)
                    .callsArgWith(1, Error('error')) });
            const conn = new SocketConnection(socketMock);
            conn.__connectPromise = Promise.resolve();
            await expect(conn.exec()).to.reject();
        });

        it('should resolve when socket receives an data event', async () => {

            const socketMock = new SocketMock();
            const emitEvents = () => {

                setInterval(() => {

                    socketMock.emit('data', 'test');
                }, 100);
            };
            emitEvents();
            const conn = new SocketConnection(socketMock);
            conn.__connectPromise = Promise.resolve();
            await expect(conn.exec()).to.not.reject();
        });
    });
});
