const express = require('express');
const placesRouter = express.Router();
const jsonBodyParser = express.json();
const PlacesService = require('./places-service');
const ReviewsService = require('../reviews/reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');

// gets all green thumb reviewed places with full info
placesRouter
    .route('/api/')
    .all(async (req, res, next) => {
        try {
            res.placesReviewed = [];
            const knexInstance = req.app.get('db');
            const places = await PlacesService.getAllGreenPlaces(knexInstance);
            const reviewedPlacesIds = await PlacesService.getAllUserPlaces(knexInstance);
            let filteredPlaces = [];
            places.filter(pl => {
                reviewedPlacesIds.filter(id => {
                    if (pl.id === id) {
                        filteredPlaces.push(pl);
                    };
                });
                return filteredPlaces;
            });

            for (let i = 0; i < filteredPlaces.length; i++) {
                const reviews = await ReviewsService.getAllReviews(knexInstance, filteredPlaces[i].id);

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
                        location_st, display_phone, green_reviews_count
                    } = filteredPlaces[i];

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
                        review: Object.keys(reviewText)[0] || '',
                        reviewDate: Object.keys(reviewDate),
                        checkedThumbs: Object.keys(reviewCheckedThumbs),
                        category: Object.keys(reviewCategory)[0] || '',
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
            const userPlaces = await PlacesService.getAllGreenPlacesByUser(knexInstance, user_id);

            if (userPlaces.length > 0) {
                for (let i = 0; i < userPlaces.length; i++) {
                    const userReviews = await ReviewsService.getAllReviewsByUser(knexInstance, user_id, userPlaces[i].id)
                    if (userReviews) {

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
                            location_st, display_phone, userid,
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
                            review: Object.keys(reviewText)[0] || '',
                            reviewDate: Object.keys(reviewDate),
                            checkedThumbs: Object.keys(reviewCheckedThumbs),
                            category: Object.keys(reviewCategory)[0] || '',
                        });
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
        res.status(200).json(res.userPlacesReviewed);
    });


placesRouter //gets by id reviewed place with full info
    .route('/api/place/:place_id')
    .all(requireAuth)
    .all(async (req, res, next) => {
        try {

            const knexInstance = req.app.get('db');
            const user_id = req.user.id
            const place_id = Number(req.params.place_id);

            let foundPlace = await PlacesService.getPlaceByUserAndId(knexInstance, user_id, place_id)
            if (!foundPlace) {
                return res.status(400).json({ error: { message: `User with id ${user_id} did not review place with id ${place_id}` } });
            }

            res.place = foundPlace;

            let foundReviews = await ReviewsService.getReviewByPlaceId(knexInstance, user_id, place_id);
            if (foundReviews) {
                let reviewText = {};
                let reviewCheckedThumbs = {};
                let reviewCategory = {};

                foundReviews.forEach(rev => {
                    reviewText[rev.review] = true;
                    reviewCheckedThumbs[rev.description] = true;
                    reviewCategory[rev.place_category] = true;
                });
                res.fullReviewedPlace = {
                    ...res.place,
                    review: Object.keys(reviewText)[0] || '',
                    checkedThumbs: Object.keys(reviewCheckedThumbs),
                    category: Object.keys(reviewCategory)[0] || '',
                };
            };
            next();
        } catch (err) {
            next(err);
        }
    })

    .get((req, res, next) => {
        return res.status(200).json(res.fullReviewedPlace);
    });


module.exports = placesRouter;
