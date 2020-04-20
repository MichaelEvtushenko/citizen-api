const Router = require('koa-router');
const multer = require('@koa/multer');

const protectedRoute = require('../middlewares/protected.middleware');
const alertValidation = require('../middlewares/validation/alert.middleware');
const alertService = require('../services/alert.service');
const {API_ALERTS_URL} = require('../../config/url.config');

const router = new Router({prefix: '/alerts'});
const upload = multer();

router.post('/', protectedRoute(), alertValidation, async ctx => {
    const [{alertId}] = await alertService.createAlert({userId: ctx.state.userId, ...ctx.state.alert});
    ctx.status = 201;
    ctx.set('Location', `${API_ALERTS_URL}/${alertId}`);
});

router.patch('/:alertId/photos', protectedRoute(), upload.array('photos', 8), async ctx => {
    const [{photoUrls}] = await alertService.uploadPhotos({files: ctx.files, alertId: ctx.params.alertId});
    ctx.status = 204;
    ctx.set('Content-Location', photoUrls);
});

router.post('/:alertId/approvals', protectedRoute(), async ctx => {
    const {userId} = ctx.state;
    const {alertId} = ctx.params;
    const {approved} = ctx.query;
    const [approval] = await alertService.approveAlert({userId, alertId, approved});
    ctx.app.emit('approvalCreated', approval);
    ctx.status = 200;
    ctx.body = {approved: approval.approved};
});

router.get('/', async ctx => {
    const {lat: latitude, lng: longitude, ...params} = ctx.query;
    const {alerts, ...rest} = alertService.findAlertsInRadius({latitude, longitude, ...params});
    ctx.status = 200;
    ctx.body = {alerts: await alerts, ...rest};
});

router.get('/:alertId', async ctx => {
    const {alertId} = ctx.params;
    const [alertFromDb] = await alertService.findByAlertId(alertId);
    ctx.assert(alertFromDb, 404, 'Not Found');
    ctx.status = 200;
    ctx.body = alertFromDb;
});

module.exports = router;
