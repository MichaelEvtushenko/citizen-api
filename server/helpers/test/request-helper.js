const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const setAuthorizationHeader = (request) => {
    return request.set('Authorization', `Bearer ${process.env.testAccessToken}`);
}

module.exports = server => ({
    post(url, body, isProtected = true) {
        const request = chai.request(server)
            .post(url)
            .send(body);

        return isProtected ? setAuthorizationHeader(request) : request;
    },

    get(url, isProtected = true) {
        const request = chai.request(server)
            .get(url);

        return isProtected ? setAuthorizationHeader(request) : request;
    },
});
