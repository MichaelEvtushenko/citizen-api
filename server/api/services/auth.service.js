const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = require('./user.service');
const authLinkService = require('./auth-link.service');
const jwtHelper = require('../../helpers/jwt.helper');
const emailHelper = require('../../helpers/email.helper');
const {throwInCase, isUuidValid} = require('../../helpers/validation.helper');
const jwtConfig = require('../../config/jwt.config');
const sessionQuery = require('../../data/queries/session.query');

// TODO: make it transactional
const register = async ({email, password, fullName}) => {
    const [user] = await userService.createUser({email, password, fullName});
    const [{linkId}] = await authLinkService.createAuthLink(user);
    setTimeout(() => emailHelper.sendActivationCode({email, fullName, linkId}), 0);
};

const activateAccount = async linkId => {
    const [{userId}] = await authLinkService.activateLink(linkId);
    await userService.enableUser(userId);
};

const authenticate = async ({email, password, userAgent}) => {
    const [fromDb] = await userService.findByEmail(email);
    throwInCase(!fromDb, {status: 401, message: 'Email is wrong'});

    const {password: hash, userId, role, enabled} = fromDb;
    throwInCase(!enabled, {message: 'Unactivated account', status: 401});

    if (!await bcrypt.compare(password, hash)) {
        throw {status: 401, message: 'Password is wrong'};
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
    throwInCase(!isUuidValid(refreshToken), {message: 'Refresh token is not valid', status: 400});
    await sessionQuery.deleteByRefreshToken(refreshToken);
};

const logoutAll = async userId => {
    if (+userId) {
        await sessionQuery.deleteByUserId(userId)
    } else {
        throw {message: 'Bad Request', status: 400};
    }
}

const createRefreshToken = async ({userId, userAgent}) => {
    const expiredAt = Date.now() + jwtConfig.refreshTokenExpiresIn;
    const refreshToken = uuid.v4();
    await sessionQuery.insert({userId, userAgent, refreshToken, expiredAt});
    return {refreshToken};
};

const refreshToken = async ({refreshToken, userAgent}) => {
    throwInCase(!isUuidValid(refreshToken), {message: 'Refresh token is not valid', status: 400});
    const [fromDb] = await sessionQuery.joinUserByRefreshToken(refreshToken);
    throwInCase(!fromDb, {message: 'Refresh token does not exist', status: 404});

    const {userId, expiredAt, role} = fromDb;
    if (expiredAt < Date.now()) {
        throw {message: 'Refresh token expired', status: 401};
    }

    if (fromDb.userAgent !== userAgent) {
        // Attempt to hack
        console.warn('Attempt to authorize from unknown user-agent:', userAgent);
        console.warn('User-agent from DB:', fromDb.userAgent);
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
    activateAccount,
    refreshToken,
    logout,
    logoutAll,
};
