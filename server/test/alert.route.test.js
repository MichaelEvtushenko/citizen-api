process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../data/db/connection');
const {shouldHaveProperties} = require('../helpers/test/should.helper');
const {get, post} = require('../helpers/test/request-helper')(server);

chai.should();
chai.use(chaiHttp);

before(async () => {
    await knex.schema.raw('TRUNCATE alerts CASCADE');
});

beforeEach(done => {
    chai.request(server)
        .post('/api/auth/login')
        .send({
            email: process.env.TEST_EMAIL || 'test@test.abc',
            password: process.env.TEST_PASSWORD || '123123'
        })
        .end((err, res) => {
            process.env.testAccessToken = res.body.accessToken;
            done();
        });
});

describe('Alerts', () => {

    describe('POST alerts', () => {
        const alertProperties = [
            'alertId', 'userId', 'latitude', 'longitude', 'description', 'reportedAt', 'status', 'photoUrls'
        ];

        const alertToCreate = {
            latitude: 50.44727421482662,
            longitude: 30.45413374900818,
            description: 'Someone was shooting near KPI hostel №3'
        };

        describe('Validation', () => {
            it('it should validate "latitude" property',
                done => {
                    post('/api/alerts', {...alertToCreate, latitude: null})
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('error').equal(true);
                            res.body.should.have.property('message').equal('Latitude is not valid');
                            done();
                        });
                });

            it('it should validate "longitude" property',
                done => {
                    post('/api/alerts', {...alertToCreate, longitude: []})
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('error').equal(true);
                            res.body.should.have.property('message').equal('Longitude is not valid');
                            done();
                        });
                });

            it('it should validate "description" property',
                done => {
                    post('/api/alerts', {...alertToCreate, description: {}})
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('error').equal(true);
                            res.body.should.have.property('message').equal('Description is not valid');
                            done();
                        });
                });
        });

        it('it should create a new alert',
            done => {
                post('/api/alerts', alertToCreate)
                    .end((err, res) => {
                        res.should.have.status(200);
                        shouldHaveProperties(alertProperties, res.body);
                        done();
                    });
            });
    });

    describe('GET alerts', () => {

        describe('Validation', () => {
            it('it should validate query string',
                done => {
                    get('/api/alerts')
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('error').equal(true);
                            res.body.should.have.property('message').equal('Location is not valid');
                            done();
                        });
                });

            it('it should validate request parameters',
                done => {
                    get('/api/alerts/#')
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('error').equal(true);
                            res.body.should.have.property('message').equal('Location is not valid');
                            done();
                        });
                });
        });

        it('it should find alerts in radius',
            done => {
                get('/api/alerts?lat=42.42&lng=20.20&limit=1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('alerts');
                        res.body.should.have.property('radius').equal(500); // set by default
                        res.body.should.have.property('unit').equal('m');   // set by default
                        res.body.should.have.property('limit').equal('1');
                        done();
                    });
            });
    });
});
