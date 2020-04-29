const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);

const isPasswordValid = password => password && password.length >= minPasswordLength;

const isUuidValid = uuid => uuid && uuid.length === 36 && uuidRegexp.test(uuid);

const isLongitudeValid = longitude => longitude && Math.abs(longitude) <= 180;

const isLatitudeValid = latitude => latitude && Math.abs(latitude) <= 90;

const isLocationValid = ({latitude, longitude}) => isLatitudeValid(latitude) && isLongitudeValid(longitude);

const isStringValid = str => !!(str && str.trim());

const isIdValid = id => !!(+id && id > 0);

const throwInCase = (result, ex) => {
    if (result && ex)
        throw ex;
};

const trowInCaseLambda = (result, lambda) => {
    if (result && lambda) {
        const ex = lambda();
        if (ex) {
            throw ex;
        }
    }
};

module.exports = {
    throwInCase,
    trowInCaseLambda,
    isPasswordValid,
    isEmailValid,
    isUuidValid,
    isLongitudeValid,
    isLatitudeValid,
    isLocationValid,
    isStringValid,
    isIdValid,
};
