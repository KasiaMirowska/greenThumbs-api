
const PlacesService = {
    getAllGreenPlaces: knex => (
        knex.from('place AS pl').select('*')
    ),

    getAllGreenPlacesByUser: (knex, userId) => {
        return knex
            .from('place AS pl')
            .select('*')
            .join('userplace AS usrpl',
                'usrpl.reviewed_place_id',
                'pl.id'
            )
            .where('userid', userId)
            .then(rows => {
                return rows;
            })
    },

    getPlaceByUserAndId: (knex, user_id, place_id) => {
        console.log(user_id, place_id ,'SERVICE')
        return knex
            .from('place AS pl')
            .select('*')
            .join('userplace AS usrpl',
                'usrpl.reviewed_place_id',
                'pl.id'
            )
            .where({ 'usrpl.userid': user_id, 'pl.id': place_id, }).first()
            .then((rows) => {
                if(rows) {
                let num = Number(rows.yelp_rating)
                return {...rows, yelp_rating: num}
                }
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

    getAllUserPlaces: (knex) => {
        return knex.from ('userplace AS usrpl').select('usrpl.reviewed_place_id')
        .then(rows => {
           const reviewedIds = [];
            rows.forEach(el => reviewedIds.push(el.reviewed_place_id))
            return reviewedIds;
        })
    },

    getUserInUserPlace: (knex, userId, yelp_id) => {
        return knex
            .from('place')
            .select('place.id', 'place.yelp_id', 'userid')
            .join('userplace', 'userplace.reviewed_place_id', 'place.id')
            .where({ userid: userId, yelp_id: yelp_id }).first()
            .then(rows => {
                console.log(rows)
                return rows;
            })
    },

    getPlaceByYelpId: (knex, userId, yelpId) => {
        return knex.from('place').select('*').where({'yelp_id': yelpId, userid: userId}).first()
    },

    insertNewPlace: (knex, newPlace) => {
        console.log(newPlace, 'PLACE SERIVDE')
        return knex.into('place').insert(newPlace).returning('*')
            .then((rows) => {
                let num = Number(rows[0].yelp_rating)
                return {...rows[0], yelp_rating: num}
            })
            .catch(err => {
                console.log(err)
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

    deleteUserPlace: (knex, userId, place_id) => {
        return knex.from('userplace').select('*').where({userid: userId, reviewed_place_id: place_id}).del()
        .then(rows => {
            console.log(rows, 'DELETING USEPLCASE==')
            return rows
        })
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
            .where({ id: place_id }).del()
            .then((rows) => {
                console.log(rows, '???????>>>3333333//////?????????')
            })
    }
}
module.exports = PlacesService;
