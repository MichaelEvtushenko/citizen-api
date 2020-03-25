const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);

const isConfirmPasswordValid = (password, confirmPassword) => password === confirmPassword;

const isPasswordEmail = password => password && password.length >= minPasswordLength;

module.exports = {
    isEmailValid,
    isPasswordEmail,
    isConfirmPasswordValid,
};
