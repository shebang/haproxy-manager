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

const SshConnectionMock = require('../../ssh-connection-mock.js');

describe('SSH Connector', () => {

    let sandbox = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
    });

    afterEach(() => {

        sandbox.restore();

    });
    experiment('constructor', () => {

        it('should use default connector if not specified via options', () => {

        });
    });

    experiment('disconnect', () => {

        it('should return a promise', async () => {

            const SshConnector = require('../../../../lib/connector/ssh.js');
            const ssh = new SshConnector({
                sshConnection: new SshConnectionMock()
            });
            await expect(ssh.disconnect()).to.be.an.instanceof(Promise);
        });
    });

    experiment('showServersState', () => {

        it('should return a promise', async () => {

            const SshConnector = require('../../../../lib/connector/ssh.js');
            const ssh = new SshConnector({
                sshConnection: new SshConnectionMock({
                    execReturns: '1\n# test\ntest'
                })
            });
            await expect(ssh.showServersState()).to.be.an.instanceof(Promise);
        });
    });

    experiment('showStat', () => {

        it('should return a promise', async () => {

            const SshConnector = require('../../../../lib/connector/ssh.js');
            const ssh = new SshConnector({
                sshConnection: new SshConnectionMock({
                    execReturns: '# test\ntest'
                })
            });
            await expect(ssh.showStat()).to.be.an.instanceof(Promise);
        });
    });

    experiment('exec', () => {

        it('should return a promise', async () => {

            const SshConnector = require('../../../../lib/connector/ssh.js');
            const ssh = new SshConnector({
                sshConnection: new SshConnectionMock({
                    execReturns: 'test'
                })
            });
            await expect(ssh.exec()).to.be.an.instanceof(Promise);
        });
    });
});
