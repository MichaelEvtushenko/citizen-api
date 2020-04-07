const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);

const isPasswordValid = password => password && password.length >= minPasswordLength;

const isUuidValid = uuid => uuid && uuid.length === 36 && uuidRegexp.test(uuid);

// TODO: use assert instead
const throwInCase = (result, ex) => {
    if (result && ex)
        throw ex;
};

module.exports = {
    throwInCase,
    isPasswordValid,
    isEmailValid,
    isUuidValid,
};
