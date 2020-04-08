const knex = require('../db/connection');
const {alertMapper} = require('../../helpers/query.helper');

const insert = ({userId, description, latitude, longitude}) => {
    return knex('alerts')
        .insert({
            user_id: userId,
            latitude,
            longitude,
            description
        })
        .returning('*')
        .then(alertMapper);
};

const findInRadius = ({latitude, longitude, radius, limit}) => {
    return knex('alerts')
        .whereRaw('haversine(?, ?, alerts.latitude, alerts.longitude) * 1000 <= ?',
            [latitude, longitude, radius])
        .limit(limit)
        .then(alertMapper);
};

const findByAlertId = (alertId) => {
    return knex('alerts')
        .where({alert_id: alertId})
        .select('*')
        .then(alertMapper);
};

module.exports = {
    insert,
    findInRadius,
    findByAlertId,
};
