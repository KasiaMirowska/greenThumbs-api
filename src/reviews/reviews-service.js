
const ReviewsService = {
    getAllReviews: (knex, placeId) => {
        return knex
            .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.placeid',
                'rev.review',
                'rev.date',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.placeid',
                'thc.placeid'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                { 'rev.placeid': placeId }
            )

    },

    getAllReviewsByUser: (knex, userId, placeId) => {
        return knex
            .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.placeid',
                'rev.review',
                'rev.date',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.placeid',
                'thc.placeid'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                {
                    'rev.userid': userId,
                    'rev.placeid': placeId,
                }
            )
    },

    getReviewByPlaceId:  (knex, userId, placeId) => {
        return knex
        .from('review AS rev')
            .select(
                'rev.id',
                'rev.userid',
                'rev.placeid',
                'rev.review',
                'rev.date',
                'thc.thumb',
                'th.description'
            )
            .join(
                'thumbchecked AS thc',
                'rev.placeid',
                'thc.placeid'
            )
            .join(
                'thumbtext AS th',
                'thc.thumb',
                'th.id'
            )
            .where(
                {
                    'rev.userid': userId,
                    'rev.placeid': placeId,
                }
            )
            
            
    },

    insertNewReview: (knex, newReview) => {
        return knex.into('review').insert(newReview).returning('*')
        .then(rows =>{
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
        console.log(updatedFields, 'HERE???>>>>>>>>>')
        return knex.into('review').where({userid: userId, placeid: placeId}).update(updatedFields).returning('*')
        .then(rows => {
            return rows[0];
        })
    },

    updateThumbChecked: (knex, userId, placeId, updatedFields) => {
        console.log(updatedFields, 'UPDATED IN SERVICE')
        return knex.into('thumbchecked').where({userid: userId, placeid: placeId}).update(updatedFields).returning('*')
        .then(rows => {
            return rows;
        })
    },

    deleteReview: (knex, userId, placeToRemove) => {
        return knex.from('review').select('*').where({userid: userId, placeid: placeToRemove}).delete()
        .then((rows) => {
            console.log(rows,'???????.........222222222>>>>?????????')
        } )
    },

    deleteCheckedThumb: (knex, userId, placeToRemove) => {
        return knex.from('thumbchecked').select('*').where({userid: userId, placeid: placeToRemove}).delete()
        .then((rows) => {
            console.log(rows,'???????>>>>>>>?????????')
        } )
    }

}
module.exports = ReviewsService;
