BEGIN;


INSERT INTO users (yelpId, name, img_url, url, yelpRating, location_str, location_city, location_zip, location_st, phone, displayPhone, userId, green_reviews_count, reviewId, folderId)
VALUES
('5dyqBEBuwDgZ23iLQJjl0w', 'Eat Well Kitchen', 'https://s3-media4.fl.yelpcdn.com/bphoto/iEFtHRMB-2Elr8tjeK0tZQ/o.jpg', 'https://www.yelp.com/biz/eat-well-kitchen-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4.5, '12 Atlantic Ave', 'Marblehead', '01945', 'MA', '+17816390659', '(781) 639-0659', 1, 1, 1, 1);

COMMIT;