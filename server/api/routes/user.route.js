const Router = require('koa-router');

const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const registerValidation = require('../middlewares/validation/register.middleware');
const signInMiddleware = require('../middlewares/validation/signIn.middleware');
const protectedRoute = require('../middlewares/protected.middleware');

const router = new Router({prefix: '/user'});

router.get('/test', protectedRoute(['user']), async ctx => {
    ctx.body = 'ok';
});

router.get('/:userId', async ctx => {
    const userId = +ctx.params.userId;
    ctx.assert(userId, 400, 'User id must be a number');

    const [userFromDb] = await userService.getById(userId);
    ctx.assert(userFromDb, 404, 'User not found');

    ctx.body = userFromDb;
});

router.post('/login', signInMiddleware, async ctx => {
    const token = await authService.authenticate(ctx.state.credentials);
    ctx.body = token;
});

router.post('/register', registerValidation, async ctx => {
    ctx.body = await authService.register(ctx.state.user);
    ctx.status = 204;
});

module.exports = router;

