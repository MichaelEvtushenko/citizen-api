const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);
const isPasswordEmail = password => password && password.length >= minPasswordLength;

module.exports = (ctx, next) => {
    const {email, password} = ctx.request.body;

    ctx.assert(isEmailValid(email), 400, 'Email is not valid');
    ctx.assert(isPasswordEmail(password), 400, 'Password is not valid');

    ctx.state.credentials = {email, password};
    return next();
};
