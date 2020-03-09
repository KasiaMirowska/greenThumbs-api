const knex = require('knex');
const app = require('../src/app');
const bcrypt = require('bcryptjs');
const dataHelpers = require('./test-data');
const helpers = require('./test-helpers');

describe('places endpoints', function () {
    let db;

    const { testPlaces, testUsers, testReviews, testThumbText, testThumbChecked } = dataHelpers.makeTestData()
    before('knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)

    })
    after('disconnect from db', () => db.destroy(db));
    beforeEach('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('GET /api/', () => {
        context('given no green reviewed places', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/')
                    .expect(200, [])
            })
        })

        context('given reviewed places in db', () => {
            beforeEach('insert places', () => {
               helpers.seedGreenPlaces(db, testUsers, testPlaces, testReviews, testThumbText, testThumbChecked)
            })
            it('responds with 200 and places list', () => {
                // const placeId = testPlaces[0].id
                // const expectedGreenReviewedPlacesList = helpers.makeExpectedPlace(testUsers, testPlaces, testReviews, testThumbText, testThumbChecked);
                
                // return supertest(app)
                // .get('/api/')
                // .expect(200, expectedGreenReviewedPlacesList)
            })
       })
     })
})