const dataHelpers = require('./test-data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            users,
            place
            RESTART IDENTITY CASCADE`
    )
}

function seedGreenPlaces(db, users, places, reviews, thumbText, thumbChecked) {
    return db
        .into('users')
        .insert(users)
        .then(() => {
            db
                .into('place')
                .insert(places)
                .then(() => {
                    db
                        .into('review')
                        .insert(reviews)
                        .then(() => {
                            db
                                .into('thumbText')
                                .insert(thumbText)
                                .then(() => {
                                    db
                                        .into('thumbChecked')
                                        .insert(thumbChecked)
                                        .then(() => {

                                        })
                                })
                        })
                })
        })
}

function makeExpectedPlace(users, places, reviews, thumbText, thumbChecked) {
    let greenPlacesList = [];
    for (let i = 0; i < places.length; i++) {
       
        let filteredReviews = reviews.filter(rev => rev.placeId === places[i].id)
       
        let finalFilteredReviews = [...filteredReviews]
        console.log(filteredReviews, 'Final???????')
        let reviewText = {};
        let reviewDate = {};
        let reviewCheckedThumbs = {}

        finalFilteredReviews.forEach(rev => {
            reviewText[rev.review] = true;
            reviewDate[rev.date] = true;
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
            displayPhone: places[i].phone,
            userId: places[i].userId,
            folderId: places[i].folderId,
            green_reviews_count: places[i].green_reviews_count,
            review: Object.keys(reviewText),
            reviewDate: Object.keys(reviewDate),
            checkedThumbs: Object.keys(reviewCheckedThumbs)
        })
    }
    console.log(greenPlacesList)
    return greenPlacesList;

}

module.exports = {
    cleanTables,
    seedGreenPlaces,
    makeExpectedPlace,
}