const bcrypt = require('bcrypt');

const userQuery = require('../../data/queries/user.query');
const securityConfig = require('../../config/security.config');
const {isEmailValid} = require('../../helpers/validation.helper');

const getById = id => userQuery.getById(id);

const createUser = async ({email, password, fullName}) => {
    const [byEmail] = await userQuery.findByEmail(email);
    if (byEmail) {
        throw {status: 400, message: 'Email is already taken'};
    }
    const hash = await bcrypt.hash(password, securityConfig.saltRounds);
    return userQuery.create({email, hash, fullName});
};

const enableUser = async (userId) => await userQuery.enableUser(userId);

const findByEmail = email => isEmailValid(email) ? userQuery.findByEmail(email) : [];

module.exports = {
    getById,
    createUser,
    enableUser,
    findByEmail,
};
