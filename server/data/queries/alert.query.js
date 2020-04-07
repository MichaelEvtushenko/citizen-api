const knex = require('../db/connection');
const {alertMapper} = require('../../helpers/query.helper');

const insert = async ({userId, description, latitude, longitude}) => {
    await knex('alerts')
        .insert({
            user_id: userId,
            latitude,
            longitude,
            description
        });
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
