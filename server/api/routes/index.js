const Router = require('koa-router');

const apiRouter = new Router({prefix: '/api'});
const userRouter = require('./user.route');
const authRouter = require('./auth.route');

module.exports = app => {
    apiRouter.use(userRouter.routes());
    apiRouter.use(authRouter.routes())

    app.use(apiRouter.routes());
};
