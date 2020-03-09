
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
    }

}
module.exports = ReviewsService;
