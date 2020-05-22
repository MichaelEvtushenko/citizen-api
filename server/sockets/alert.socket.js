const WebSocket = require('ws');
const haversine = require('haversine');

const _userId = Symbol('userId');
const _latitude = Symbol('latitude');
const _longitude = Symbol('longitude');

class AlertWebSocketFacade {
    setup({server, path}) {
        this.wsServer = new WebSocket.Server({server, path});
        this.wsServer.on('connection', ws => {
            ws.on('message', (data = {}) => {
                const userInfo = JSON.parse(data);
                const {userId, latitude,  longitude} = userInfo;
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
                // Distance between user and alert is less than or equal to 500 metres
                if (haversine(start, end, {unit: 'meter'}) <= 500) {
                    client.send(JSON.stringify(alert));
                }
            }
        })
    }
}

module.exports = new AlertWebSocketFacade();
