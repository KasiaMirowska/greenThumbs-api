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
            thumbChecked,
            folder
            RESTART IDENTITY CASCADE`
    )
}

function seedGreenPlaces(db, users, places, reviews, thumbText, thumbChecked) {
    //console.log(db, 'DBBBBBBEEEE')
    return db
        .into('users')
        .insert(users)
        .then(() => {
            db.from('users').select('*')
             .then((users) => {
                 console.log(users, 'UEEEEEEE')
            //     return db
            //     .into('place')
            //     .insert(places)
            //     .then(() => {
            //         return db
            //             .into('review')
            //             .insert(reviews)
            //             .then(() => {
            //                 return db
            //                     .into('thumbText')
            //                     .insert(thumbText)
            //                     .then(() => {
            //                         return db
            //                             .into('thumbChecked')
            //                             .insert(thumbChecked)
            //                             .then(() => {
            //                                  console.log('populated db')
            //                             })
            //                     })
            //             })
            //     })
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

function makeExpectedPlace(users, places, reviews, thumbText, thumbChecked) {
    let greenPlacesList = [];
    for (let i = 0; i < places.length; i++) {
       
        let filteredReviews = reviews.filter(rev => rev.placeId === places[i].id)
       
        console.log(filteredReviews, 'Final???????')
        let reviewText = {};
        let reviewDate = {};
        let reviewCheckedThumbs = {}

        finalFilteredReviews.forEach(rev => {
            // reviewText[rev.review] = true;
            // reviewDate[rev.date] = true;
            reviewCheckedThumbs[rev.description] = true;
        });

        greenPlacesList.push({
            id: places[i].id,
            yelpId: places[i].yelpid,
            name: places[i].name,
            img: places[i].img,
            url: places[i].url,
            yelpRating: places[i].yelpRating,
            location_str: places[i].location_str,
            location_city: places[i].location_city,
            location_zip: places[i].location_zip,
            location_st: places[i].location_st,
            phone: places[i].phone,
            displayphone: places[i].phone,
            userId: places[i].userId,
            folderId: places[i].folderId,
            green_reviews_count: places[i].green_reviews_count,
            review: filteredReviews.map(rev => rev.review),
            reviewDate:filteredReviews.map(rev => rev.date),
            checkedthumbs: Object.keys(reviewCheckedThumbs)
        })
    }
    console.log(greenPlacesList)
    return greenPlacesList;

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
    makeExpectedPlace,
    makeAuthHeader,
    
}