
const PlacesService = {
    getAllGreenPlaces: (knex) => {
        return knex
            .from('place AS pl')
            .select('*')
            .join('userplace AS usrpl',
                'usrpl.reviewed_place_id',
                'pl.id'
            )
    },

    getAllGreenPlacesByUser: (knex, userId) => {
        return knex
            .from('place AS pl')
            .select('*')
            .join('userplace AS usrpl',
                'usrpl.reviewed_place_id',
                'pl.id'
            )
            .where('userid', userId)
    },

    getPlaceByUserAndId: (knex, user_id, place_id) => {
        return knex
        .from('place AS pl')
        .select('*')
            .join('userplace AS usrpl',
                'usrpl.reviewed_place_id',
                'pl.id'
            )
        .where({ 'usrpl.userid': user_id, 'pl.id': place_id, }).first()
            .then((rows) => {
                console.log(rows, '1111111111ROWS OF PLACE BY USER ID')
                return rows;
            })
    },

    getPlaceById: (knex, place_id) => {
        console.log(place_id)
        return knex
            .from('place')
            .select('place.id', 'place.yelp_id', 'place.name')
            .where({ yelp_id: place_id })
            .first()
            .then((rows) => {
                return rows;
            })
    },

    getUserInUserPlace: (knex, userId, yelp_id) => {
        return knex
        .from('place')
        .select('place.id' , 'place.yelp_id', 'userid')
        .join('userplace', 'userplace.reviewed_place_id', 'place.id')
        .where({userid: userId, yelp_id: yelp_id}).first()
        .then(rows => {
            console.log(rows)
            return rows;
        })
    },

    insertNewPlace: (knex, newPlace) => {
        return knex.into('place').insert(newPlace).returning('*')
            .then((rows) => {
                return rows[0]
            })
    },
    
    insertNewUserPlace: (knex, newUserPlace) => {
        return knex.into('userplace').insert(newUserPlace).returning('*')
            .then((rows) => {
                return rows[0]
            })
    },

    updateGreenPlace: (knex, userId, placeId, updatedFields) => {
        // console.log(updatedFields, "IN SERVICE", userId, 'l',placeId, "PL" )
        return knex.into('place').where({ id: placeId }).update(updatedFields)
        // .then((rows) => {
        //     console.log(rows, '>>>>>>?//rows after update?')
        //     return rows; //update returns a number of updated rows
        // })
    },

    deleteReviewedPlace: (knex, userId, place_id) => {
        console.log(userId, place_id)
        return knex
        .from('place AS pl')
        .select('*')
        .join('userplace AS usrpl',
        'usrpl.reviewed_place_id',
        'pl.id'
    )
        .where({ id: place_id}).del()
            .then((rows) => {
                console.log(rows, '???????>>>3333333//////?????????')
            })
    }
}
module.exports = PlacesService;
