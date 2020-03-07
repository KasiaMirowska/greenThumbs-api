const express = require('express');
const placesRouter = express.Router();
const jsonBodyParser = express.json();
const PlacesService = require('./places-service');
const ReviewsService = require('../reviews/reviews-service');

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
                    let reviewCheckedThumbs = {}

                    reviews.forEach(rev => {
                        reviewText[rev.review] = true;
                        reviewDate[rev.date] = true;
                        reviewCheckedThumbs[rev.description] = true;
                    });

                    const { 
                        id, yelpid, name, img_url, url, 
                        location_str, location_city, location_zip, 
                        location_st, phone, displayPhone, userId, 
                        folderId, greenReviewsCount 
                    } = places[i];

                    res.placesReviewed.push({
                        id,
                        yelpId: yelpid,
                        name, 
                        img: img_url,
                        url,
                        location_str,
                        location_city,
                        location_zip,
                        location_st,
                        phone,
                        displayPhone,
                        userId,
                        folderId,
                        greenReviewsCount,
                        review: Object.keys(reviewText),
                        reviewDate: Object.keys(reviewDate),
                        checkedThumbs: Object.keys(reviewCheckedThumbs)
                    });
                }
            }
            next();
        } catch (err) {
            next(err);
        }
    })
    .get((req,res,next) => {
        console.log(res.placesReviewed, 'HERERER')
        res.status(200).json(res.placesReviewed)
    })

    module.exports = placesRouter;
