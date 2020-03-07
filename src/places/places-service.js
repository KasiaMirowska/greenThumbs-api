
const PlacesService = {
    getAllGreenPlaces: (knex) => {
        return knex
            .from('place')
            .select('*')   
    }
}
module.exports = PlacesService;
