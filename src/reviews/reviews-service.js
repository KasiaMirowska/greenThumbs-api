
const ReviewsService = {
    getAllReviews: (knex, placeId) => {
        return knex
            .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.place_id',
                'rev.review',
                'rev.date',
                'rev.place_category',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.place_id',
                'thc.place_id'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                { 'rev.place_id': placeId }
            );

    },

    getAllReviewsByUser: (knex, userId, placeId) => {
        return knex
            .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.place_id',
                'rev.review',
                'rev.date',
                'rev.place_category',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.place_id',
                'thc.place_id'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                {
                    'rev.userid': userId,
                    'rev.place_id': placeId,
                }
            )
            .then(rows => {
                return rows;
            })
    },

    getReviewByPlaceId: (knex, userId, placeId) => {
        return knex
            .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.place_id',
                'rev.review',
                'rev.date',
                'rev.place_category',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.place_id',
                'thc.place_id'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                {
                    'rev.userid': userId,
                    'rev.place_id': placeId,
                }
            )
            .then(rows => {
                return rows
            })


    },
    getReviewCountPerPlace: (knex, yelp_id) => {
        return knex.from('review').select('*').where({ yelp_id: yelp_id })
            .then(rows => {
                return rows;
            });
    },


    insertNewReview: (knex, newReview) => {
        return knex.into('review').insert(newReview).returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    insertNewCheckedThumb: (knex, newCheckedThumb) => {
        return knex.into('thumbchecked').insert(newCheckedThumb).returning('*')
            .then(rows => {
                return rows;
            });
    },

    updateReview: (knex, userId, placeId, updatedFields) => {
        return knex('review').where({ userid: userId, place_id: placeId }).delete()
            .then(() => {
                return knex('review').where({ userid: userId, place_id: placeId }).insert(updatedFields).returning('*')
            })
            .then(rows => {
                return rows[0];
            });
    },

    updateThumbChecked: (knex, userId, placeId, updatedList) => {
        return knex('thumbchecked').where({ userid: userId, place_id: placeId }).delete()
            .then((deletedThumb) => {
                return knex.into('thumbchecked').where({ userid: userId, place_id: placeId }).insert(updatedList).returning('*')
            })
            .then(rows => {
                return rows;
            });//insert can insert one obj or an array /// dont nest THENS!
    },

    deleteReview: (knex, userId, placeToRemove) => {
        return knex.from('review').select('*').where({ userid: userId, place_id: placeToRemove }).del()
            .then((rows) => {
            });
    },

    deleteCheckedThumb: (knex, userId, placeToRemove) => {
        return knex.from('thumbchecked').select('*').where({ userid: userId, place_id: placeToRemove }).del()
            .then((rows) => {
            });
    }

}
module.exports = ReviewsService;
