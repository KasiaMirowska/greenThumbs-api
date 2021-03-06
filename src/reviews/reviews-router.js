const express = require('express');
const reviewsRouter = express.Router();
const jsonBodyParser = express.json();
const PlacesService = require('../places/places-service');
const ReviewsService = require('../reviews/reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const validUrl = require('valid-url');

reviewsRouter
    //creates green-reviewed place in db that consists of yelp-place-data recorded into 'place' table and review section recorded into 'review' and 'thumbChecked' tables
    .route('/api/:place_id/review')
    .all(requireAuth)
    .post(jsonBodyParser, async (req, res, next) => {
        try {
            const knexInstance = req.app.get('db');
            const user_id = req.user.id;
            const yelpId = req.params.place_id;
            const { yelp_id, name, img_url, url, yelp_rating, location_str, location_city, location_zip, location_st, display_phone, category, review, checkedThumbs } = req.body;
            
            for (const [key, value] of Object.entries(req.body)) {
                if (value === null || value.length === 0 || value === '') {
                    return res.status(400).send({ error: { message: `Missing fields` } });
                }
            }
            const existingReviewByUser = await PlacesService.getUserInUserPlace(knexInstance, user_id, yelpId)
            if (existingReviewByUser) {
                return res.status(400).send({ error: { message: `your review already exists` } });
            }
            //first check if there's a place of this id in GREEN db, if not we will save the place info, but it it already exists we will just add another review and checked thumbs
            const existingPlace = await PlacesService.getPlaceById(knexInstance, yelpId);
            if (!existingPlace) {
                let newGreenPlace = {
                    yelp_id,
                    name,
                    img_url,
                    url,
                    yelp_rating: Number(yelp_rating),
                    location_str,
                    location_city,
                    location_zip,
                    location_st,
                    display_phone,
                };
                let savedPlace = await PlacesService.insertNewPlace(knexInstance, newGreenPlace);
                let newUserPlace = {
                    userid: user_id,
                    reviewed_place_id: savedPlace.id
                };
                let savedUserPlace = await PlacesService.insertNewUserPlace(knexInstance, newUserPlace);
                let newReview = {
                    userid: user_id,
                    place_id: savedPlace.id,
                    place_category: category,
                    review,
                };
                let savedReview = await ReviewsService.insertNewReview(knexInstance, newReview);

                let thumbArr= checkedThumbs.map(el => {
                    let newCheckedThumb = {
                        userid: user_id,
                        place_id: savedPlace.id,
                        review_id: savedReview.id,
                        thumb: el
                    };
                    return newCheckedThumb;
                });
                let newSavedThumbs = await ReviewsService.insertNewCheckedThumb(knexInstance, thumbArr)
                .then(rows => {
                        return rows.map(el => el.thumb)
                })
                
                return res.status(201).json({ savedPlace, savedReview, newSavedThumbs });

            } else {
                let newUserPlace = {
                    userid: user_id,
                    reviewed_place_id: existingPlace.id
                };

                let savedUserPlace = await PlacesService.insertNewUserPlace(knexInstance, newUserPlace);
               
                let newReview = {
                    userid: user_id,
                    place_id: existingPlace.id,
                    place_category: category,
                    review,
                };
                let savedReview = await ReviewsService.insertNewReview(knexInstance, newReview);
    
                let thumbArr= checkedThumbs.map(el => {
                    let newCheckedThumb = {
                        userid: user_id,
                        place_id: existingPlace.id,
                        review_id: savedReview.id,
                        thumb: el
                    };
                    return newCheckedThumb;
                });
                let savedThumbs = await ReviewsService.insertNewCheckedThumb(knexInstance, thumbArr)
                .then(rows => {
                        return rows.map(el => el.thumb);
                });
                return res.status(201).json({savedReview, savedThumbs});
            }
        } catch (err) {
            next(err);
        }
    });

reviewsRouter //updating a reviewed place
    .route('/api/edit/:green_place_id')
    .all(requireAuth)
    .patch(jsonBodyParser, async (req, res, next) => {
        try {
            const knexInstance = req.app.get('db');
            const green_place_id = Number(req.params.green_place_id);
            const user_id = req.user.id;
            let {
                yelp_id, name, img, url, yelp_rating,
                location_str, location_city, location_zip,
                location_st, display_phone,
                 category, review, checkedThumbs
            } = req.body;

            
            for (const [key, value] of Object.entries(req.body)) {
                if (value === null) {
                    return res.status(400).send({ error: { message: `Missing fields` } });
                }
            }
        
            
            // in future should call proxy here to get place's info again in order to ensure that if the place's address or other info was not changed in yelp it gets updated in green thumbs up as well.....
            const existingReview = await ReviewsService.getReviewByPlaceId(knexInstance, user_id, green_place_id);
           
            if (existingReview.length === 0) {
                let newReview = {
                    userid: user_id,
                    place_id: green_place_id,
                    place_category: category,
                    review,
                };

                let savedReview = await ReviewsService.insertNewReview(knexInstance, newReview)
               
               
                let thumbArr= checkedThumbs.map(el => {
                    let newCheckedThumb = {
                        userid: user_id,
                        place_id: green_place_id,
                        review_id: savedReview.id,
                        thumb: el
                    }
                    return newCheckedThumb;
                })
                let updatedThumbs = await ReviewsService.updateThumbChecked(knexInstance, user_id, green_place_id, thumbArr)
                .then(rows => {
                        return rows.map(el => el.thumb)
                })
                
               
                return res.status(201).json({ savedReview, updatedThumbs })
            
            
            } else {
                
                if (!review) {
                    review = ' ';
                }
                if (Array.isArray(review)) {
                    review = review[0]
                }
            

                const updatedReviewInfo = {
                    userid: user_id,
                    place_id: green_place_id,
                    place_category: category,
                    date: new Date(),
                    review: review,
                };

                const updatedReview = await ReviewsService.updateReview(knexInstance, user_id, green_place_id, updatedReviewInfo);
    
               
                let thumbArr = checkedThumbs.map(el => {
                    let newCheckedThumb = {
                        userid: user_id,
                        place_id: green_place_id,
                        review_id: updatedReview.id,
                        thumb: el
                    }
                    return newCheckedThumb;
                })
            
                let updatedThumbs = await ReviewsService.updateThumbChecked(knexInstance, user_id, green_place_id, thumbArr)
                .then(rows => {
                        return rows.map(el => el.thumb)
                })

                return res.status(201).json({ updatedReview, updatedThumbs })
            }
        } catch (err) {
            next(err);
        }
        next();
    });



reviewsRouter
    .route('/api/place/delete/:green_place_id')
    .all(requireAuth)
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const userId = req.user.id;
        const placeToRemove = Number(req.params.green_place_id);

        PlacesService.deleteUserPlace(knexInstance, userId, placeToRemove)
            .then(() => {
                ReviewsService.deleteReview(knexInstance, userId, placeToRemove);
            })
            .then(() => {
                return res.status(204).send('reviewed place deleted');
            })
            .catch(next);
    });

module.exports = reviewsRouter;