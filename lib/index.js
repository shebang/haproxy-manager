'use strict';


// Load Dependecies

const Net = require('net');
const Ssh2 = require('ssh2');
const Joi = require('joi');

const Response = require('./response');
const SshConnection = require('./ssh-connection')(Ssh2);
const SocketConnection = require('./socket-connection');

// Load Modules
const ConnectionManager = require('./connection-manager')(
    Net,
    SshConnection,
    SocketConnection,
    Response
);

// Load entrypoint module
const Haproxy = require('./haproxy')(ConnectionManager, Joi);

exports.Haproxy = Haproxy;
