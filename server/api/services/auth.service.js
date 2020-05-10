const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = require('./user.service');
const authLinkService = require('./auth-link.service');
const jwtHelper = require('../../helpers/jwt.helper');
const emailHelper = require('../../helpers/email.helper');
const {isUuidValid, isIdValid} = require('../../helpers/validation.helper');
const {throwInCase} = require('../../helpers/exception.helper');
const jwtConfig = require('../../config/jwt.config');
const sessionQuery = require('../../data/queries/session.query');
const {notFound, badRequest, unauthorized} = require('../../helpers/types/custom-error.type');

// TODO: make it transactional
const register = async ({email, password, fullName}) => {
    const [user] = await userService.createUser({email, password, fullName});
    const [{linkId}] = await authLinkService.createAuthLink(user);
    setTimeout(() => emailHelper.sendActivationCode({email, fullName, linkId}), 0);
};

const activateAccount = async linkId => {
    const [{userId}] = await authLinkService.activateLink(linkId);
    await userService.updateEnabledStatus({userId, enabled: true});
};

const authenticate = async ({email, password, userAgent}) => {
    const [fromDb] = await userService.findByEmail(email);
    throwInCase(!fromDb, unauthorized('Email is wrong'));

    const {password: hash, userId, role, enabled} = fromDb;
    throwInCase(!enabled, unauthorized('Unactivated account'));

    if (!await bcrypt.compare(password, hash)) {
        throw unauthorized('Password is wrong');
    }

    const [{count}] = await sessionQuery.countByUserId(userId);

    if (count >= 5) {
        await sessionQuery.deleteByUserId(userId);
    }

    const {refreshToken} = await createRefreshToken({userAgent, userId});
    return {
        accessToken: jwtHelper.generateToken({userId, role}),
        refreshToken
    };
};

const logout = async refreshToken => {
    throwInCase(!isUuidValid(refreshToken), badRequest('Refresh token is not valid'));
    await sessionQuery.deleteByRefreshToken(refreshToken);
};

const logoutAll = async userId => {
    throwInCase(!isIdValid(userId), badRequest());
    await sessionQuery.deleteByUserId(userId)
}

const createRefreshToken = async ({userId, userAgent}) => {
    const expiredAt = Date.now() + jwtConfig.refreshTokenExpiresIn;
    const refreshToken = uuid.v4();
    await sessionQuery.insert({userId, userAgent, refreshToken, expiredAt});
    return {refreshToken};
};

const refreshToken = async ({refreshToken, userAgent}) => {
    throwInCase(!isUuidValid(refreshToken), badRequest('Refresh token is not valid'));
    const [fromDb] = await sessionQuery.joinUserByRefreshToken(refreshToken);
    throwInCase(!fromDb, notFound('Refresh token does not exist'));

    const {userId, expiredAt, role} = fromDb;
    if (expiredAt < Date.now()) {
        throw unauthorized('Refresh token expired');
    }

    if (fromDb.userAgent !== userAgent) {
        // Attempt to hack
        console.warn('Attempt to authorize from unknown user-agent:', userAgent);
        console.warn('User-agent from DB:', fromDb.userAgent);
        throw unauthorized();
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
    activateAccount,
    refreshToken,
    logout,
    logoutAll,
};
