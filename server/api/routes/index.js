const Router = require('koa-router');

const apiRouter = new Router({prefix: '/api'});
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const alertRouter = require('./alert.route');

module.exports = app => {
    apiRouter.use(userRouter.routes());
    apiRouter.use(authRouter.routes());
    apiRouter.use(alertRouter.routes());

    app.use(apiRouter.routes());
};
