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

    describe.only('GET /api/', () => {
        context('given no green reviewed places', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/')
                    .expect(200, [])
            })
        })

        context('given reviewed places in db', () => {
            beforeEach('insert places', () => {
                helpers.seedGreenPlaces(db, testPlaces, testReviews, testThumbText, testThumbChecked)
                    })
        
        })
        it('responds with 200 and places list', () => {
            const placeId = testPlaces[0].id
            const expectedReview = helpers.makeExpectedPlaceReviews(testUsers[0], testPlaces[0], testReviews)
            //const expectedGreenReviewedPlacesList = helpers.makeExpectedPlace(testUsers, testPlaces, testReviews, testThumbText, testThumbChecked);

            return supertest(app)
            .get('/api/')
            .expect(200, expectedGreenReviewedPlacesList)
        })


    })

//fetches all green places by user
describe('GET /api/user', () => {
    context('given no places in db', () => {
        beforeEach('insert users', () => {
            //helpers.seedUsers(db, testUsers)
            const users = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }))
            console.log(users[0], users[0].password, 'HERE?????????')
            return db
                .into('users')
                .insert(users)
                .then(users => {
                    console.log('users populated2')
                })
        })

        it('returns 200 and empty array', () => {
            console.log('???????')
            return supertest(app)
                .get('/api/user')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
        })
    })
})

})