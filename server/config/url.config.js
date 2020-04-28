const HOST_NAME = (process.env.HOST_NAME || 'http://localhost') + `:${process.env.PORT || 3000}`;

module.exports = {
    HOST_NAME_URL: HOST_NAME,
    API_ALERTS_URL: `${HOST_NAME}/api/alerts`,
    API_ACTIVATE_URL: `${HOST_NAME}/api/auth/activate`,
};
