const jwtHelper = require('../../helpers/jwt.helper');

module.exports = (roles = []) => {
    return async (ctx, next) => {
        const {authorization} = ctx.headers;
        ctx.assert(authorization, 401, 'Authorization header missed');

        const token = authorization.split(' ')[1];
        const {exp, role} = jwtHelper.verifyToken(token);

        ctx.assert(exp > Date.now(), 401, 'Token expired');
        ctx.assert(roles.length ? roles.includes(role) : 1, 403, 'You have no permission');

        return next();
    }
};
