const alertQuery = require('../../data/queries/alert.query');
const approvalQuery = require('../../data/queries/approval.query');
const commentQuery = require('../../data/queries/comment.query');
const {convertToMetres} = require('../../helpers/unit.helper');
const {isLocationValid, isIdValid} = require('../../helpers/validation.helper');
const {throwInCase, trowInCaseLambda} = require('../../helpers/exception.helper');
const s3BucketHelper = require('../../helpers/s3-bucket.helper');

const STATUS = Object.freeze({
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
    throwInCase(!alertFromDb, {message: 'Not found', status: 404});

    const [approvalFromDb] = await approvalQuery.findByAlertIdAndUserId({userId, alertId});
    trowInCaseLambda(approvalFromDb, () => ({
        message: {message: 'Approval already created', approved: approvalFromDb.approved},
        status: 400
    }));

    approved = approved === 'true';
    return approvalQuery.insert({userId, alertId, approved});
};

const findAlertsInRadius = ({latitude, longitude, radius = 500, unit = 'm', limit = 10}) => {
    if (!isLocationValid({latitude, longitude}))
        throw {message: 'Longitude or latitude is not valid', status: 400};

    const alerts = alertQuery.findInRadius({radius: convertToMetres(unit, radius), longitude, latitude, limit});
    return {alerts, radius, unit, limit};
};

const uploadPhotos = async ({files, alertId}) => {
    const ex = {message: 'Not Found', status: 404};
    throwInCase(alertId <= 0, ex);
    const [fromDb] = await findByAlertId(alertId);
    throwInCase(!fromDb, ex);

    const links = (await Promise.all(s3BucketHelper.upload(files)))
        .map(res => res.Location);

    return alertQuery.updatePhotoUrls({alertId, photoUrls: links});
};

const findByAlertId = async (alertId) => {
    throwInCase(!isIdValid(alertId), {message: `Not Found`, status: 404});
    return alertQuery.findByAlertId(alertId);
};

const findDetailAlert = async (alertId) => {
    const [alertFromDb] = await findByAlertId(alertId);
    throwInCase(!alertFromDb, {message: `Not Found`, status: 404});

    const {rows: [{allCount, approvesCount}]} = await approvalQuery.getStatistics(alertId);
    return {...alertFromDb, approvalCount: allCount, approvesCount};
};

const updateAlertStatus = async (alertId) => {
    const {rows: [{allCount, approvesCount}]} = await approvalQuery.getStatistics(alertId);
    const ratio = allCount > 1 ? Math.round(100 * (approvesCount / allCount)) : 0;
    if (!ratio) return;

    const [{status}] = await alertQuery.findByAlertId(alertId);
    let updatedStatus;

    if (ratio >= 75 && status !== STATUS.RED)
        updatedStatus = STATUS.RED;
    else if (ratio >= 50 && status !== STATUS.YELLOW)
        updatedStatus = STATUS.YELLOW;
    else if (status !== STATUS.GREY)
        updatedStatus = STATUS.GREY;

    if (updatedStatus) {
        await alertQuery.updateStatus({alertId, status: updatedStatus});
        console.log(`Alert [ID: ${alertId}] changed status -> '${updatedStatus}'`);
    }
};

const deleteAlert = async (alertId) => {
    const ex = {message: 'Not Found', status: 404};
    throwInCase(!isIdValid(alertId), ex);
    const [alertFromDb] = await findByAlertId(alertId);
    throwInCase(!alertFromDb, ex);
    return alertQuery.deleteByAlertId(alertId);
};

const createComment = ({alertId, userId, description}) => commentQuery.insert({alertId, userId, description});

const findComments = ({alertId, limit = 10, offset = 0}) => {
    throwInCase(!isIdValid(alertId), {message: 'Not Found', status: 404});
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
};
