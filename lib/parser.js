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

    internals.parseHaproxyOutput = (rawData, delimiter, startOffset) => {

        let index = 0;
        const retval = [];

        const data = rawData.split(/(?:\r\n|\r|\n)/g);

        if (startOffset > 0) {
            index = startOffset;
        };

        let header = data[index].trim();
        // remove last empty header field, when delimiter is ,
        if (delimiter === ',' && header[header.length - 1] === ',') {
            header = header.substr(0, header.length - 1);
        };
        const fields = internals._parseHeader(header, delimiter);

        Debug('fields:', fields);
        Debug('data:', data);

        for (let i = index + 1; i < data.length; ++i) {

            let line = data[i].trim();

            if (line.length > 0) {
                if (delimiter === ',' && line[line.length - 1] === ',') {
                    line = line.substr(0, line.length - 1);
                };

                const values = internals._parseDataLine(line, delimiter);
                const obj = {};

                for (let j = 0; j < fields.length; ++j) {
                    obj[fields[j]] = values[j];
                }
                retval.push(obj);
            };
        };

        return retval;
    };

    return {
        _parseHeader: internals._parseHeader,
        _parseDataLine: internals._parseHeader,
        parseHaproxyOutput: internals.parseHaproxyOutput
    };

};
