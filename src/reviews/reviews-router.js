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

            //const yelpId = req.params.place_id;
            const { yelpId, name, img, url, yelpRating, location_str, location_city, location_zip, location_st, phone, displayPhone, folderId, greenReviewsCount, userId, review, checkedThumbs } = req.body;
            for (const [key, value] of Object.entries(req.body)) {
                if (value === null) {
                    return res.status(400).send({ error: { message: `Missing ${key}` } });
                }
            }
            //checkedThumbs is an array of numbers referring to ids of thumb text
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
                green_reviews_count: greenReviewsCount,
            }

            let savedPlace = await PlacesService.insertNewPlace(knexInstance, newGreenPlace)

            let newReview = {
                userid: user_id,
                placeid: savedPlace.id,
                review,
            };
            let savedReview = await ReviewsService.insertNewReview(knexInstance, newReview)


            checkedThumbs.forEach(el => {
                let newCheckedThumb = {
                    userid: user_id,
                    placeid: savedPlace.id,
                    reviewid: savedReview.id,
                    thumb: el
                }
                ReviewsService.insertNewCheckedThumb(knexInstance, newCheckedThumb)
                    .then(newThumb => {
                        console.log(newThumb)
                    })

            })


            console.log({ newGreenPlace, newReview, checkedThumbs }, "RETURNING TO CLIENT")
            console.log(req.originalUrl, `/${savedPlace.id}`)
            return res.json(201).json({ newGreenPlace, newReview, checkedThumbs }).location(path.posix.join(req.originalUrl, `/${savedPlace.id}`))


        } catch (err) {
            next(err)
        }
    })


reviewsRouter //updating a reviewed place
    .route('/api/edit/:green_place_id')
    .all(requireAuth)
    .all(jsonBodyParser, async (req, res, next) => {
        try {
            const knexInstance = req.app.get('db');
            const green_place_id = Number(req.params.green_place_id);
            const user_id = req.user.id;
            console.log(req.params.green_place_id, Number(req.params.green_place_id))
            const { yelpid, name, img_url, url, yelprating, location_str, location_city, location_zip, location_st, phone, displayphone, folderid, green_reviews_count, review, reviewDate, checkedThumbs } = req.body;
            // for (const [key, value] of Object.entries(req.body)) {
            //     if (value === null) {
            //         return res.status(400).send({ error: { message: `Missing ${key}` } });
            //     }
            // }

            const fullUpdatedPlace = {
                id: green_place_id,
                yelpid,
                name,
                img_url,
                url,
                yelprating,
                location_str,
                location_city,
                location_zip,
                location_st,
                phone,
                displayphone,
                userid: user_id,
                folderid,
                green_reviews_count,
                review,
                reviewdate: reviewDate,
                checkedThumbs,
            }
            console.log(fullUpdatedPlace, '???????HERE??????????')

            let updatedPlaceInfo = {
                id: green_place_id,
                yelpid,
                name,
                img_url,
                url,
                yelprating,
                location_str,
                location_city,
                location_zip,
                location_st,
                phone,
                displayphone,
                userid: user_id,
                folderid,
                green_reviews_count,
            }

            let updatedReviewInfo = {
                userid: user_id,
                placeid: green_place_id,
                date: new Date(),
                review,
            }

        
                let updatedReview;
                let updatedCheckedThumb;
                let updatedPlace;

                updatedPlace = await PlacesService.updateGreenPlace(knexInstance, user_id, green_place_id, updatedPlaceInfo)
                console.log(updatedPlace, 'FINISHED???????????')

                updatedReview = await ReviewsService.updateReview(knexInstance, user_id, green_place_id, updatedReviewInfo)
                console.log(updatedReview, 'FINISHED???222222222222????????')

               
                checkedThumbs.forEach(el => {
                    let updatedCheckedThumbInfo = {
                         userid: user_id,
                         placeid: green_place_id,
                         reviewid: updatedReview.id,
                         thumb: el
                     }
                    ReviewsService.updateThumbChecked(knexInstance, user_id, green_place_id, updatedCheckedThumbInfo)
                     .then(thumb => {
                         console.log(thumb, 'TNUMBSSSSSSSSSS')
                     })
                 })
             
                 return res.json(201).json({ updatedPlace, updatedReview, checkedThumbs }).location(path.posix.join(req.originalUrl, `/${green_place_id}`))

            } catch (err) {
                next(err)
            }
            next()
        })



reviewsRouter
    .route('/api/:user_id/review/:green_place_id')
    .all(requireAuth)
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const userId = req.params.user_id;
        const placeToRemove = req.params.green_place_id;
        //should I get by id first to make sure that if place does not exist I have an if statement????
        PlacesService.deleteReviewedPlace(knexInstance, userId, placeToRemove)
            .then(() => {
                //delete the rest of info
                ReviewsService.deleteReview(knexInstance, userId, placeToRemove)
                    .then(() => {
                        console.log('DONE????')
                        return res.status(204).send('reviewed place deleted')
                        //   ReviewsService.deleteCheckedThumb(knexInstance, userId, placeToRemove)
                        //   .then(() => {
                        //       return res.status(204).json('reviewed place deleted')
                        //   })
                        //   .catch(next)
                    })
                    //return res.status(204).send('reviewed place deleted')
                    .catch(next)
            })
            .catch(next)
    })


module.exports = reviewsRouter;