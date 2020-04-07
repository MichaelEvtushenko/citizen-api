const Router = require('koa-router');

const protectedRoute = require('../middlewares/protected.middleware');
const alertValidation = require('../middlewares/validation/alert.middleware');
const alertService = require('../services/alert.service');

const router = new Router({prefix: '/alert'});

// TODO: set protectedRoute()
router.post('/', alertValidation, async ctx => {
    const userId = ctx.state.userId || 88;
    await alertService.createAlert({...ctx.state.alert, userId});
    ctx.status = 204;
});

// TODO: set protectedRoute()
router.post('/approval/:alertId', async ctx => {
    const userId = ctx.state.userId || 88;
    const alertId = ctx.params.alertId;
    const approve = ctx.query['approve'];
    await alertService.approveAlert({userId, alertId, approve});
    ctx.status = 204;
});

// TODO: ?? set protectedRoute() ??
router.get('/', async ctx => {
    const {lat: latitude, lng: longitude, radius, unit, limit} = ctx.query;
    const {alerts, ...rest} = alertService.findAlertsInRadius({latitude, longitude, radius, unit, limit});
    ctx.body = {
        alerts: await alerts,
        ...rest
    };
});

module.exports = router;
