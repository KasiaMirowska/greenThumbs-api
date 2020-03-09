const express = require('express');
const reviewsRouter = express.Router();
const jsonBodyParser = express.json();
const PlacesService = require('../places/places-service');
const ReviewsService = require('../reviews/reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');

reviewsRouter
.route('/api/:user_id/review')
.all(requireAuth)
.post(jsonBodyParser, async(req, res, next) => {
    try {
        const knexInstance = req.app.get('db');
        const user_id = Number(req.params.user_id);
        const { yelpId, name, img, url, yelpRating, location_str, location_city, location_zip, location_st, phone, displayPhone, folderId, greenReviewsCount, userId, review, checkedThumbs} = req.body;
        for (const [key, value] of Object.entries(req.body)) {
            if (value === null) {
                return res.status(400).send({ error: { message: `Missing ${key}` } });
            }
        }
        //checkedThumbs is an array of numbers referring to ids of thumb text
        let newThumbChecked
        // need to save place first, then review so db assigns placeId and reviewId, then call db to get those ids and create thumbChecked obj with them
        let newGreenPlace = {
            yelpid: yelpId,
            name,
            img_url: img,
            url,
            yelprating: yelpRating,
            location_str,
            location_city,
            location_zip,
            location_st,
            phone,
            displayphone: displayPhone,
            userid: user_id,
            folderid: folderId,
            green_reviews_count: greenReviewsCount ,
        }
        
        let savedPlace = await PlacesService.insertNewPlace(knexInstance, newGreenPlace)
      
        let newReview = {
            userid: userId,
            placeid: savedPlace.id,
            review,
        };
        let savedReview = await ReviewsService.insertNewReview(knexInstance, newReview)
        // let updatedPlace = {
        //     ...savedPlace,
        //     green_reviews_count: green_reviews_count + 1,
        // }
        console.log(savedReview);

        checkedThumbs.forEach(el => {
            let newCheckedThumb = {
                userid : userId, 
                placeid: savedPlace.id,
                reviewid: savedReview.id, 
                thumb: el
            }
            ReviewsService.insertNewCheckedThumb(knexInstance, newCheckedThumb)
            .then(newThumb => {
                console.log(newThumb)
            })
            
        })

        
        console.log({newGreenPlace, newReview, checkedThumbs}, "RETURNING TO CLIENT")
        return res.json(201).json({newGreenPlace, newReview, checkedThumbs}).location(path.posix.join(req.originalUrl, `/${newPlace.id}`))


    } catch(err) {
        next(err)
    }
   
    
})


module.exports = reviewsRouter;