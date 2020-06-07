const alertQuery = require('../../data/queries/alert.query');
const approvalQuery = require('../../data/queries/approval.query');
const commentQuery = require('../../data/queries/comment.query');
const {convertToMetres} = require('../../helpers/unit.helper');
const {throwInCase, trowInCaseLambda} = require('../../helpers/exception.helper');
const {isLocationValid, isIdValid} = require('../../helpers/validation.helper');
const {uploadFiles, deleteFiles, Path} = require('../../helpers/s3-bucket.helper');
const {notFound, badRequest} = require('../../helpers/types/custom-error.type');

const Status = Object.freeze({
    RED: 'red',
    YELLOW: 'yellow',
    GREY: 'grey'
});

// TODO: make anti-spam system
const createAlert = ({userId, description, latitude, longitude}) => {
    return alertQuery.insert({userId, description, latitude, longitude});
};

const approveAlert = async ({userId, alertId, approved}) => {
    const [alertFromDb] = await alertQuery.findByAlertId(alertId);
    throwInCase(!alertFromDb, notFound());

    const [approvalFromDb] = await approvalQuery.findByAlertIdAndUserId({userId, alertId});
    trowInCaseLambda(approvalFromDb, () => ({
        message: {message: 'Approval already created', approved: approvalFromDb.approved},
        status: 400
    }));

    approved = approved === 'true';
    return approvalQuery.insert({userId, alertId, approved});
};

const findAlertsInRadius = ({latitude, longitude, radius = 500, unit = 'm', limit = 15}) => {
    throwInCase(!isLocationValid({latitude, longitude}), badRequest('Location is not valid'));

    const alerts = alertQuery.findInRadius({radius: convertToMetres(unit, radius), longitude, latitude, limit});
    return {alerts, radius, unit, limit};
};

const uploadPhotos = async ({files, alertId}) => {
    throwInCase(!isIdValid(alertId), badRequest());
    const [fromDb] = await findByAlertId(alertId);
    throwInCase(!fromDb, notFound());

    const links = (await Promise.all(uploadFiles({files, path: Path.ALERTS_PHOTOS})))
        .map(res => res.Location);

    return alertQuery.updatePhotoUrls({alertId, photoUrls: links});
};

const findByAlertId = async (alertId) => {
    throwInCase(!isIdValid(alertId), badRequest('Id is not valid'));
    return alertQuery.findByAlertId(alertId);
};

const findDetailAlert = async (alertId) => {
    const [alertFromDb] = await findByAlertId(alertId);
    throwInCase(!alertFromDb, notFound('Alert not found'));

    const {rows: [{allCount, approvesCount}]} = await approvalQuery.getStatistics(alertId);
    return {...alertFromDb, allCount, approvesCount};
};

const updateAlertStatus = async (alertId) => {
    const {rows: [{allCount, approvesCount}]} = await approvalQuery.getStatistics(alertId);
    const ratio = allCount > 1 ? Math.round(100 * (approvesCount / allCount)) : 0;
    if (!ratio) return;

    const [{status}] = await alertQuery.findByAlertId(alertId);
    let updatedStatus;

    if (ratio >= 75 && status !== Status.RED)
        updatedStatus = Status.RED;
    else if (ratio >= 50 && status !== Status.YELLOW)
        updatedStatus = Status.YELLOW;
    else if (status !== Status.GREY)
        updatedStatus = Status.GREY;

    if (updatedStatus) {
        await alertQuery.updateStatus({alertId, status: updatedStatus});
        console.log(`Alert [ID: ${alertId}] changed status -> '${updatedStatus}'`);
    }
};

const deleteAlert = async (alertId) => {
    throwInCase(!isIdValid(alertId), badRequest());
    const [alertFromDb] = await findByAlertId(alertId);
    throwInCase(!alertFromDb, notFound());

    const {photoUrls: urls} = alertFromDb;
    if (urls) {
        await deleteFiles({urls, path: Path.ALERTS_PHOTOS});
    }
    return alertQuery.deleteByAlertId(alertId);
};

const createComment = async ({alertId, userId, description}) => {
    const [alert] = await findByAlertId({alertId});
    throwInCase(!alert, notFound('Alert not found'));

    return commentQuery.insert({alertId, userId, description})
};

const deleteWasteAlerts = async () => {
    const alerts = await alertQuery.findWasteAlerts();
    await Promise.all(alerts.map(({alertId}) => deleteAlert(alertId)));
};

const findComments = ({alertId, limit = 10, offset = 0}) => {
    throwInCase(!isIdValid(alertId), badRequest());
    const comments = commentQuery.find({alertId, limit, offset});
    return {comments, limit, offset};
};

module.exports = {
    createAlert,
    approveAlert,
    findAlertsInRadius,
    uploadPhotos,
    findByAlertId,
    updateAlertStatus,
    findDetailAlert,
    deleteAlert,
    createComment,
    findComments,
    deleteWasteAlerts,
};
