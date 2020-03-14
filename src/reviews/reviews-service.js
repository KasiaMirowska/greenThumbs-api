
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
            )

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


    },

    insertNewReview: (knex, newReview) => {
        return knex.into('review').insert(newReview).returning('*')
            .then(rows => {
                console.log(rows, 'ROWS')
                return rows[0];
            })
    },

    insertNewCheckedThumb: (knex, newCheckedThumb) => {
        return knex.into('thumbchecked').insert(newCheckedThumb).returning('*')
            .then(rows => {
                return rows[0];
            })
    },

    updateReview: (knex, userId, placeId, updatedFields) => {
        //console.log(updatedFields, 'HERE???>>>>>>>>>')
        return knex('review').where({ userid: userId, place_id: placeId }).update(updatedFields).returning('*')
            .then(rows => {
                return rows[0];
            })
    },

    updateThumbChecked: (knex, userId, placeId, updatedList) => {
        return knex.into('thumbchecked').where({ userid: userId, place_id: placeId }).del()
            .then(() => {
                return knex.into('thumbchecked').insert(updatedList).returning('*')
            })
            .then(rows => {
                return rows;
        })//insert can insert one obj or an array /// dont nest THENS!
    },

    deleteReview: (knex, userId, placeToRemove) => {
        return knex.from('review').select('*').where({ userid: userId, place_id: placeToRemove }).del()
            .then((rows) => {
                console.log(rows, '???????.........222222222>>>>?????????')
            })
    },

    deleteCheckedThumb: (knex, userId, placeToRemove) => {
        return knex.from('thumbchecked').select('*').where({ userid: userId, place_id: placeToRemove }).del()
            .then((rows) => {
                console.log(rows, '???????>>>>>>>?????????')
            })
    }

}
module.exports = ReviewsService;
