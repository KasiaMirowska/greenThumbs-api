
const PlacesService = {
    getAllGreenPlaces: (knex) => {
        return knex
            .from('place')
            .select('*')   
    },

    getAllGreenPlacesByUser: (knex, userId) => {
        return knex.from('place').select('*').where('userid', userId)
    },

    insertNewPlace: (knex, newPlace) =>{
        return knex.into('place').insert(newPlace).returning('*')
        .then(rows => {
            return rows[0]
        })
    }
}
module.exports = PlacesService;
