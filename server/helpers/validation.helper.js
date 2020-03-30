const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);

const isPasswordValid = password => password && password.length >= minPasswordLength;

const throwInCase = (result, ex) => {
    if (result && ex)
        throw ex;
};

module.exports = {
    throwInCase,
    isPasswordValid,
    isEmailValid,
};
