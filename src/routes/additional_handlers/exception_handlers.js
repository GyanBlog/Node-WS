'use strict';
const errors = require('../../errors/errors');
const logger = require('../../utils/logger');

module.exports = function (app) {
    //Catch 302 and make that an 401 and do an custom direct in the UI once we get this error code.
    app.use(function (req, res, next) {
        let original = res.end;

        function headersHook() {
            res.end = original;
            if (!res.headersSent && res.statusCode === 302) {
                if (req.url && (req.url.startsWith('/auth/dummylogin'))) {
                    res.status(401).send({redirectUrl: res.getHeader('location')});
                }
            }

            /* jshint -W040 */
            return original.apply(this, arguments);
            /* jshint +W040 */
        }

        res.end = headersHook;

        if (next) {
            next();
        }
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        switch (err.constructor) {
            case errors.AuthorizationError:
                res.status(403).send({message: err.message});
                break;
            case errors.ValidationError:
                res.status(err.status || 400).send({message: err.message});
                break;
            case errors.DoesNotExistsError:
            case errors.ImageProcessingError:
                res.status(err.status || 404).send({message: err.message});
                break;
            case errors.SamlAuthenticationError:
                res.status(err.status || 401).send(err.message);
                break;
            case errors.NotAllowedError:
                res.status(err.status || 405).send(err.message);
                break;
            case errors.CsvFormatInvalidError:
                res.status(err.status || 400).send({message: err.message});
                break;
            default:
                //Else send the internal server error
                if (err.status !== 404) {
                    logger.log('error', err);
                    res.status(err.status || 500).send({message: 'Internal server error'});
                } else {
                    if (err.status === 404) {
                        res.status(err.status).send({message: 'Not found'});
                    } else {
                        next();
                    }
                }
        }
    });
};