const {v4: uuid} = require('uuid');

const authLinkQuery = require('../../data/queries/auth-link.query');
const {isUuidValid} = require('../../helpers/validation.helper');
const {throwInCase} = require('../../helpers/exception.helper');
const securityConfig = require('../../config/security.config');


const createAuthLink = ({userId}) => {
    const exp = Date.now() + securityConfig.authLinkExpiresIn;
    return authLinkQuery.insert({exp, userId, linkId: uuid()});
};

// TODO: make it transactional
const activateLink = async linkId => {
    throwInCase(!isUuidValid(linkId), {message: 'Bad Request', status: 400});
    const [link] = await authLinkQuery.findByLinkId(linkId);
    throwInCase(!link, {message: 'Link does not exist', status: 400});

    const {used, exp} = link;
    throwInCase(exp < Date.now(), {message: 'Link is expired', status: 400});
    throwInCase(used, {message: 'Link already activated', status: 400});

    return authLinkQuery.activateLink(linkId);
};

const removeExpiredLinks = async () => {
    try {
        const links = await authLinkQuery.findExpiredLink(Date.now());
        for (const id of links.map(l => l.linkId)) {
            await authLinkQuery.deleteById(id);
            console.log(`Auth link was deleted [ID: ${id}]`);
        }
    } catch (e) {
        console.error('Error occurred while deleting links:', e);
    }
};

module.exports = {
    createAuthLink,
    activateLink,
    removeExpiredLinks,
};
