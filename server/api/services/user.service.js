const bcrypt = require('bcrypt');

const userQuery = require('../../data/queries/user.query');
const approvalQuery = require('../../data/queries/approval.query');
const alertQuery = require('../../data/queries/alert.query');
const securityConfig = require('../../config/security.config');
const {badRequest, notFound, forbidden} = require('../../helpers/types/custom-error.type');
const {isEmailValid, isIdValid, isRoleValid} = require('../../helpers/validation.helper');
const {throwInCase} = require('../../helpers/exception.helper');

const findDetailsById = async userId => {
    throwInCase(!isIdValid(userId), badRequest('Id is not valid'));
    const [user] = await userQuery.findByUserId(userId);
    throwInCase(!user, notFound('User not found'));

    delete user.password;
    delete user.enabled;

    const [{approvalsCount}] = await approvalQuery.countByUserId(userId);
    const [{alertsCount}] = await alertQuery.countByUserId(userId);

    return {...user, approvalsCount, alertsCount};
};

const createUser = async ({email, password, fullName}) => {
    const [byEmail] = await userQuery.findByEmail(email);
    throwInCase(byEmail, badRequest('Email is taken'));

    const hash = await bcrypt.hash(password, securityConfig.saltRounds);
    return userQuery.insert({email, hash, fullName});
};

const updateEnabledStatus = async ({userId, enabled}) => {
    throwInCase(!isIdValid(userId), badRequest('Id is not valid'));
    throwInCase(typeof enabled !== 'boolean', badRequest('Enabled status is not valid'));
    await userQuery.updateEnabledStatus({userId, enabled});
};

const findByEmail = email => {
    throwInCase(!isEmailValid(email), badRequest('Email is not valid'));
    return userQuery.findByEmail(email);
};

const updateRole = async ({userId, adminId, newRole}) => {
    throwInCase(!isIdValid(userId), badRequest('Id is not valid'));
    throwInCase(!isRoleValid(newRole), badRequest('Role is not valid'));

    const [user] = await userQuery.findByUserId(userId);
    throwInCase(!user, notFound());

    const {role: userRole} = user;
    const [{role: adminRole}] = await userQuery.findByUserId(adminId);
    const roles = ['user', 'moderator', 'admin', 'super-admin'];

    if (roles.indexOf(adminRole) > roles.indexOf(userRole) &&
        roles.indexOf(adminRole) > roles.indexOf(newRole)) {
        return userQuery.updateRole({userId, role: newRole});
    }
    throw forbidden('Cannot update role');
};

module.exports = {
    findDetailsById,
    createUser,
    findByEmail,
    updateRole,
    updateEnabledStatus
};
