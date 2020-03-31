const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = require('./user.service');
const jwtHelper = require('../../helpers/jwt.helper');
const emailHelper = require('../../helpers/email.helper');
const {throwInCase} = require('../../helpers/validation.helper');
const securityConfig = require('../../config/security.config');
const jwtConfig = require('../../config/jwt.config');
const sessionQuery = require('../../data/queries/session.query');
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

const authenticate = async ({email, password, userAgent}) => {
    const [fromDb] = await userQuery.findByEmail(email);
    if (!fromDb) {
        throw {status: 400, message: 'Email is wrong'};
    }
    const {password: hash, userId, role, enabled} = fromDb;
    throwInCase(!enabled, {message: 'Non-activated account', status: 400});
    if (!await bcrypt.compare(password, hash)) {
        throw {status: 400, message: 'Password is wrong'};
    }
    const {refreshToken} = await createRefreshToken({userAgent, userId});
    return {
        accessToken: jwtHelper.generateToken({userId, role}),
        refreshToken
    };
};

const createRefreshToken = async ({userId, userAgent}) => {
    const expiredAt = Date.now() + jwtConfig.refreshTokenExpiresIn;
    const refreshToken = uuid.v4();
    await sessionQuery.insert({userId, userAgent, refreshToken, expiredAt});
    return {refreshToken};
};

const refreshToken = async ({refreshToken, userAgent}) => {
    const [fromDb] = await sessionQuery.findByRefreshToken(refreshToken);
    throwInCase(!fromDb, {message: 'Refresh token does not exist', status: 404});
    const {userId, role, expiredAt} = fromDb;
    if (expiredAt < Date.now()) {
        throw {message: 'Refresh token expired', status: 401};
    }
    // Attempt to hack
    if (fromDb.userAgent !== userAgent) {
        console.warn('Attempt to authorize from unknown user-agent:', userAgent);
        // await sessionQuery.deleteByUserId(fromDb.userId);
        throw {message: 'Unauthorized', status: 401};
    }
    const newRefreshToken = uuid.v4();
    await sessionQuery.updateRefreshToken({refreshToken, newRefreshToken});
    return {
        accessToken: jwtHelper.generateToken({userId, role}),
        refreshToken: newRefreshToken
    };
};

module.exports = {
    register,
    authenticate,
    activateLink,
    refreshToken,
};
