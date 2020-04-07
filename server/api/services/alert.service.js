const alertQuery = require('../../data/queries/alert.query');
const approvalQuery = require('../../data/queries/approval.query');
const {convertToMetres} = require('../../helpers/unit.helper');
const {throwInCase} = require('../../helpers/validation.helper');

const alertRadius = 30;

// TODO: make anti-spam system
const createAlert = async ({userId, description, latitude, longitude}) => {
    await alertQuery.insert({userId, description, latitude, longitude});
};

const approveAlert = async ({userId, alertId, approve}) => {
    const [alertFromDb] = await alertQuery.findByAlertId(alertId);
    throwInCase(!alertFromDb, {message: 'Not found', status: 404});
    const [approvalFromDb] = await approvalQuery.findByUserId(userId);
    throwInCase(approvalFromDb, {
        message: {message: 'Approval already created', approve: approvalFromDb.approve},
        status: 400
    });
    approve = approve === 'true';
    await approvalQuery.insert({userId, alertId, approve});
};

const findAlertsInRadius = ({latitude, longitude, radius = 30, unit = 'm', limit = 10}) => {
    throwInCase(!(longitude && latitude), {message: 'Longitude or latitude is not valid', status: 400});
    return {
        alerts: alertQuery.findInRadius({radius: convertToMetres(unit, radius), longitude, latitude, limit}),
        radius,
        unit,
        limit
    };
};

module.exports = {
    createAlert,
    approveAlert,
    findAlertsInRadius,
};
