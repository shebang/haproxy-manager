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
/*const Fs = require('fs');
const Path = require('path');*/

const SshConnection = require('../../../../lib/connector/ssh-connection.js');
const StreamMock = require('../../stream-mock.js');

describe('SSH Connection', () => {

    let sandbox = null;
    let validOptions = null;
    let SshClient = null;

    beforeEach(() => {

        SshClient = require('ssh2').Client;
        sandbox = Sinon.createSandbox();

        validOptions = {
            host: 'localhost',
            username: 'test'
        };
    });

    afterEach(() => {

        validOptions = null;
        SshClient = null;
        sandbox.restore();

    });

    experiment('constructor', () => {

        it('should throw an error if options is empty', () => {

            const throws = () => {

                return new SshConnection();
            };
            expect(throws).to.throw(Error, 'invalid options');
        });

        it('should throw an error if options.host is empty', () => {

            const throws = () => {

                return new SshConnection({
                    username: 'test'
                });
            };
            expect(throws).to.throw(Error, 'invalid options');
        });

        it('should throw an error if options.username is empty', () => {

            const throws = () => {

                return new SshConnection({
                    host: 'test'
                });
            };
            expect(throws).to.throw(Error, 'invalid options');
        });

        it('should set default options if not present in options', () => {

            const ssh = new SshConnection(validOptions);
            expect(ssh.sshConfig.port).to.be.equal(22);
        });
    });

    experiment('disconnect', () => {

        it('should resolve when no error has occured', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const ssh = new SshConnection(validOptions);
            await ssh.connect();
            await expect(ssh.disconnect(SshClient)).to.not.reject();
        });
    });

    experiment('connect', () => {

        it('should return the connection promise if already connected', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const ssh = new SshConnection(validOptions);
            ssh.__connectPromise = Promise.resolve('connected');
            const result = await ssh.connect(SshClient);
            expect(result).to.be.equal('connected');
        });


        it('should set retries to zero when connection is in ready state', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const ssh = new SshConnection(validOptions);
            const result = await ssh.connect(SshClient);
            expect(result.__retries).to.be.equal(0);
        });

        it('should clear errors when connection is in ready state', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const ssh = new SshConnection(validOptions);
            const result = await ssh.connect(SshClient);
            expect(result.__err).to.be.equal(null);
        });

        it('should reject an error when connection is in ready state and an error has occured', async () => {

            const callback = (val) => null;
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArgWith(1, Error('error'));

            const ssh = new SshConnection(validOptions, SshClient);
            await expect(ssh.connect()).to.reject();
        });
    });

    experiment('exec', () => {

        it('should reject an error when ssh exec indicates an error', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            SshClient.prototype.exec = sandbox.stub().withArgs('test', callback).callsArgWith(1, 1, null);

            const ssh = new SshConnection(validOptions, SshClient);
            await expect(ssh.exec('test')).to.reject();

        });

        it('should reject an error when the ssh stream receives an error', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const sshStream = new StreamMock();

            const emitEvents = () => {

                setInterval(() => {

                    sshStream.stderr.emit('data');
                    sshStream.emit('close');
                }, 10);
            };

            const callbackExec = (errorValue, stream) => null;
            SshClient.prototype.exec = sandbox.stub().withArgs('test', callbackExec).callsArgWith(1, null, sshStream);

            const ssh = new SshConnection(validOptions, SshClient);
            emitEvents();
            await expect(ssh.exec('test')).to.reject();

        });

        it('should resolve when the ssh stream receives the close event', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const sshStream = new StreamMock();

            const emitEvents = () => {

                setInterval(() => {

                    sshStream.emit('data');
                    sshStream.emit('close');
                }, 10);
            };

            const callbackExec = (errorValue, stream) => null;
            SshClient.prototype.exec = sandbox.stub().withArgs('test', callbackExec).callsArgWith(1, null, sshStream);

            const ssh = new SshConnection(validOptions, SshClient);
            emitEvents();
            await expect(ssh.exec('test')).to.not.reject();

        });

        it('should call stream.removeListener when the ssh stream receives the end event', async () => {

            const callback = () => Promise.resolve();
            SshClient.prototype.on = sandbox.stub().withArgs('ready', callback).callsArg(1);

            const sshStream = new StreamMock();

            const emitEvents = () => {

                setTimeout(() => {

                    sshStream.emit('data');
                    sshStream.emit('end');
                    sshStream.emit('close');
                }, 10);
            };

            const spy = sandbox.spy(sshStream, 'removeListener');
            const callbackExec = (errorValue, stream) => null;
            SshClient.prototype.exec = sandbox.stub().withArgs('test', callbackExec).callsArgWith(1, null, sshStream);

            const ssh = new SshConnection(validOptions, SshClient);
            emitEvents();
            await ssh.exec('test');

            expect(spy.getCall(0).args[0]).to.be.equal('data');
            expect(spy.getCall(0).args[1]).to.be.a.function();
            expect(spy.calledOnce).to.be.a.true();
        });
    });
});
