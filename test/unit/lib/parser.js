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

describe('Parser', () => {

    let sandbox = null;

    /*let showStatMockData = null;
    let showServersStateMockData = null;*/
    let parser = null;

    beforeEach(() => {

        //showStatMockData = Fs.readFileSync(Path.resolve(__dirname, '../../../data/haproxy/1.6.3/show-stat'), 'UTF-8');
        //showServersStateMockData = Fs.readFileSync(Path.resolve(__dirname, '../../../data/haproxy/1.6.3/show-servers-state'), 'UTF-8');
        sandbox = Sinon.createSandbox();
        parser = require('../../../lib/parser.js')();
    });

    afterEach(() => {

        /*showStatMockData = null;
        showServersStateMockData = null;*/
        parser = null;
        sandbox.restore();

    });
    experiment('_parseHeader', () => {

        it('should return an array of fields when parsing with delimiter \' \'', () => {

            const data = '# be_id be_name';
            const result = parser._parseHeader(data, ' ');
            expect(result).to.be.equal(['be_id', 'be_name']);
            expect(result).to.be.an.array();
        });
        it('should return an array of fields when parsing with delimiter \',\'', () => {

            const data = '# a,b,c';
            const result = parser._parseHeader(data, ',');
            expect(result).to.be.equal(['a', 'b', 'c']);
            expect(result).to.be.an.array();
        });
    });
    experiment('_parseDataLine', () => {

        it('should return an array of fields', () => {

            const data = '# a b';
            const result = parser._parseDataLine(data, ' ');
            expect(result).to.be.equal(['a', 'b']);
            expect(result).to.be.an.array();
        });
    });
    experiment('parseHaproxyOutput', () => {


        it('should return an array of objects without param startOffset', () => {

            const data = '# a b\n1 2';
            const result = parser.parseHaproxyOutput(data, ' ');
            expect(result).to.be.equal([{ a: '1', b: '2' }]);
            expect(result).to.be.an.array();
            expect(result[0]).to.be.an.object();
            //await expect(AutoScaling.getTargetGroupHealth(autoscalingDataMock)).to.not.reject();
        });
        it('should return an array of objects without param startOffset and \',\' is the last character on a line', () => {

            const data = '# a,b,\n1,2,';
            const result = parser.parseHaproxyOutput(data, ',');
            expect(result).to.be.equal([{ a: '1', b: '2' }]);
            expect(result).to.be.an.array();
            expect(result[0]).to.be.an.object();
            //await expect(AutoScaling.getTargetGroupHealth(autoscalingDataMock)).to.not.reject();
        });
        it('should return an array of objects with param startOffset and unknwo data on line 1', () => {

            const data = '1\n# a,b\n1,2';
            const result = parser.parseHaproxyOutput(data, ',', 1);
            expect(result).to.be.equal([{ a: '1', b: '2' }]);
            expect(result).to.be.an.array();
            expect(result[0]).to.be.an.object();
            //await expect(AutoScaling.getTargetGroupHealth(autoscalingDataMock)).to.not.reject();
        });
        it('should return an array of objects and ignoe empty lines', () => {

            const data = '# a,b\n1,2\n';
            const result = parser.parseHaproxyOutput(data, ',');
            expect(result).to.be.equal([{ a: '1', b: '2' }]);
            expect(result).to.be.an.array();
            expect(result[0]).to.be.an.object();
        });
    });
});
