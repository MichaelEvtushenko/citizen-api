const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = require('./user.service');
const jwtHelper = require('../../helpers/jwt.helper');
const emailHelper = require('../../helpers/email.helper');
const {throwInCase} = require('../../helpers/validation.helper');
const securityConfig = require('../../config/security.config');
const userQuery = require('../../data/queries/user.query');
const authLinkQuery = require('../../data/queries/auth-link.query');

const createAuthLinkFor = ({userId}) => {
    const exp = Date.now() + securityConfig.authLinkExpiresIn;
    return authLinkQuery.insert({exp, userId, linkId: uuid.v4()});
};

// TODO: make it transactional
const register = async ({email, password, fullName}) => {
    const [user] = await userService.createUser({email, password, fullName});
    const [{linkId}] = await createAuthLinkFor(user);
    await emailHelper.sendActivationCode({email, fullName, linkId});
};

// TODO: make it transactional
const activateLink = async linkId => {
    const [link] = await authLinkQuery.findByLinkId(linkId);
    throwInCase(!link, {message: 'Link does not exist', status: 400});
    const {userId, used, exp} = link;
    throwInCase(exp < Date.now(), {message: 'Link is expired', status: 400});
    throwInCase(used, {message: 'Link already activated', status: 400});
    await authLinkQuery.activateLink(linkId);
    await userQuery.enableUser(userId);
};

const authenticate = async ({email, password}) => {
    const [fromDb] = await userQuery.findByEmail(email);
    if (!fromDb) {
        throw {status: 400, message: 'Email is wrong'};
    }
    const {password: hash} = fromDb;
    if (!await bcrypt.compare(password, hash)) {
        throw {status: 400, message: 'Password is wrong'};
    }
    return jwtHelper.generateToken({email});
};

module.exports = {
    register,
    authenticate,
    activateLink,
};
