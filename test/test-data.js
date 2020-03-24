

const makeTestUsers = () => {
    return [
        {
            id: 1,
            fullname: 'full name1',
            username: 'username1',
            password: '!@123Abcd',
        },
        {
            id: 2,
            fullname: 'full name2',
            username: 'username2',
            password: '!@123Abcd',
        },
        {
            id: 3,
            fullname: 'full name3',
            username: 'username3',
            password: '!@123Abcd',
        }
    ]
}

const makeTestPlaces = () => {
    return [
        {
            id: 1,
            yelp_id: 'aB1c',
            name: 'first place',
            img_url: 'image1',
            url: 'yelpUrl',
            yelp_rating: 5,
            location_str: '1 street',
            location_city: 'cityFirst',
            location_zip: '012345',
            location_st: 'MA',
            display_phone: '(123) 345 5678',
        },
        {
            id: 2,
            yelp_id: 'aB2c',
            name: 'second place',
            img_url: 'image2',
            url: 'yelpUrl',
            yelp_rating: 5,
            location_str: '2 street',
            location_city: 'citySecond',
            location_zip: '012345',
            location_st: 'MA',
            display_phone: '(123) 345 5678',
        },
        {
            id: 3,
            yelp_id: 'aB3c',
            name: 'third place',
            img_url: 'image3',
            url: 'yelpUrl',
            yelp_rating: 4,
            location_str: '3 street',
            location_city: 'cityThird',
            location_zip: '012345',
            location_st: 'MA',
            display_phone: '(123) 345 5678',
        },
    ]
}
const makeTestReviews = () => {
    return [
        {
            id:1,
            userid: 1,
            place_id: 1,
            place_category: 'category1',
            review: 'first review',
        },
        {
            id:2,
            userid: 1,
            place_id: 2,
            place_category: 'category1',
            review: 'second review',
           
        },
        {
            id:3,
            userid: 1,
            place_id: 3,
            review: 'third review',
            place_category: 'category1',
        },
        {
            id:4,
            userid: 2,
            place_id: 2,
            place_category: 'category2',
            review: 'fourth review',
        },
    ]
}

const makeTestThumbText =()=> {
    return [
        {
            id: 1,
            description: 'No single use plastic',
        },
        {
            id: 2,
            description: 'Compostable take-out containers and cups',
        },
        {
            id: 3,
            description: 'No plastic bottled drinks',
        },
        {
            id: 4,
            description: 'Composting food scraps',
        }
    ]
}

const makeTestThumbChecked = () => {
    return [
        {
            id: 1,
            userid: 1,
            place_id: 1,
            review_id: 1,
            thumb: 1
        },
        {
            id: 2,
            userid: 1,
            place_id: 1,
            review_id: 1,
            thumb: 4
        },
        {
            id: 3,
            userid: 1,
            place_id: 3,
            review_id: 2,
            thumb: 3
        },
        {
            id: 4,
            userid: 1,
            place_id: 3,
            review_id: 2,
            thumb: 4
        },
        {
            id: 5,
            userid: 2,
            place_id: 2,
            review_id: 4,
            thumb: 2
        },
    ]
}

const makeTestUserPlaces = () => {
    return [
        {
            userid:1,
            reviewed_place_id: 1,
        },
        {
            userid:1,
            reviewed_place_id: 2,
        },
        {
            userid:1,
            reviewed_place_id: 3,
        },
        {
            userid:2,
            reviewed_place_id: 1,
        },
        {
            userid:2,
            reviewed_place_id: 2,
        },
        {
            userid:3,
            reviewed_place_id: 1,
        }
    ]
}


const makeTestData = () => {
    testUsers = makeTestUsers();
    testPlaces = makeTestPlaces();
    testReviews = makeTestReviews();
    testThumbText = makeTestThumbText();
    testThumbChecked = makeTestThumbChecked();
    testUserPlaces = makeTestUserPlaces()
    return { testUsers, testPlaces, testReviews, testUserPlaces, testThumbText, testThumbChecked};
}

module.exports = {
  
    makeTestUsers,
    makeTestPlaces,
    makeTestReviews,
    makeTestThumbText,
    makeTestThumbChecked,
    makeTestUserPlaces,
    makeTestData,
}