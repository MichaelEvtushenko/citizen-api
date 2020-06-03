const Router = require('koa-router');

const userService = require('../services/user.service');
const protectedRoute = require('../middlewares/protected.middleware');
const CustomError = require('../../helpers/types/custom-error.type');

const router = new Router({prefix: '/users'});

router.get('/:userId', protectedRoute(), async ctx => {
    ctx.status = 200;
    ctx.body = await userService.findDetailsById(ctx.params.userId);
});

router.patch('/:userId/role', protectedRoute(['admin', 'super-admin']), async ctx => {
    await userService.updateRole({
        userId: ctx.params.userId,
        newRole: ctx.request.body.role,
        adminId: ctx.state.userId
    });
    ctx.status = 204;
});

router.patch('/:userId/enabled', protectedRoute(['moderator', 'admin', 'super-admin']), async ctx => {
    await userService.updateEnabledStatus({...ctx.params, ...ctx.request.body});
    ctx.status = 204;
});

router.patch('/fullname', protectedRoute(), async ctx => {
    await userService.updateFullname({...ctx.state, ...ctx.request.body})
    ctx.status = 204;
});

// TODO: implement
router.patch('/password', protectedRoute(), _ => {
    throw new CustomError('Not Implemented', 501);
});

module.exports = router;
