
const PlacesService = {
    getAllGreenPlaces: (knex) => {
        return knex
            .from('place')
            .select('*')   
    },

    getAllGreenPlacesByUser: (knex, userId) => {
        return knex.from('place').select('*').where('userid', userId)
    },

    getPlaceById: (knex, user_id, place_id) => {
        return knex.from('place').select('*').where({'id': place_id, userid: user_id}).first()
    },

    insertNewPlace: (knex, newPlace) =>{
        return knex.into('place').insert(newPlace).returning('*')
        .then((rows) => {
            return rows[0]
        })
    },

    updateGreenPlace: (knex,userId, placeId, updatedFields) => {
        return knex.into('place').where({userid: userId, id: placeId}).update(updatedFields)
        .then((rows) => {
            console.log(rows, '>>>>>>?//rows after update?')
            return rows[0];
        })
    },

    deleteReviewedPlace: (knex, userId, place_id) => {
        return knex.from('place').select('*').where({userid: userId, id: place_id}).delete()
        .then((rows) => {
            console.log(rows,'???????>>>3333333//////?????????')
        } )
    }
}
module.exports = PlacesService;
