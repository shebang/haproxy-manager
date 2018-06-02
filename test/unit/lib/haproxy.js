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

    let SshConnector;
    let ConnectorMock;

    let sandbox = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        SshConnector = require('../../../lib/connector/ssh.js');
        ConnectorMock = require('../connector-mock.js');
    });

    afterEach(() => {

        SshConnector = null;
        ConnectorMock = null;
        sandbox.restore();

    });
    experiment('constructor', () => {



        it('should use default connector if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy();
            expect(haproxy.connectorName).to.be.equal('local');
        });

        it('should set default connectorOptions if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy();
            expect(haproxy.connectorOptions).to.be.an.object();
            expect(haproxy.connectorOptions).to.be.equal({ host: 'localhost' });
        });

        it('should set host to localhost if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy();
            expect(haproxy.host).to.be.equal('localhost');
        });

        it('should set host via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy({

                connectorName: 'ssh',
                host: 'somehost.example.com',
                connectorOptions: {
                    sshConfig: {
                        username: 'test'
                    }
                }
            });
            expect(haproxy.host).to.be.equal('somehost.example.com');
        });

        it('should set connectorOptions via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy({

                connectorName: 'ssh',
                host: 'somehost.example.com',
                connectorOptions: {
                    sshConfig: {
                        username: 'test'
                    }
                }
            });
            expect(haproxy.connectorOptions).to.be.an.object();
            expect(haproxy.connectorOptions).to.be.equal({
                host: 'somehost.example.com',
                sshConfig: {
                    host: 'somehost.example.com',
                    username: 'test'
                }
            });
        });

        it('should instantiate connector if specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haproxy = new Haproxy({

                connectorName: 'ssh',
                connectorOptions: {
                    sshConfig: {
                        username: 'test',
                        host: 'localhost'
                    }
                }
            });
            expect(haproxy.connectorName).to.be.equal('ssh');
            expect(haproxy.connector).to.be.an.instanceof(SshConnector);
        });

        /*it('should use localhost if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy();
            expect(haManager.host).to.be.equal('localhost');
        });*/
    });
    experiment('connect', () => {

        it('should return a promise', async () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            await expect(haManager.connect()).to.be.an.instanceof(Promise);
        });
    });

    experiment('disconnect', () => {

        it('should return a promise', async () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            await expect(haManager.disconnect()).to.be.an.instanceof(Promise);
        });
    });

    experiment('showServersState', () => {

        it('should return a promise', async () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            await expect(haManager.showServersState()).to.be.an.instanceof(Promise);
        });
    });

    experiment('showStat', () => {

        it('should return a promise', async () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            await expect(haManager.showStat()).to.be.an.instanceof(Promise);
        });
    });

    experiment('batch', () => {

        it('should return a promise', async () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            await expect(haManager.batch(['showServersState', 'showStat'])).to.be.an.instanceof(Promise);
        });
    });
});
