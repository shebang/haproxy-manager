'use strict';


// Load Dependecies

const Net = require('net');
const Ssh2 = require('ssh2');

// Load Modules
const ConnectionManager = require('./connection-manager')(Net, Ssh2);

// Load entrypoint module
const Haproxy = require('./haproxy')(ConnectionManager);

exports.Haproxy = Haproxy;
