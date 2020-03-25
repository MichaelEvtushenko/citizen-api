const Router = require('koa-router');

const router = new Router({prefix: '/auth'});

const authLinkQuery = require('../../data/queries/auth-link.query');
const userQuery = require('../../data/queries/user.query');

router.post('/register', ctx => {

});

// TODO: carriage to separate service method
router.get('/activate/:linkId', async ctx => {
    const linkId = ctx.params.linkId;
    const [{user_id: userId}] = await authLinkQuery.findByLinkId(linkId);
    await authLinkQuery.update({link_id: linkId, used: true});
    await userQuery.update({userId, enabled: true});

});

module.exports = router;
