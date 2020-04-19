const errorListener = require('./error.listener');
const approvalListener = require('./approval.listener');

module.exports = app => {
    errorListener(app);
    approvalListener(app);
};
