const Router = require('koa-router');

const userService = require('../services/user.service');
const protectedRoute = require('../middlewares/protected.middleware');

const router = new Router({prefix: '/users'});

router.get('/:userId', protectedRoute(), async ctx => {
    const [userFromDb] = await userService.findById(ctx.params.userId);
    ctx.assert(userFromDb, 404, 'Not Found');
    ctx.status = 200;
    ctx.body = userFromDb;
});

module.exports = router;
