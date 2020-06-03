const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const minPasswordLength = 6;
const allowedRoles = ['user', 'moderator', 'admin', 'super-admin'];

const isEmailValid = email => !!email && emailRegexp.test(email);

const isPasswordValid = password => !!password && password.length >= minPasswordLength;

const isUuidValid = uuid => !!(uuid && uuid.length === 36) && uuidRegexp.test(uuid);

const isLongitudeValid = longitude => !!+longitude && Math.abs(longitude) <= 180;

const isLatitudeValid = latitude => !!+latitude && Math.abs(latitude) <= 90;

const isLocationValid = ({latitude, longitude}) => isLatitudeValid(latitude) && isLongitudeValid(longitude);

const isStringValid = str => !!(typeof str === 'string' && str.trim());

const isIdValid = id => !!(+id && id > 0);

const isRoleValid = role => allowedRoles.includes(role);

module.exports = {
    isPasswordValid,
    isEmailValid,
    isUuidValid,
    isLongitudeValid,
    isLatitudeValid,
    isLocationValid,
    isStringValid,
    isIdValid,
    isRoleValid,
};
