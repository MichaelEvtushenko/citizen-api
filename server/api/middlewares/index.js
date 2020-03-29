const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

const errorHandlerMiddleware = require('./error-handler.middleware');
const isHttpBodyEmptyMiddleware = require('./validation/is-http-body-empty.middleware');

module.exports = app => {
    app.use(logger());
    app.use(bodyParser());
    app.use(errorHandlerMiddleware);
    app.use(isHttpBodyEmptyMiddleware);
};
