const Router = require('koa-router');
const multer = require('@koa/multer');

const protectedRoute = require('../middlewares/protected.middleware');
const alertValidation = require('../middlewares/validation/alert.middleware');
const alertService = require('../services/alert.service');
const {created} = require('../../helpers/router.helper');

const router = new Router({prefix: '/alerts'});
const upload = multer();

const baseUri = 'api/alert/';

router.post('/', protectedRoute(), alertValidation, async ctx => {
    const {alertId} = await alertService.createAlert({userId: ctx.state.userId, ...ctx.state.alert});
    created(ctx, `${baseUri}/${alertId}`);
});

const s3Helper = require('../../helpers/s3-bucket.helper');
router.patch('/:alertId/photos', protectedRoute(), upload.array('photos', 4), async ctx => {
    s3Helper.upload(ctx.request.files);
});

router.post('/approval/:alertId', protectedRoute(), async ctx => {
    const {userId} = ctx.state;
    const {alertId} = ctx.params;
    const {approve} = ctx.query;
    await alertService.approveAlert({userId, alertId, approve});
    ctx.status = 204;
});

router.get('/', async ctx => {
    const {lat: latitude, lng: longitude, ...params} = ctx.query;
    const {alerts, ...rest} = alertService.findAlertsInRadius({latitude, longitude, ...params});
    ctx.body = {alerts: await alerts, ...rest};
});

module.exports = router;
