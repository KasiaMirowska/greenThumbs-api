

makeTestUsers = () => {
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
            yelp_rating: 4.5,
            location_str: '1 street',
            location_city: 'cityFirst',
            location_zip: '012345',
            location_st: 'MA',
            display_phone: '(123) 345 5678',
            userid: 1,
            green_reviews_count: 2,
            category: 'category1',
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
            userid: 2,
            green_reviews_count: 1,
            category: 'category2',
        },
        {
            id: 3,
            yelp_id: 'aB1c',
            name: 'first place',
            img_url: 'image3',
            url: 'yelpUrl',
            yelp_rating: 4,
            location_str: '3 street',
            location_city: 'cityThird',
            location_zip: '012345',
            location_st: 'MA',
            display_phone: '(123) 345 5678',
            userid: 3,
            green_reviews_count: 0,
            category: 'category3',
        },
    ]
}
const makeTestReviews = () => {
    return [
        {
            id:1,
            userid: 1,
            place_id: 1,
            review: 'first review',
            date: '2020-01-22T16:28:32.615Z',
        },
        {
            id:2,
            userid: 1,
            place_id: 2,
            review: 'second review',
            date: '2020-01-22T16:28:32.615Z'
        },
        {
            id:3,
            userid: 1,
            place_id: 3,
            review: 'third review',
            date: '2020-01-22T16:28:32.615Z'
        },
        {
            id:4,
            userid: 2,
            place_id: 2,
            review: 'third review',
           
        }
    ]
}

const makeTestTumbText =()=> {
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
            thumb: 2
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
        }
    ]
}

makeTestData = () => {
    testUsers = makeTestUsers();
    testPlaces = makeTestPlaces();
    testReviews = makeTestReviews();
    testThumbText = makeTestTumbText();
    testThumbChecked = makeTestThumbChecked();
    return { testUsers, testPlaces, testReviews, testThumbText, testThumbChecked};
}

module.exports = {
    makeTestData,
    makeTestUsers,
    makeTestPlaces,
}