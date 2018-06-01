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

const SshConnector = require('../../../lib/connector/ssh.js');
const ConnectorMock = require('../connector-mock.js');

describe('Haproxy', () => {

    let sandbox = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();

    });

    afterEach(() => {

        sandbox.restore();

    });
    experiment('constructor', () => {

        it('should use default connector if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy();
            expect(haManager.connectorName).to.be.equal('local');
        });

        it('should use connector if specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connectorName: 'ssh',
                connectorOptions: {
                    username: 'test',
                    host: 'localhost'

                }
            });
            expect(haManager.connectorName).to.be.equal('ssh');
            expect(haManager.connector).to.be.an.instanceof(SshConnector);
        });

        it('should use set connectorOptions if specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connectorName: 'ssh',
                connectorOptions: {
                    username: 'test',
                    host: 'localhost'

                }
            });
            expect(haManager.connectorOptions.username).to.be.equal('test');
            expect(haManager.connectorOptions.host).to.be.equal('localhost');
        });

        it('should use localhost if not specified via options', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy();
            expect(haManager.host).to.be.equal('localhost');
        });
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
