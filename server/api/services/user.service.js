const bcrypt = require('bcrypt');

const userQuery = require('../../data/queries/user.query');
const securityConfig = require('../../config/security.config');
const {badRequest} = require('../../helpers/types/custom-error.type');
const {isEmailValid, isIdValid} = require('../../helpers/validation.helper');
const {throwInCase} = require('../../helpers/exception.helper');

const findById = id => {
    throwInCase(!isIdValid(id), badRequest());
    return userQuery.findByUserId(id);
}

const createUser = async ({email, password, fullName}) => {
    const [byEmail] = await userQuery.findByEmail(email);
    if (byEmail) {
        throw badRequest('Email is taken');
    }
    const hash = await bcrypt.hash(password, securityConfig.saltRounds);
    return userQuery.create({email, hash, fullName});
};

const enableUser = async (userId) => await userQuery.enableUser(userId);

const findByEmail = email => isEmailValid(email) ? userQuery.findByEmail(email) : [];

module.exports = {
    findById,
    createUser,
    enableUser,
    findByEmail,
};
