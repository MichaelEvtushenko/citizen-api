const WebSocket = require('ws');
const haversine = require('haversine');

const _userId = Symbol('userId');
const _latitude = Symbol('latitude');
const _longitude = Symbol('longitude');

// TODO: refactor(?): class -> function
class AlertWebSocketFacade {
    setup({server, path}) {
        this.wsServer = new WebSocket.Server({server, path});
        this.wsServer.on('connection', ws => {
            console.log('connected');
            ws.on('message', (data = {}) => {
                const userInfo = JSON.parse(data);
                console.log(`new message: `, userInfo);
                // TODO: put JWT in message to verify the client
                const {userId, latitude, longitude} = userInfo;
                if (userId && latitude && longitude) {
                    ws[_userId] = userId;
                    ws[_latitude] = latitude;
                    ws[_longitude] = longitude;
                }
            });
        });
    }

    sendNewAlert(alert) {
        this.wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const start = {latitude: alert.latitude, longitude: alert.longitude};
                const end = {latitude: client[_latitude], longitude: client[_longitude]};
                // Distance between user and alert is less than or equal 500 metres
                if (haversine(start, end) <= 500) {
                    client.send(JSON.stringify(alert));
                }
            }
        })
    }
}

const alertWebSocketFacade = new AlertWebSocketFacade();

module.exports = alertWebSocketFacade;
