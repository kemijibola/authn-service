const express = require('express');
const app = express();
const server = require('./server/server');
const config = require('config');

server({
    app,
    port: config.get('server')
});

