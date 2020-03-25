const errorListener = require('./error.listener');

module.exports = app => {
    errorListener(app);
};
