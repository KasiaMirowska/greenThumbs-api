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

function seedGreenPlaces(db, users, places, reviews, thumbText, thumbChecked) {
    //console.log(db, 'DBBBBBBEEEE')
    return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db
                .into('place')
                .insert(testPlaces)
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
                                            console.log('db populated')
                                        })
                                })
                        })
                })
        })
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db
        .into('users')
        .insert(preppedUsers)
        .then(() => {
            console.log('users populated')
        })
}



function makeExpectedPlaceReviews(user, place, reviews) {
    console.log(user, 'MHMMMM' , place)
        let filteredByUser = reviews.filter(rev => rev.userid === user.id);
        let filteredByPlace = filteredByUser.filter(rev => rev.place_id === place.id);
        let review = filteredByPlace[0];
        

        
        // console.log(reviews, filteredReviews, 'Final???????')
        // let reviewText = {};
        // let reviewDate = {};
        // let reviewCheckedThumbs = {}

        // filteredReviews.forEach(rev => {
        //     reviewText[rev.review] = true;
        //     reviewDate[rev.date] = true;
        //     reviewCheckedThumbs[rev.description] = true;
        // });

        const expectedPlace = {
            id: place.id,
            yelp_id: place.yelp_id,
            name: place.name,
            img: place.img,
            url: place.url,
            yelp_rating: place.yelp_ating,
            location_str: place.location_str,
            location_city: place.location_city,
            location_zip: place.location_zip,
            location_st: place.location_st,
            display_phone: place.display_phone,
            userid: user.userid,
            category: place.category,
            green_reviews_count: place.green_reviews_count,
            review: review.review,
            reviewDate: review.date,
            checkedthumbs: Object.keys(reviewCheckedThumbs)
        }
        console.log(expectedPlace)
    }
   



function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    cleanTables,
    seedGreenPlaces,
    seedUsers,
    makeExpectedPlaceReviews,
    makeAuthHeader,

}