const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = require('./user.service');
const userQuery = require('../../data/queries/user.query');
const jwtHelper = require('../../helpers/jwt.helper');
const emailHelper = require('../../helpers/email.helper');
const securityConfig = require('../../config/security.config');
const authLinkQuery = require('../../data/queries/auth-link.query');

// TODO: fix score_case
const createAuthLinkFor = ({user_id}) => {
    const exp = Date.now() + securityConfig.authLinkExpiresIn;
    return authLinkQuery.insert({exp, user_id, linkId: uuid.v4()});
};

// TODO: make it transactional
const register = async ({email, password, fullName}) => {
    const [entity] = await userService.createUser({email, password, fullName});
    const [authLink] = await createAuthLinkFor(entity);
    console.log('auth link saved', authLink);
    emailHelper.sendEmail(email, 'test sub', authLink+'!..');
};

const authenticate = async ({email, password}) => {
    const fromDb = await userQuery.findByEmail(email);
    if (!fromDb || !fromDb[0]) {
        throw {status: 400, message: 'Email is wrong'};
    }
    const {password: hash} = fromDb[0];
    if (!await bcrypt.compare(password, hash)) {
        throw {status: 400, message: 'Password is wrong'};
    }
    return jwtHelper.generateToken({email});
};


module.exports = {
    register,
    authenticate,
};
