# Green Thumb 

Check it out at [Green Thumb](https://green-thumbs-up.now.sh/).

A place where you can create a positive impact on local restaurant industry. Search for a place to eat and let us know if that place adheres to enviroment friendly practices. User can search local restaurant through connection to yelp and then create a green review on GREENthumbsUP that will save the restaurant to our database. User can also browse through our database of 'green' and Earth friendly places.

## WHY MAKE THIS APP?

To try create a positive change to a globally overwhelming problem of trash. An avarage American orders takeout at least 3 times a week. That food is packaged for about 30min to an hour in a container that will stay in a landfill for another 500 years. Nothing gets fixed over night and sustainable packaging options are twice as expensive which makes it difficult for restaurant owners to pick that option over already slim profit margins. I believe if there was a platform where sustainable practices are exposed and commented upon, it could create a new 'standard' for all of us to follow when choosing a place to eat. This app is a humble sketch for a dream.

|<img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.00.58+AM+(2).png' width ='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.01.16+AM+(2).png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.01.28+AM+(2).png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.01.34+AM+(2).png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.02.00+AM+(2).png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.02.11+AM+(2).png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.10.15+AM.png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.11.04+AM+(2).png' width='200' > |  <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.11.15+AM.png' width='200' > | <img src='https://green-images.s3.amazonaws.com/green-thumbs-screens/Screen+Shot+2020-03-24+at+11.17.42+AM+(2).png' width='200' > |  

## ENDPOINTS AND EXPECTED DATA
### Yelp Proxy Endpoint
#### /yelp/

  description: a proxy endpoint to Yelp.  This endpoint can be used without loggin into Green Thumb

  method: GET

  input: 

    query: {
      term: string,
      location: string
    }

  output: 

    status: 201,

    body: {

      rating: number,
      price: symbol,
      phone: string,
      id: string,
      alias: string,
      is_closed: boolean,
      categories": [
        {
          alias: string,
          title: string
        }
      ],
      review_count: number,
      name: string,
      url: string,
      coordinates": {
        latitude: number,
        longitude: number
      },
      image_url: string,
      location: {
        city: string,
        country: string,
        address2: string,
        address3: string,
        state: string,
        address1: string,
        zip_code: string 
      },
      distance: number,
      transactions: array of stigs

    },

### User Registration
#### /api/register

  description: registration endpoint

  method: POST

  input: 

    body: {

      fullname: string,
      username: string,
      password: string,
      id: number

    }

  output: 

    status: 201,

    body: {

      fullname: string,
      username: string,
      password: encrypted, 

    }

### Auth Login Endpoint
#### /api/login

  description: user login endpoint
  
  method: POST

  input:

    body: {

      userName: string, 
      password: string

    }

  output:

    body: {

      authToken: jwt (javascript web token)

    }

### places Endpoints
#### /api/

  description: gets all green thumb reviewed places with full info

  method: GET

  output: 
    
    status: 200,

    body: [

      {

        id: number,
        yelp_id: number,
        name: string,
        img: string,
        url: string,
        yelpRating: number,
        location_str: string,
        location_city: string,
        location_zip: string,
        location_st: string,
        display_phone: string,
        green_reviews_count: number,
        review: string,
        reviewDate: Date
        reviewCategory: string,
        checkedThumbs, array of strings

      }

    ]

#### /api/user/

  description: gets green reviewed places by user with full info

  method: GET

  output: 
  
    status: 200,

    body: [

      {

        id: number,
        yelp_id: number,
        name: string,
        img: string,
        url: string,
        yelpRating: number,
        location_str: string,
        location_city: string,
        location_zip: string,
        location_st: string,
        display_phone: string,
        green_reviews_count: number,
        review: string,
        reviewDate: Date
        reviewCategory: string,
        checkedThumbs, array of strings

      }

    ]

#### /api/place/:place_id

  description: gets by id reviewed place with full info

  method: GET

  input: 

    params: place_id: string

  example output:

    {
      id: 1,
      yelp_id: '5dyqBEBuwDgZ23iLQJjl0w',
      name: 'restaurant name',
      img_url: 'image url',
      url: 'website url',
      yelp_rating: 5,
      location_str: 'street address',
      location_city: 'city',
      location_zip: 'zip code',
      location_st: 'state',
      display_phone: 'phone number',
      green_reviews_count: 1,
      userid: 1,
      reviewed_place_id: 1,
      review: 'string',
      checkedThumbs: [
        'Compostable take-out containers and cups',
        'No plastic bottled drinks',
        'Composting food scraps',
        'Papperless, fully computer based billing and record keeping',
        'Locally sourced produce',
        'Organic produce',
        'Saves energy by installing light timers and motion sensors',
        'Saves water by installing low flow faucets',
        'Saves energy and water by installing energy star equipmnet'
      ],
      category: 'Juice-Bar'
    }

### Reviews Endpoints
#### /api/:place_id/review

  description: creates green-reviewed place in db that consists of yelp-place-data recorded into 'place' table and review section recorded into 'review' and 'thumbChecked' tables

  method: POST

  input: 

    params: yelpId: string

    body: {
      
      yelp_id: string, 
      name: string, 
      img_url: string, 
      url: string, 
      yelp_rating: number, 
      location_str: string, 
      location_city: string, 
      location_zip: string, 
      location_st: string, 
      display_phone: string, 
      green_reviews_count: number, 
      category: string, 
      review: string, 
      checkedThumbs: array of strings

    }

  example output:

    {

      savedPlace: {
        id: 23,
        yelp_id: string,
        name: restaurant name,
        img_url: 'image url',
        url: 'website url',
        yelp_rating: 4,
        location_str: 'street address',
        location_city: 'city',
        location_zip: 'zip code',
        location_st: 'state',
        display_phone: 'phone number',
        green_reviews_count: 1,
      },
      savedReview: {
        id: 81,
        userid: 1,
        place_category: 'Lunch',
        review: 'string',
        date: 2020-03-24T00:46:31.534Z,
        place_id: 23
      },
      newSavedThumbs: [ 10, 9, 7, 5, 4 ]

    }

#### /api/edit/:green_place_id

  description: updates a reviewed place

  method: PATCH

  input: 

    params: green_place_id: string

    body: {
      
      category: string, 
      review: string, 
      checkedThumbs: array of strings

    }

  example output:

    status: 201

    body: {
      savedReview: {
        id: 85,
      userid: 1,
      place_category: 'Bakery',
      review: 'string',
      date: 2020-03-24T00:53:10.047Z,
      place_id: 24
      },
      updatedThumbs: [ 3, 4, 11 ]
    }

#### /api/place/delete/:green_place_id

  description: deletes an existing review

  method: DELETE

  input: 

    params: green_place_id: string

  example output:

    status: 204

    message: 'reviewed place deleted'


## TECH STACK
#### FRONT-END
* HTML5
* CSS3
* JavaScript
* React.js front end framework
* font-awesome
* bcrypt

#### BACK-END
* Node.js backend run-time environment
* Express.js backend framework and architecture
* SQL for database
* Postgres - relational database management system
* Yelp API
* JWTs for authentication
* Axios - Promise based HTTP Client

#### TESTING and DEPOLYMENT
* Mocha - back-end testing framework
* Chai - assertion library backend testing
* Enzyme - React.js testing utility
* Zeit - cloud platform for static sites
* Heroku - cloud application platform