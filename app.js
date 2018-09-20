'use strict';

const logger = require('./src/utils/logger');
const express = require('express');
const config = require('./src/config/configuration');
const app = express();

//Input Validation
const Celebrate = require('celebrate');

//Setup app with defaults
let server = require('./src/server/server')(app, config);

server.init(app, config)
    .then(function () {
        return server.setupSession();
    })
    .then(function () {
        const testRoute = require('./src/routes/test/route')(app);
        app.use('/api/test', testRoute);
    })
    .then(function () {
        app.use(Celebrate.errors());
    })
    .then(function () {
        require('./src/routes/additional_handlers/exception_handlers')(app);
    })
    .then(function () {
        logger.log('info', 'System is up and running');
    })
    .catch(function (err) {
        logger.log('error', err);
        process.exit(-1);
    });

