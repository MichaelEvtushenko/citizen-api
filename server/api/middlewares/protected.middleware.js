const jwtHelper = require('../../helpers/jwt.helper');

module.exports = (roles = []) => {
    return (ctx, next) => {
        // if (process.env.NODE_ENV === 'development') {
        //     console.warn('Protected route passed as a dev with id = 88');
        //     ctx.state.userId = 88;
        //     return next();
        // }
        const {authorization} = ctx.headers;
        ctx.assert(authorization, 401, 'Authorization header missed');

        const token = authorization.split(' ')[1];
        const {exp, role, sub: userId} = jwtHelper.verifyToken(token);

        ctx.assert(exp > Date.now(), 401, 'Token expired');
        ctx.assert(roles.length ? roles.includes(role) : 1, 403, 'You have no permission');

        ctx.state.userId = userId;
        return next();
    }
};
