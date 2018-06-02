'use strict';

const Debug = require('debug')('haproxy-manager:parser');
//const Config = require('config');

module.exports = () => {

    const internals = {

    };

    internals._parseHeader = (rawData, delimiter) => {

        const fields = rawData.toString().split(delimiter);

        // remove '# ' from first header field
        fields[0] = fields[0].substr(2);

        // remove 1st empty header field, when delimiter is a space
        if (delimiter === ' ') {
            fields.splice(0, 1);
        };

        return fields;
    };

    internals._parseDataLine = (rawData, delimiter) => {

        const fields = rawData.toString().split(delimiter);

        return fields;
    };

    internals._deleteLastCharFromStrings = (data, char) => {

        return data.map((el) => {

            let retval = null;

            if (el[el.length - 1] === char) {
                retval = el.substr(0, el.length - 1);
            }
            else {
                retval = el;
            };

            return retval;
        });
    };

    internals._parseRawData = (rawData, delimiter, startOffset) => {

        let index = 0;
        const retval = {
            fields: [],
            data: []
        };

        let data = rawData.split(/(?:\r\n|\r|\n)/g);

        if (delimiter === ',') {
            data = internals._deleteLastCharFromStrings(data, ',');
        };

        if (startOffset > 0) {
            index = startOffset;
        };

        retval.fields = internals._parseHeader(data[index].trim(), delimiter);
        retval.data = data.slice(index + 1);

        return retval;
    };

    internals.parseHaproxyOutput = (rawData, delimiter, indexName, startOffset) => {

        const retval = {

        };
        retval[indexName] = [];
        const pd = internals._parseRawData(rawData, delimiter, startOffset);

        Debug('fields:', pd.fields);
        Debug('data:', pd.data);

        // iteration over rows
        for (let i = 0; i < pd.data.length; ++i) {

            const line = pd.data[i].trim();

            if (line.length > 0) {

                const values = internals._parseDataLine(line, delimiter);
                const obj = {};

                // iteration over columns
                for (let j = 0; j < pd.fields.length; ++j) {
                    obj[pd.fields[j]] = values[j];
                }
                retval[indexName].push(obj);
            };
        };

        return retval;
    };

    return {
        _parseHeader: internals._parseHeader,
        _parseDataLine: internals._parseHeader,
        _parseRawData: internals._parseRawData,
        _deleteLastCharFromStrings: internals._deleteLastCharFromStrings,
        parseHaproxyOutput: internals.parseHaproxyOutput
    };

};
