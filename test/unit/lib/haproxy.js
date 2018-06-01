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
//const SshConnection = require('./connector/ssh-connection.js');

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
            //const SshConnection = require('./connector/ssh-connection.js');
            const haManager = new Haproxy({

                connectorName: 'ssh',
                connectorOptions: {
                    username: 'test',
                    host: 'localhost'

                }
            });
            expect(haManager.connectorName).to.be.equal('ssh');
            //console.log('SSSAAAAAAAAAAAAAAAAa', SshConnection);
            //expect(haManager.connector).to.be.an.instanceof(SshConnection);
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

        it('should resolve', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            expect(haManager.connect()).to.not.reject();
        });
    });

    experiment('disconnect', () => {

        it('should resolve', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            expect(haManager.disconnect()).to.not.reject();
        });
    });

    experiment('showServersState', () => {

        it('should resolve', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            expect(haManager.showServersState()).to.not.reject();
        });
    });

    experiment('showStat', () => {

        it('should resolve', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            expect(haManager.showStat()).to.not.reject();
        });
    });

    experiment('batch', () => {

        it('should resolve', () => {

            const Haproxy = require('../../../lib/haproxy.js');
            const haManager = new Haproxy({

                connector: ConnectorMock
            });
            expect(haManager.batch(['showServersState', 'showStat'])).to.not.reject();
        });
    });



});
