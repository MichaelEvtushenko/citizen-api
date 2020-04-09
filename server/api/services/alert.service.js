const alertQuery = require('../../data/queries/alert.query');
const approvalQuery = require('../../data/queries/approval.query');
const {convertToMetres} = require('../../helpers/unit.helper');
const {throwInCase, trowInCaseLambda, isLocationValid} = require('../../helpers/validation.helper');
const s3BucketHelper = require('../../helpers/s3-bucket.helper');

// TODO: make anti-spam system
const createAlert = ({userId, description, latitude, longitude}) => {
    return alertQuery.insert({userId, description, latitude, longitude});
};

const approveAlert = async ({userId, alertId, approve}) => {
    const [alertFromDb] = await alertQuery.findByAlertId(alertId);
    throwInCase(!alertFromDb, {message: 'Not found', status: 404});
    const [approvalFromDb] = await approvalQuery.findByAlertIdAndUserId({userId, alertId});
    trowInCaseLambda(approvalFromDb, () => ({
        message: {message: 'Approval already created', approve: approvalFromDb.approve},
        status: 400
    }));
    approve = approve === 'true';
    return approvalQuery.insert({userId, alertId, approve});
};

const findAlertsInRadius = ({latitude, longitude, radius = 30, unit = 'm', limit = 10}) => {
    if (!isLocationValid({latitude, longitude}))
        throw {message: 'Longitude or latitude is not valid', status: 400};
    const alerts = alertQuery.findInRadius({radius: convertToMetres(unit, radius), longitude, latitude, limit});
    return {alerts, radius, unit, limit};
};

const uploadPhotos = async ({files, alertId}) => {
    const links = (await Promise.all(s3BucketHelper.upload(files)))
        .map(res => res.Location);
    return alertQuery.updatePhotoUrls({alertId, photoUrls: links});
};

const findByAlertId = (alertId) => {
    throwInCase(alertId <= 0, {message: `Alert ID is not valid`, status: 400});
    return alertQuery.findByAlertId(alertId);
};

module.exports = {
    createAlert,
    approveAlert,
    findAlertsInRadius,
    uploadPhotos,
    findByAlertId,
};
