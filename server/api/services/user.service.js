const bcrypt = require('bcrypt');

// const emailHelper = require('../../helpers/email.helper');
const userQuery = require('../../data/queries/user.query');
const securityConfig = require('../../config/security.config');

const getById = id => userQuery.getById(id);

const createUser = async ({email, password, fullName}) => {
    const [byEmail] = await userQuery.findByEmail(email);
    if (byEmail) {
        throw {status: 400, message: 'Email is already taken'};
    }
    hash = await bcrypt.hash(password, securityConfig.saltRounds);
    return userQuery.create({email, hash, fullName});
};

module.exports = {
    getById,
    createUser,
};
