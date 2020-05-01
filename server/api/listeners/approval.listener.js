const {updateAlertStatus} = require('../services/alert.service');

module.exports = app => {
    app.on('approvalCreated', ({alertId}) => {
        setTimeout(() => {
            updateAlertStatus(alertId)
                .catch(err => {
                    console.error('Error occurred while updating alert status:', err);
                })
        }, 0);
    });
};
