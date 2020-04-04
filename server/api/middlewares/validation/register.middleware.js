const {isEmailValid, isPasswordValid} = require('../../../helpers/validation.helper');

module.exports = (ctx, next) => {
    const {email, password, confirmPassword, fullName} = ctx.request.body;

    ctx.assert(isEmailValid(email), 400, 'Email is not valid');
    ctx.assert(isPasswordValid(password), 400, 'Password is not valid');
    ctx.assert(password === confirmPassword, 400, 'Confirm password is not valid');
    ctx.assert(fullName, 400, 'Fullname is not valid');

    ctx.state.user = {email, password, confirmPassword, fullName};
    return next();
};
