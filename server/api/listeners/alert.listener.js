const alertWebSocketFacade = require('../../sockets/alert.socket');

module.exports = app => {
    // app.on('alertCreated', alertWebSocketFacade.sendNewAlert.bind(alertWebSocketFacade));
    app.on('alertCreated', alert => {
        console.log('alert created:', alert);
        alertWebSocketFacade.sendNewAlert(alert)
    });
};
