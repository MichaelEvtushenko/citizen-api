const {updateAlertStatus} = require('../services/alert.service');

module.exports = app => {
    app.on('approvalCreated', ({alertId}) => {
        setTimeout(updateAlertStatus.bind(null, alertId), 0);
    });
};
