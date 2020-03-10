
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

    getReviewByPlaceId:  (knex, placeId) => {
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
            console.log(rows)
            return rows[0];
        })
    },

    deleteReview: (knex, userId, placeToRemove) => {
        return knex.from('review').select('*').where({userid: userId, placeid: placeToRemove}).delete()
        .then((rows) => {
            console.log(rows,'???????.........222222222>>>>?????????')
        } )
    },

    deleteCheckedThumb: (knex, userId, placeToRemove) => {
        return knex.from('thumbChecked').select('*').where({userid: userId, placeid: placeToRemove}).delete()
        .then((rows) => {
            console.log(rows,'???????>>>>>>>?????????')
        } )
    }

}
module.exports = ReviewsService;
