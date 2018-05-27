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

describe('Haproxy', () => {

    let sandbox = null;
    let SshClientMockFactory = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        SshClientMockFactory = {

            default: () => {

                const stub = Sinon.stub();
                stub.prototype.connect = (params) => {

                    return Promise.resolve(

                    );
                };
                return stub;
            }
        };
    });

    afterEach(() => {

        SshClientMockFactory = null;
        sandbox.restore();

    });
    experiment('Constructor', () => {
        it('should be ok', () => {

        });
    });

});
