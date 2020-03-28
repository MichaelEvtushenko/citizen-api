const knex = require('../db/connection');
const mapper = require('../../helpers/query.helper')(rowMapper);

function rowMapper(entity) {
    const {link_id: linkId, user_id: userId, ...rest} = entity;
    return {linkId, userId, ...rest};
}

const insert = ({userId, exp, linkId}) => {
    return knex('auth_links')
        .insert({
            'link_id': linkId,
            'user_id': userId,
            'exp': exp,
        })
        .returning('*')
        .then(mapper);

};

// TODO: fix ...rest
const update = ({linkId, ...rest}) => {
    return knex('auth_links')
        .update({
            ...rest
        })
        .where({link_id: linkId})
        .returning('*')
        .then(mapper);
};

const findByLinkId = linkId => {
    return knex('auth_links')
        .select('*')
        .where({
            'link_id': linkId,
        });
};

const activateLink = linkId => {
    knex('auth_links')
        .update({used: true})
        .where({
            link_id: linkId,
        });
};

module.exports = {
    insert,
    update,
    findByLinkId,
    activateLink,
};


