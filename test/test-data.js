

makeTestUsers= () => {
    return [
        {
            id: 1,
            fullName: 'full name1',
            username: 'username1',
            password: '!@123Abc',
        },
        {
            id: 2,
            fullName: 'full name2',
            username: 'username2',
            password: '!@123Abc',
        },
        {
            id: 3,
            fullName: 'full name3',
            username: 'username3',
            password: '!@123Abc',
        }
    ]
}

const makeTestPlaces = () => {
    return [
        {
            id: 1,
            yelpId: 'aB1c',
            name: 'first place',
            img: 'image1',
            url: 'yelpUrl',
            yelpRating: 4.5,
            location_str: '1 street',
            location_city: 'cityFirst',
            location_zip: '012345',
            location_st: 'MA',
            phone: '+1234567888',
            displayPhone: '(123) 345 5678',
            userId: 'user1',
            green_reviews_count: 2,
            folderId: 1,
        },
        {
            id: 2,
            yelpId: 'aB2c',
            name: 'second place',
            img: 'image2',
            url: 'yelpUrl',
            yelpRating: 5,
            location_str: '2 street',
            location_city: 'citySecond',
            location_zip: '012345',
            location_st: 'MA',
            phone: '+1234567888',
            displayPhone: '(123) 345 5678',
            userId: 'user2',
            green_reviews_count: 1,
            folderId: 1,
        },
        {
            id: 3,
            yelpId: 'aB1c',
            name: 'first place',
            img: 'image3',
            url: 'yelpUrl',
            yelpRating: 4,
            location_str: '3 street',
            location_city: 'cityThird',
            location_zip: '012345',
            location_st: 'MA',
            phone: '+1234567888',
            displayPhone: '(123) 345 5678',
            userId: 'user3',
            green_reviews_count: 0,
            folderId: 3
        },
    ]
}
const makeTestReviews = () => {
    return [
        {
            id:1,
            userId: 1,
            placeId: 1,
            review: 'first review',
            date: new Date(),
        },
        {
            id:2,
            userId: 1,
            placeId: 1,
            review: 'second review',
            date: new Date(),
        },
        {
            id:2,
            userId: 1,
            placeId: 3,
            review: 'third review',
            date: new Date(),
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
            userId: 1,
            placeId: 1,
            reviewId: 1,
            thumb: 1
        },
        {
            id: 2,
            userId: 1,
            placeId: 1,
            reviewId: 1,
            thumb: 2
        },
        {
            id: 3,
            userId: 1,
            placeId: 3,
            reviewId: 2,
            thumb: 3
        },
        {
            id: 4,
            userId: 1,
            placeId: 3,
            reviewId: 2,
            thumb: 4
        }
    ]
}

makeTestData = () => {
    testUsers = makeTestUsers();
    testPlaces = makeTestPlaces();
    testReviews = makeTestReviews();
    testThumbText = makeTestTumbText();
    testThumbChecked = makeTestThumbChecked()
    return {testPlaces, testUsers, testReviews, testThumbText, testThumbChecked}
}

module.exports = {
    makeTestData,
    makeTestUsers,
    makeTestPlaces,
}