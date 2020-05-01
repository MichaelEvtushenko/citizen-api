const alertSocketFacade = require('./alert.socket');

module.exports = server => {
    alertSocketFacade.setup({server, path: '/subscribe/alerts'});
};
