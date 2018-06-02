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

describe('Response', () => {

    let sandbox = null;
    let Response = null;

    beforeEach(() => {

        sandbox = Sinon.createSandbox();
        Response = require('../../../lib/response');
    });

    afterEach(() => {

        Response = null;
        sandbox.restore();

    });

    //FIXME: more elaborate please
    experiment('createResponse', () => {

        it('should create a response', async () => {

            let data = '';
            data += '# field1,field2\n';
            data += 'val1,val2\n';
            data += 'val3,val4\n';

            const expectedResult = {
                test: [{ field1: 'val1', field2: 'val2' },
                    { field1: 'val3', field2: 'val4' }]
            };

            const result = await Response.createResponse(data, 'test');
            expect(result._data).to.be.an.object();
            expect(result._data).to.be.equal(expectedResult);
            expect(result).to.be.an.instanceof(Response);
        });

    });

    experiment('query', () => {

        it('should return unfiltered data if queryString is empty', async () => {

            let data = '';
            data += '# field1,field2\n';
            data += 'val1,val2\n';
            data += 'val3,val4\n';

            const expectedResult = {
                test: [{ field1: 'val1', field2: 'val2' },
                    { field1: 'val3', field2: 'val4' }]
            };

            const result = await Response.createResponse(data, 'test');
            const query = result.query();
            expect(query).to.be.an.object();
            expect(query).to.be.equal(expectedResult);
        });

        it('should return filtered data if queryString is not empty', async () => {

            let data = '';
            data += '# field1,field2\n';
            data += 'val1,val2\n';
            data += 'val3,val4\n';

            const expectedResult = ['val1', 'val3'];

            const result = await Response.createResponse(data, 'test');
            const query = result.query('$[0].test.field1');
            expect(query).to.be.an.array();
            expect(query).to.be.equal(expectedResult);
        });


    });
    experiment('data', () => {

        it('should return unfiltered data', async () => {

            let data = '';
            data += '# field1,field2\n';
            data += 'val1,val2\n';
            data += 'val3,val4\n';

            const expectedResult = {
                test: [{ field1: 'val1', field2: 'val2' },
                    { field1: 'val3', field2: 'val4' }]
            };

            const result = await Response.createResponse(data, 'test');
            expect(result.data()).to.be.an.object();
            expect(result.data()).to.be.equal(expectedResult);
        });
    });

});
