'use strict';

const express = require('express');        // call express
const router = express.Router();
const logger = require('../../utils/logger');
const testService = require('../../services/test_service/test_service');

module.exports = function (app) {
    
    router.get('/single',
        function (req, res, next) {
            testService.getSingleResponse()
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(err) {
                    logger.log('error', err);
                    next(err);
                });
        });

    router.get('/array',
        function (req, res, next) {
            testService.getArrayResponse()
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(err) {
                    logger.log('error', err);
                    next(err);
                });
        });

    router.post('/array',
        function (req, res, next) {
            //Do something
            res.send({'result': 'success'});
        });

    router.put('/array',
        function (req, res, next) {
            //Do something
            res.send({'result': 'success'});
        });


    return router;
};