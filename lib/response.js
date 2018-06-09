'use strict';

//const Debug = require('debug')('haproxy-manager:haproxy');
const Jsonata = require('jsonata');
const Parser = require('./parser.js')();

const defaultOptions = {

    rawDataOffset: 0,
    csvDelimiter: ','
};

const internals = {

};

exports = module.exports = internals.Response = class {

    constructor(data, options) {

        this._data = data;
    }

    data() {

        return this._data;
    };

    query(queryString) {

        if (queryString) {
            const expression = Jsonata(queryString);
            return expression.evaluate(this._data);
        }

        return this._data;

    };

    static createResponse(request, type, options) {

        return new Promise((resolve, reject) => {

            request.then((data) => {

                const localOptions = Object.assign({}, defaultOptions, options);
                const result = Parser.parseHaproxyOutput(data.toString(), localOptions.csvDelimiter, type, localOptions.rawDataOffset);
                const response = new internals.Response(result, localOptions);

                resolve(response);
            });
        });
    };
};
