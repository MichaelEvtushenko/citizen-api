const Router = require('koa-router');

const registerValidation = require('../middlewares/validation/register.middleware');
const signInMiddleware = require('../middlewares/validation/signIn.middleware');
const authLinkQuery = require('../../data/queries/auth-link.query');
const userQuery = require('../../data/queries/user.query');
const authService = require('../services/auth.service');
const router = new Router({prefix: '/auth'});


// TODO: carriage to separate service method
router.get('/activate/:linkId', async ctx => {
    const linkId = ctx.params.linkId;
    const [{user_id: userId}] = await authLinkQuery.findByLinkId(linkId);
    await authLinkQuery.update({link_id: linkId, used: true});
    await userQuery.update({userId, enabled: true});
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
