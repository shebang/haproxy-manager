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
            const result = parser.parseHaproxyOutput(data, ' ', 'test');
            expect(result).to.be.equal({ 'test': [{ a: '1', b: '2' }] });
            expect(result).to.be.an.object();
            expect(result.test[0]).to.be.an.object();
        });

        it('should return an array of objects without param startOffset and \',\' is the last character on a line', () => {

            const data = '# a,b,\n1,2,';
            const result = parser.parseHaproxyOutput(data, ',', 'test');
            expect(result).to.be.equal({ 'test': [{ a: '1', b: '2' }] });
            expect(result).to.be.an.object();
            expect(result.test[0]).to.be.an.object();
        });

        it('should return an array of objects with param startOffset and output format on line 1', () => {

            const data = '1\n# a,b\n1,2';
            const result = parser.parseHaproxyOutput(data, ',', 'test', 1);
            expect(result).to.be.equal({ 'test': [{ a: '1', b: '2' }] });
            expect(result).to.be.an.object();
            expect(result.test[0]).to.be.an.object();
        });

        it('should return an array of objects and ignoe empty lines', () => {

            const data = '# a,b\n1,2\n';
            const result = parser.parseHaproxyOutput(data, ',', 'test');
            expect(result).to.be.equal({ 'test': [{ a: '1', b: '2' }] });
            expect(result).to.be.an.object();
            expect(result.test[0]).to.be.an.object();
        });
    });

    experiment('_deleteLastCharFromStrings', () => {

        it('should remove the last character from an array of strings', () => {

            const data = ['1,','2','1,2,'];
            const result = parser._deleteLastCharFromStrings(data, ',');
            expect(result).to.be.an.array();
            expect(result).to.be.equal(['1','2','1,2']);
        });
    });

    experiment('_parseRawData', () => {

        it('should return fields and data lines with param startOffset', () => {

            const data = '1\n# a b\n1 2\n3 4';
            const result = parser._parseRawData(data, ' ', 1);
            expect(result.fields).to.be.an.array();
            expect(result.fields).to.be.equal(['a','b']);
            expect(result.data).to.be.an.array();
            expect(result.data).to.be.equal(['1 2','3 4']);
        });

        it('should return fields and data lines without param startOffset', () => {

            const data = '# a b\n1 2\n3 4';
            const result = parser._parseRawData(data, ' ');
            expect(result.fields).to.be.an.array();
            expect(result.fields).to.be.equal(['a','b']);
            expect(result.data).to.be.an.array();
            expect(result.data).to.be.equal(['1 2','3 4']);
        });

        it('should remove last character \',\' of each line', () => {

            const data = '# a,b,\n1,2';
            const result = parser._parseRawData(data, ',');
            expect(result.fields).to.be.an.array();
            expect(result.fields).to.be.equal(['a','b']);
            expect(result.data).to.be.an.array();
            expect(result.data).to.be.equal(['1,2']);
        });
    });

    /*experiment('parseServersState', () => {

        it('should return servers state', () => {

            let data;
            data += '1\n';
            data += '# be_id be_name srv_id srv_name srv_addr srv_op_state\n';
            data += '3 servers 1 i-07dcd59ded437b0e8 10.11.45.226 2\n';
            data += '3 servers 2 i-0c16773ceb4b2d619 10.11.26.229 2\n';
            data += '3 servers 3 i-0724abfb014284b53 10.11.5.120 2\n';
            data += '4 websockets 1 i-07dcd59ded437b0e8 10.11.45.226 2\n';
            data += '4 websockets 2 i-0c16773ceb4b2d619 10.11.26.229 2\n';
            data += '4 websockets 3 i-0724abfb014284b53 10.11.5.120 2\n';
            const result = parser.parseServersState(data, ' ');
            expect(result.servers).to.be.an.object();
            expect(result.servers.be_id).to.be.equal('3');
            expect(result.servers.servers[0].srv_id).to.be.equal('1');
            expect(result.servers.servers[0].srv_name).to.be.equal('i-07dcd59ded437b0e8');
        });
    });*/
});
