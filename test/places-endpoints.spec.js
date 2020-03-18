const knex = require('knex');
const app = require('../src/app');
const bcrypt = require('bcryptjs');
const dataHelpers = require('./test-data');
const helpers = require('./test-helpers');

describe('places endpoints', function () {
    let db;

    const { testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked } = dataHelpers.makeTestData()
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
                return helpers.seedGreenPlaces1(db, testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked)
            });

            it('responds with 200 and places array', () => {
                const expectedPlace = helpers.makeExpectedPlaceReviews(db, testUsers[0], testPlaces[0], testUserPlaces, testReviews, testThumbChecked)
                return supertest(app)
                    .get('/api/')
                    .expect(200)
                    .expect(res => {
                        console.log(res.body, 'BODY')
                        res.body[0] === expectedPlace;
                        // {
                        //     "checkedThumbs": [
                        //         "No single use plastic",
                        //         "Compostable take-out containers and cups"
                        //     ],
                        //     "display_phone": "(123) 345 5678",
                        //     "green_reviews_count": 2,
                        //     "id": 1,
                        //     "img": "image1",
                        //     "location_city": "cityFirst",
                        //     "location_st": "MA",
                        //     "location_str": "1 street",
                        //     "location_zip": "012345",
                        //     "name": "first place",
                        //     "review": [
                        //       "first review"
                        //     ],
                        //     "reviewCategory": [
                        //       "category1"
                        //     ],
                        //     "reviewDate": [
                        //       "Wed Jan 22 2020 16:28:32 GMT-0500 (Eastern Standard Time)"
                        //     ],
                        //     "url": "yelpUrl",
                        //     "yelp_id": "aB1c",
                        //     "yelp_rating": "5"
                        // }
                    });
            });
        });
    });

    //fetches all green places by user

    describe('GET /api/user', () => {
        context('given no reviewed places by user in db', () => {
            beforeEach('insert users', () => {
                const verifiedUsers = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }))
                return db
                    .into('users')
                    .insert(verifiedUsers)
                    .then(users => console.log('verified users populated'))
            })
            it('returns 400 ', () => {
                return supertest(app)
                    .get('/api/user')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(400, {
                        "error": {
                            "message": "User with id 1 did not review place with id 5"
                        }
                    })
                    
            })
        })

        context.only('given reviewed places in db', () => {
            beforeEach('insert data', () => {
                console.log(testUsers[0])
                helpers.seedGreenPlaces2(db, testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked)
            })

            it('returns 200 and a list of user places', () => {
                return supertest(app)
                    .get('/api/user')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
                    .expect(res => {
                        console.log(res.body)
                    })
            })
        })

    })
    //get user's place by id
    describe('GET /api/place/:place_id', () => {
        context('given no places with given id', () => {
            beforeEach('insert users', () => {
                const verifiedUsers = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }))
                return db
                    .into('users')
                    .insert(verifiedUsers)
                    .then(users => console.log('verified users populated'))
            }) 

            it('returns 404', () => {
                const placeId = 12;
                return supertest(app)
                    .get(`/api/place/${placeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `User with id${testUsers[0].id} did not review place with id ${placeId}` } })

            })
        })
    })
})

