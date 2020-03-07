
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
                {'rev.placeid': placeId}
            )    

    },

    
}
module.exports = ReviewsService;
