const express = require('express');
const placesRouter = express.Router();
const jsonBodyParser = express.json();
const PlacesService = require('./places-service');
const ReviewsService = require('../reviews/reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');

placesRouter // gets all green thumb reviewed places with full info
    .route('/api/')
    .all(async (req, res, next) => {
        try {
            res.placesReviewed = [];
            const knexInstance = req.app.get('db')
            const places = await PlacesService.getAllGreenPlaces(knexInstance);
        
           
            for (let i = 0; i < places.length; i++) {
                const reviews = await ReviewsService.getAllReviews(knexInstance, places[i].id);
                if (reviews) {
                    let reviewText = {};
                    let reviewDate = {};
                    let reviewCategory = {};
                    let reviewCheckedThumbs = {}
                    
                    reviews.forEach(rev => {
                        reviewText[rev.review] = true;
                        reviewDate[rev.date] = true;
                        reviewCategory[rev.place_category] = true;
                        reviewCheckedThumbs[rev.description] = true;
                    });

                    const {
                        id, yelp_id, name, img_url, url, yelp_rating,
                        location_str, location_city, location_zip,
                        location_st, display_phone, green_reviews_count, userid
                    } = places[i];

                    res.placesReviewed.push({
                        id,
                        yelp_id,
                        name,
                        img: img_url,
                        url,
                        yelp_rating,
                        location_str,
                        location_city,
                        location_zip,
                        location_st,
                        display_phone,
                        green_reviews_count: reviews.length,
                        userid,
                        review: Object.keys(reviewText),
                        reviewDate: Object.keys(reviewDate),
                        reviewCategory: Object.keys(reviewCategory),
                        checkedThumbs: Object.keys(reviewCheckedThumbs)
                    });
                };
                
            };
            next();
        } catch (err) {
            next(err);
        }
    })
    .get((req, res, next) => {
        res.status(200).json(res.placesReviewed)
    });


placesRouter
    //gets green reviewed places by user with full info
    .route('/api/user/')
    .all(requireAuth)
    .all(async (req, res, next) => {

        try {
            const knexInstance = req.app.get('db');
            const user_id = Number(req.user.id);
        
            res.userPlacesReviewed = [];
            const userPlaces = await PlacesService.getAllGreenPlacesByUser(knexInstance, user_id)
            console.log(userPlaces, 'PLACES')
            if (userPlaces.length) {
                for (let i = 0; i < userPlaces.length; i++) {
                    const userReviews = await ReviewsService.getAllReviewsByUser(knexInstance, user_id, userPlaces[i].id)
                    if (userReviews) {
                        console.log(userReviews)
                        let reviewText = {};
                        let reviewDate = {};
                        let reviewCategory = {};
                        let reviewCheckedThumbs = {}
                       
                        userReviews.forEach(rev => {
                            reviewText[rev.review] = true;
                            reviewDate[rev.date] = true;
                            reviewCategory[rev.place_category] = true;
                            reviewCheckedThumbs[rev.description] = true;
                        });

                        const {
                            id, yelp_id, name, img_url, url, yelp_rating,
                            location_str, location_city, location_zip,
                            location_st, display_phone, userid, green_reviews_count,
                        } = userPlaces[i];

                        res.userPlacesReviewed.push({
                            id,
                            yelp_id,
                            name,
                            img: img_url,
                            url,
                            yelp_rating,
                            location_str,
                            location_city,
                            location_zip,
                            location_st,
                            display_phone,
                            userid,
                            green_reviews_count,
                            review: Object.keys(reviewText),
                            reviewDate: Object.keys(reviewDate),
                            reviewCategory: Object.keys(reviewCategory),
                            checkedThumbs: Object.keys(reviewCheckedThumbs)
                        });

                        //console.log(res.userPlacesReviewed, 'HERE??????')
                    };
                };
            } else {
                return res.status(400).send({ error: { message: 'User has not reviewed any places' } })
            }
            next();
        } catch (err) {
            next(err);
        }
    })
    .get((req, res, next) => {
        res.status(200).json(res.userPlacesReviewed)
    });


placesRouter //gets by id reviewed place with full info
    .route('/api/place/:place_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.user.id
        const place_id  = req.params.place_id;
        
        PlacesService.getPlaceByUserAndId(knexInstance, user_id, place_id)
            .then(place => {
                if (!place) {
                    return res.status(404).json({ error: { message: `User with id ${user_id} did not review place with id ${place_id}` } })
                }
                res.place = place
                
                ReviewsService.getReviewByPlaceId(knexInstance, user_id, place_id)
                    .then(reviews => {
                        console.log(reviews, 'REVIEWS IN GET BYY ID')
                        if (reviews) {
                            let reviewText = {};
                            let reviewDate = {};
                            let reviewCheckedThumbs = {}
    
                            reviews.forEach(rev => {
                                reviewText[rev.review] = true;
                                reviewDate[rev.date] = true;
                                reviewCheckedThumbs[rev.description] = true;
                            });
    
                            res.fullReviewedPlace = {
                               ...res.place,
                                review: Object.keys(reviewText),
                                reviewDate: Object.keys(reviewDate),
                                checkedThumbs: Object.keys(reviewCheckedThumbs)
                            };
                        };
                        next()
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        return res.status(200).json(res.fullReviewedPlace)
    });

// placesRouter
// .route('/api/:place_id/count')
// .get((req, res, next) => {
//     const knexInstance = req.app.get('db');
//     const yelp_id = req.params.place_id;
//     console.log(yelp_id, req.params.place_id, 'CHECKING FOR COUNT')
//     ReviewsService.getReviewCountPerPlace(yelp_id)
//     .then(places => {
//         console.log('///success???')
//     })
// })
module.exports = placesRouter;
