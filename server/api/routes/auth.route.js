const Router = require('koa-router');

const registerMiddleware = require('../middlewares/validation/register.middleware');
const signInMiddleware = require('../middlewares/validation/sign-in.middleware');
const protectedRoute = require('../middlewares/protected.middleware');
const authService = require('../services/auth.service');
const router = new Router({prefix: '/auth'});

// TODO: POST instead of GET
router.get('/activate/:linkId', async ctx => {
    const linkId = ctx.params.linkId;
    await authService.activateLink(linkId);
    ctx.status = 204;
});

router.post('/login', signInMiddleware, async ctx => {
    const {email, password} = ctx.state.credentials;
    const userAgent = ctx.userAgent._agent.source;
    ctx.status = 200;
    ctx.body = await authService.authenticate({email, password, userAgent});
});

router.post('/register', registerMiddleware, async ctx => {
    await authService.register(ctx.state.user);
    ctx.status = 204;
});

// TODO: POST instead of GET
router.get('/logout/:refreshToken', async ctx => {
    const refreshToken = ctx.params.refreshToken;
    await authService.logout(refreshToken);
    ctx.status = 204;
});

// TODO: POST instead of GET
router.get('/logout-all', protectedRoute(), async ctx => {
    const {userId} = ctx.state;
    await authService.logoutAll(userId);
    ctx.status = 204;
});

// TODO: POST instead of GET
router.get('/refresh/:token', async ctx => {
    const refreshToken = ctx.params.token;
    const userAgent = ctx.userAgent._agent.source;
    ctx.status = 200;
    ctx.body = await authService.refreshToken({refreshToken, userAgent});
});

module.exports = router;
