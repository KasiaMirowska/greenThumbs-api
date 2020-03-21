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
            connection: process.env.TEST_DATABASE_URL,
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
                return helpers.seedGreenPlaces1(db, testUsers, testPlaces, testUserPlaces, testReviews, testThumbText, testThumbChecked)
            });

            it('responds with 200 and places array', () => {
                const expectedPlace = helpers.makeExpectedPlaceReviews(db, testUsers[0], testPlaces[0], testUserPlaces, testReviews, testThumbChecked, testThumbText)
                return supertest(app)
                    .get('/api/')
                    .expect(200)
                    .expect(res => {
                        console.log(res.body[0])
                        res.body[0] === expectedPlace;
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
            })
            it('returns 400 ', () => {
                return supertest(app)
                    .get('/api/user')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(400, {
                        error: {
                            message: `User has not reviewed any places`
                        }
                    })

            })
        })

        context('given reviewed places in db', () => {
            beforeEach('insert data', () => {
                return helpers.seedGreenPlaces2(db, testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked)
            })

            it('returns 200', () => {
                const expectedPlace = helpers.makeExpectedPlaceReviews(db, testUsers[0], testPlaces[0], testUserPlaces, testReviews, testThumbChecked, testThumbText)
                return supertest(app)
                    .get('/api/user')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .then(res => {
                        res.body[0] === expectedPlace
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
                }));
                return db
                    .into('users')
                    .insert(verifiedUsers);
            });

            it('returns 400', () => {
                const placeId = 12;
                return supertest(app)
                    .get(`/api/place/${placeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, { error: { message: `User with id ${testUsers[0].id} did not review place with id ${placeId}` } });
            });
        });

        context('given place exists in db', () => {
            beforeEach('populate the db', () => {
                return helpers.seedGreenPlaces2(db, testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked)
            })
            it('returns selected place', () => {
                const placeId = 1;
                const expectedPlace = helpers.makeExpectedPlaceReviews(db, testUsers[0], testPlaces[0], testUserPlaces, testReviews, testThumbChecked, testThumbText);
                return supertest(app)
                    .get(`/api/place/${placeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedPlace);
            });
        });
    });

    describe('POST /api/:place_id/review', () => {
        context('db has no saved place', () => {
            beforeEach('insert users', () => {
                const verifiedUsers = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }))
                return db
                    .into('users')
                    .insert(verifiedUsers)
                    .then(() => {
                        return db
                        .into('thumbtext')
                        .insert(testThumbText)
                    })
            })
            it('inserts a new place with new review and checked thumbs', () => {
                const user = testUsers[2];
                const place = {
                    yelp_id: 'aB4c',
                    name: 'test place',
                    img_url: 'image1',
                    url: 'yelpUrl4',
                    yelp_rating: 5,
                    location_str: '1 street',
                    location_city: 'cityFirst',
                    location_zip: '012345',
                    location_st: 'MA',
                    display_phone: '(123) 345 5678',
                    green_reviews_count: 4,
                }

                const testNewUserPlace = {
                    userid: user.id,
                    reviewed_place_id: place.yelp_id,
                }

                const testNewReview = {
                    userid: user.id,
                    place_id: place.id,
                    place_category: 'category',
                    review: 'new test review in review obj',
                }

                const testThumbsChecked = [1, 2, 3];

                const {
                     yelp_id, name, img_url, url, yelp_rating,
                    location_str, location_city, location_zip,
                    location_st, display_phone, green_reviews_count,
                } = place;


                const testNewPlaceReq = {
                    yelp_id,
                    name,
                    img_url,
                    url,
                    yelp_rating,
                    location_str,
                    location_city,
                    location_zip,
                    location_st,
                    display_phone,
                    userid: user.id,
                    green_reviews_count,
                    category: testNewReview.place_category,
                    review: testNewReview.review,
                    checkedThumbs: testThumbsChecked
                }
                
                return supertest(app)
                    .post(`/api/${place.yelp_id}/review`)
                    .set('Authorization', helpers.makeAuthHeader(user))
                    .send(testNewPlaceReq)
                    .expect(201)
                    .expect(res => {
                        console.log(res.body)
                        expect(res.body.savedPlace).to.have.property('id');
                        expect(res.body.savedPlace.yelp_id).to.eql(testNewPlaceReq.yelp_id);
                        expect(res.body.savedPlace.name).to.eql(testNewPlaceReq.name);
                        expect(res.body.savedPlace.img_url).to.eql(testNewPlaceReq.img_url);
                        expect(res.body.savedPlace.url).to.eql(testNewPlaceReq.url);
                        expect(res.body.savedPlace.yelp_rating).to.eql(testNewPlaceReq.yelp_rating);
                        expect(res.body.savedPlace.location_str).to.eql(testNewPlaceReq.location_str);
                        expect(res.body.savedPlace.location_city).to.eql(testNewPlaceReq.location_city);
                        expect(res.body.savedPlace.location_st).to.eql(testNewPlaceReq.location_st);
                        expect(res.body.savedPlace.display_phone).to.eql(testNewPlaceReq.display_phone);
                        expect(res.body.savedPlace.green_reviews_count).to.eql(testNewPlaceReq.green_reviews_count);
                        
                        
                        expect(res.body.savedReview).to.have.property('id');
                        expect(res.body.savedReview.userid).to.eql(testNewPlaceReq.userid);
                        expect(res.body.savedReview.place_id).to.eql(res.body.savedPlace.id);
                        expect(res.body.savedReview.place_category).to.eql(testNewPlaceReq.category);
                        expect(res.body.savedReview.review).to.eql(testNewPlaceReq.review);

                        expect(res.body.newSavedThumbs).to.eql(testNewPlaceReq.checkedThumbs)
                    })
                //this is in response body that router sents : newReview, checkedThumbs 
            })
        })
    })



    context('given greenDB already has that saved place', () => {

        beforeEach('insert users', () => {
            const verifiedUsers = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }))
            return db
                .into('users')
                .insert(verifiedUsers)
                .then(() => {
                    return db
                    .into('place')
                    .insert(testPlaces)
                })
                .then(() => {
                    return db
                    .into('thumbtext')
                    .insert(testThumbText)
                })
        })
        it('inserts new review to a saved place in db', () => {
            const user = testUsers[2];
            const place = testPlaces[2];
            console.log(place)

            const testNewUserPlace = {
                userid: user.id,
                reviewed_place_id: place.yelp_id,
            }

            const testNewReview = {
                userid: user.id,
                place_id: place.id,
                place_category: 'category',
                review: 'new test review in review obj',
            }

            const testThumbsChecked = [1, 2, 3];

            const {
                id, yelp_id, name, img_url, url, yelp_rating,
                location_str, location_city, location_zip,
                location_st, display_phone, green_reviews_count,
            } = place;


            const testNewPlaceReq = {
                id,
                yelp_id,
                name,
                img_url,
                url,
                yelp_rating,
                location_str,
                location_city,
                location_zip,
                location_st,
                display_phone,
                userid: user.id,
                green_reviews_count,
                category: testNewReview.place_category,
                review: testNewReview.review,
                checkedThumbs: testThumbsChecked
            }
            return supertest(app)
                .post(`/api/${place.yelp_id}/review`)
                .set('Authorization', helpers.makeAuthHeader(user))
                .send(testNewPlaceReq)
                .expect(201)
                .expect(res => {
                    console.log(res.body, "BODY")
           

                    expect(res.body.savedReview).to.have.property('id');
                    // expect(res.body.newReview.userid).to.eql(testNewPlaceReq.userid);
                    // expect(res.body.newReview.place_id).to.eql(testNewPlaceReq.id);
                    // expect(res.body.newReview.place_category).to.eql(testNewPlaceReq.category);
                    // expect(res.body.newReview.review).to.eql(testNewPlaceReq.review);

                    expect(res.body.savedThumbs).to.eql(testNewPlaceReq.checkedThumbs)
                })
            //this is in response body that router sents : newReview, checkedThumbs 
      
        })
    })

    describe('PATCH /api/edit/:green_place_id', () => {
        
           
        beforeEach('insert users', () => {
            const verifiedUsers = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }))
            return db
                .into('users')
                .insert(verifiedUsers)
                .then(() => {
                    return db
                    .into('place')
                    .insert(testPlaces)
                })
                .then(() => {
                    return db
                    .into('thumbtext')
                    .insert(testThumbText)
                })
        })

            it('created new review and checked thumbs for the place', () => {
                const user = testUsers[2];
                const place = testPlaces[1];
    
                const testUpdatedReview = {
                    userid: user.id,
                    place_id: place.id,
                    place_category: 'category',
                    review: 'updated review',
                }
    
                const testThumbsChecked = [1, 3];
    
                const {
                    id, yelp_id, name, img_url, url, yelp_rating,
                    location_str, location_city, location_zip,
                    location_st, display_phone, green_reviews_count,
                } = place;
    
    
                const testUpdatedPlaceReq = {
                    id,
                    yelp_id,
                    name,
                    img_url,
                    url,
                    yelp_rating,
                    location_str,
                    location_city,
                    location_zip,
                    location_st,
                    display_phone,
                    userid: user.id,
                    reviewed_place_id: place.id,
                    green_reviews_count,
                    category: testUpdatedReview.place_category,
                    review: testUpdatedReview.review,
                    checkedThumbs: testThumbsChecked
                }
                return supertest(app)
                .post(`/api/edit/${place.id}`)
                .set('Authorization', helpers.makeAuthHeader(user))
                .send(testUpdatedPlaceReq)
                .expect(201)
                .expect(res => {
                    console.log(res.body);
                    expect(res.body.savedReview).to.have.property('id');
                    expect(res.body.savedReview.userid).to.eql(testUpdatedPlaceReq.userid);
                    expect(res.body.savedReview.place_id).to.eql(testUpdatedPlaceReq.id);
                    expect(res.body.savedReview.place_category).to.eql(testUpdatedPlaceReq.category);
                    expect(res.body.savedReview.review).to.eql(testUpdatedPlaceReq.review);

                    expect(res.body.updatedThumbs).to.eql(testUpdatedPlaceReq.checkedThumbs)
                })
            })
        
    })
    describe('DELETE /api/place/delete/:green_place_id', () => {
        beforeEach('insert data', () => {
            return helpers.seedGreenPlaces2(db, testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked)
        })
        it('deletes selected place review and thumbs', () => {
            const user = testUsers[0];
            const placeToRemove = testPlaces[0].id;
            return supertest(app)
            .delete(`/api/place/delete/${placeToRemove}`)
            .set('Authorization', helpers.makeAuthHeader(user))
            .expect(204)
        })
    })
})




