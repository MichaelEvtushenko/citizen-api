const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const {userAgent} = require('koa-useragent');
const cors = require('@koa/cors');

const errorHandlerMiddleware = require('./error-handler.middleware');

module.exports = app => {
    app.use(cors());
    app.use(userAgent);
    app.use(logger());
    app.use(bodyParser());
    app.use(errorHandlerMiddleware);
};
