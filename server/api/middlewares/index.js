const bodyParser = require('koa-bodyparser');

const errorHandlerMiddleware = require('./error-handler.middleware');
const isHttpBodyEmptyMiddleware = require('./is-http-body-empty.middleware');

module.exports = app => {
    app.use(bodyParser());
    app.use(errorHandlerMiddleware);
    app.use(isHttpBodyEmptyMiddleware);
};
