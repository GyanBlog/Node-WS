'use strict';

const logger = require('../utils/logger');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressWinston = require('express-winston');

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (err) {
        logger.log('error', err);
    }
    if (options.exit) {
        logger.log('info', 'Application shutting down');
        if (err) {
            process.exit(-1);
        } else {
            process.exit();
        }
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {exit: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

class ServerConfig {
    constructor(app, config) {
        this._app = app;
        this._config = config;

        this._secret = 'Haha random secret key which has some meaning';
    }

    _setupLogger() {
        const msg = 'HTTP method={{req.method}} url={{req.url}} user={{req.user_id}} source={{req.user_source}} statusCode={{res.statusCode}}' +
            ' responseTime={{res.responseTime}} X-Forwarded-For={{req.headers[\'x-forwarded-for\']}} ' +
            'X-Client-Name={{req.headers[\'x-client-name\']}} X-Client-Version={{req.headers[\'x-client-version\']}}';
        //Setup logging for express
        this._app.use(expressWinston.logger({
            winstonInstance: logger,
            meta: false,
            msg: msg
        }));

        this._app.use(expressWinston.errorLogger({
            winstonInstance: logger,
            meta: false,
            msg: msg
        }));
    }

    _setupPlugins() {
        //Setup to access csp-report via the browser and set upload limit to 10mb
        this._app.use(bodyParser.json({
            type: ['json', 'application/csp-report'],
            limit: '20mb'
        }));
        //Also enable urlencoding for body
        this._app.use(bodyParser.urlencoded({extended: false}));
        this._app.use(cookieParser(this._secret));
        this._app.disable('x-powered-by');
    }

    _startServer() {
        /**
         * Get port from environment and store in Express.
         */
        const port = normalizePort(this._config.get('self').port);

        /**
         * Event listener for HTTP server "error" event.
         */
        this._app.on('error', (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    logger.log('error', bind, ' requires elevated privileges');
                    process.exit(-1);
                    break;
                case 'EADDRINUSE':
                    logger.log('error', bind, ' is already in use');
                    process.exit(-1);
                    break;
                default:
                    throw error;
            }
        });

        this._app.set('port', port);
        return new Promise(function (resolve) {
            this._app.listen(port, function() {
                logger.log('info', 'Listening on', port);
                resolve();
            }.bind(this));
        }.bind(this));
    }

    init() {
        this._setupLogger();
        this._setupPlugins();
        return this._startServer();
    }

    setupSession() {
        return new Promise(function (resolve) {
            let sess = {
                secret: this._secret,
                maxAge: 3600000,
                cookie: {
                    maxAge: 3600000,
                    sameSite: 'strict'
                },
                resave: false,
                saveUninitialized: false
            };

            if (this._app.get('env') === 'production') {
                this._app.set('trust proxy', 1); // trust first proxy
                sess.cookie.secure = true; // serve secure cookies
            }
            this._app.use(session(sess));
            resolve();
        }.bind(this));
    }
}

module.exports = function (app, config) {
    return new ServerConfig(app, config);
};
