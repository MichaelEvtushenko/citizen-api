const errorListener = require('./error-logger.listener');
const approvalListener = require('./approval.listener');
const alertListener = require('./alert.listener');

module.exports = app => {
    errorListener(app);
    approvalListener(app);
    alertListener(app);
};
