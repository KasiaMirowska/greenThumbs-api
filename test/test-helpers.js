const dataHelpers = require('./test-data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function cleanTables(db) {

    return db.raw(
        `TRUNCATE
            users,
            place,
            review,
            thumbText,
            thumbChecked
            RESTART IDENTITY CASCADE`
    )
}

function seedGreenPlaces1(db, users, places, userPlaces, reviews, thumbText, thumbChecked) {
    return db
        .into('users')
        .insert(users)
        .then(() => {
            return db
                .into('place')
                .insert(testPlaces)
                .then(() => {
                    return db
                        .into('userplace')
                        .insert(testUserPlaces)
                        .then(() => {
                            return db
                                .into('review')
                                .insert(testReviews)
                                .then(() => {
                                    return db
                                        .into('thumbtext')
                                        .insert(testThumbText)
                                        .then(() => {
                                            return db
                                                .into('thumbchecked')
                                                .insert(testThumbChecked)
                                                .then(() => {
                                                    console.log('db populated');
                                                });
                                        });
                                });
                        })


                });
        });
}
function seedGreenPlaces2(db, users, places, userPlaces, reviews, thumbText, thumbChecked) {
    const verifiedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db
        .into('users')
        .insert(verifiedUsers)
        .then(() => {
            return db
                .into('place')
                .insert(places)
        })
        .then(() => {
            return db
                .into('userplace')
                .insert(userPlaces)
        })
        .then(() => {
            return db
                .into('review')
                .insert(reviews)
        })
        .then(() => {
            return db
                .into('thumbtext')
                .insert(thumbText)
        })
        .then(() => {
            return db
                .into('thumbchecked')
                .insert(thumbChecked)
                .then(() => {
                    console.log('db populated');
                });
        });

}




function makeExpectedPlaceReviews(db, user, place, userPlaces, reviews, checkedThumbs) {
    console.log('wtf?????', user, place, reviews)
    let filteredByUser = reviews.filter(rev => rev.userid === user.id);
    console.log(filteredByUser, '2222')
    let filteredByPlace = filteredByUser.filter(rev => rev.place_id === place.id);

    console.log(filteredByPlace[0], '33333333')
    let filteredReview = filteredByPlace[0];
    console.log(filteredReview.id, 'REALLY??????')

    let filteredThumbs = checkedThumbs.filter(e => e.review_id === filteredReview.id)
    console.log(filteredReview.id, filteredThumbs, 'Final???????')

    let reviewCheckedThumbs = {}

    filteredThumbs.forEach(thumb => {
        reviewCheckedThumbs[thumb.thumb] = true;
    });

    const expectedPlace = {
        id: place.id,
        yelp_id: place.yelp_id,
        name: place.name,
        img: place.img_url,
        url: place.url,
        yelp_rating: place.yelp_rating,
        location_str: place.location_str,
        location_city: place.location_city,
        location_zip: place.location_zip,
        location_st: place.location_st,
        display_phone: place.display_phone,
        userid: user.id,
        green_reviews_count: place.green_reviews_count,
        review: filteredReview.review,
        reviewDate: filteredReview.date,
        category: filteredReview.place_category,
        checkedthumbs: Object.keys(reviewCheckedThumbs)
    }
    console.log(expectedPlace, 'IS IT HERE???????!!!!!!!!!')
    return expectedPlace;
}





function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    console.log(token)
    return `Bearer ${token}`
}

module.exports = {
    cleanTables,
    seedGreenPlaces1,
    seedGreenPlaces2,
    makeExpectedPlaceReviews,
    makeAuthHeader,

}