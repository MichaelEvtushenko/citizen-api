const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const {userAgent} = require('koa-useragent');

const errorHandlerMiddleware = require('./error-handler.middleware');
const isHttpBodyEmptyMiddleware = require('./validation/is-http-body-empty.middleware');

module.exports = app => {
    app.use(userAgent);
    app.use(logger());
    app.use(bodyParser());
    app.use(errorHandlerMiddleware);
    app.use(isHttpBodyEmptyMiddleware);
};
