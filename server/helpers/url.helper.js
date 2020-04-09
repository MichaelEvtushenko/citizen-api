const HOST_NAME = process.env.HOST_NAME || `http://localhost:${process.env.PORT || 3000}`;

module.exports = {
    API_ALERTS_URL: `${HOST_NAME}/api/alerts`,
};
