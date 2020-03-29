const Router = require('koa-router');

const registerValidation = require('../middlewares/validation/register.middleware');
const signInMiddleware = require('../middlewares/validation/sign-in.middleware');
const authService = require('../services/auth.service');
const router = new Router({prefix: '/auth'});

router.get('/activate/:linkId', async ctx => {
    const linkId = ctx.params.linkId;
    await authService.activateLink(linkId);
    ctx.status = 200;
});

router.post('/login', signInMiddleware, async ctx => {
    ctx.body = await authService.authenticate(ctx.state.credentials);
    ctx.status = 200;
});

router.post('/register', registerValidation, async ctx => {
    ctx.body = await authService.register(ctx.state.user);
    ctx.status = 204;
});

module.exports = router;
