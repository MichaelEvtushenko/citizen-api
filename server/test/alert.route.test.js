process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../data/db/connection');
const {shouldHaveProperties} = require('../helpers/test.helper');

chai.should();
chai.use(chaiHttp);

before('truncate table', async () => {
    await knex.schema.raw('TRUNCATE alerts CASCADE');
    console.log('before')
});

beforeEach('get access token', done => {
    chai.request(server)
        .post('/api/auth/login')
        .send({
            email: process.env.TEST_EMAIL || 'xbritschymcq@zaaskater.ml',
            password: process.env.TEST_PASSWORD || '123123'
        })
        .end((err, res) => {
            process.env.testAccessToken = res.body.accessToken;
            done();
        });
});

describe('Alerts', () => {
    const alertProperties = [
        'alertId', 'userId', 'latitude', 'longitude', 'description', 'reportedAt', 'status', 'photoUrls'
    ];

    const alertToCreate = {
        latitude: 50.44727421482662,
        longitude: 30.45413374900818,
        description: 'Someone was shooting near KPI hostel №3'
    };

    describe('POST alerts', () => {
        it('it should create a new alert, returning ' +
            'status: 200 OK, ' +
            `body: { ${alertProperties.join(', ')} }`, done => {
            chai.request(server)
                .post('/api/alerts')
                .set('Authorization', `Bearer ${process.env.testAccessToken}`)
                .send(alertToCreate)
                .end((err, res) => {
                    shouldHaveProperties(alertProperties, res);
                    done();
                });
        });
    });

    describe('GET alerts', () => {
        it('it should validate request params, returning ' +
            'status: 400 Bad Request, ' +
            'body: { error: true, message: "Location is not valid"}', done => {
            chai.request(server)
                .get('/api/alerts')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error').equal(true);
                    res.body.should.have.property('message').equal('Location is not valid');
                    done();
                });
        });

        it('it should validate path params, returning ' +
            'status: 400 Bad Request, ' +
            `body: { error: true, message: "Id is not valid"}`, done => {
            chai.request(server)
                .get('/api/alerts/@_@')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error').equal(true);
                    res.body.should.have.property('message').equal('Id is not valid');
                    done();
                });
        });

        it('it should find alerts in radius, returning ' +
            'status: 200 OK, ' +
            `body: { alerts: [], radius: 500, unit: "m", limit: 2 }`, done => {
            chai.request(server)
                .get('/api/alerts?lat=50.44727421482662&lng=30.45413374900818&limit=2')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('alerts');
                    res.body.should.have.property('radius').equal(500);
                    res.body.should.have.property('unit').equal('m');
                    res.body.should.have.property('limit').equal('2');
                    done();
                });
        });
    })});
