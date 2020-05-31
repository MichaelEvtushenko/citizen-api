const HOST_NAME = (process.env.HOST_NAME || 'http://localhost') + `:${process.env.PORT || 3000}`;

const API_ACTIVATE_URL = `${HOST_NAME}/api/auth/activate`;

module.exports = {
    API_ACTIVATE_URL,
};
