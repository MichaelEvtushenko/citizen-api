const Router = require('koa-router');

const userService = require('../services/user.service');
const protectedRoute = require('../middlewares/protected.middleware');

const router = new Router({prefix: '/user'});

router.get('/test', protectedRoute(), async ctx => {
    ctx.body = 'ok';
});

router.get('/admin', protectedRoute(['admin']), async ctx => {
    ctx.body = 'Hello, admin!';
});

router.get('/:userId', async ctx => {
    const userId = +ctx.params.userId;
    ctx.assert(userId, 400, 'User id must be a number');

    const [userFromDb] = await userService.getById(userId);
    ctx.assert(userFromDb, 404, 'User not found');

    ctx.body = userFromDb;
});

module.exports = router;

