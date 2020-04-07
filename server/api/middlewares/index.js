const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const {userAgent} = require('koa-useragent');

const errorHandlerMiddleware = require('./error-handler.middleware');

module.exports = app => {
    app.use(userAgent);
    app.use(logger());
    app.use(bodyParser());
    app.use(errorHandlerMiddleware);
};
