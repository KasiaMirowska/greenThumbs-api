BEGIN;


INSERT INTO place (yelpId, name, img_url, url, yelpRating, location_str, location_city, location_zip, location_st, phone, displayPhone, userId, green_reviews_count, folderId)
VALUES
('5dyqBEBuwDgZ23iLQJjl0w', 'Eat Well Kitchen', 'https://s3-media4.fl.yelpcdn.com/bphoto/iEFtHRMB-2Elr8tjeK0tZQ/o.jpg', 'https://www.yelp.com/biz/eat-well-kitchen-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4.5, '12 Atlantic Ave', 'Marblehead', '01945', 'MA', '+17816390659', '(781) 639-0659', 1, 1, 1),
('xy3laeNm75Qa8N2JQs0Ygg', 'Soall Bistro', 'https://s3-media1.fl.yelpcdn.com/bphoto/FGdqTi3XOieNQY8Bv3EmXQ/o.jpg', 'https://www.yelp.com/biz/soall-bistro-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4, '10 Bessom St', 'Marblehead', '01945', 'MA', '+17819901233', '(781) 990-1233', 1,1,1), 
('WE_QKZU28cA15zs_b_nI7A', 'Shubies Marketplace', 'https://s3-media4.fl.yelpcdn.com/bphoto/W0d0ccIqWqc0SEnsnZ4WIw/o.jpg', 'https://www.yelp.com/biz/shubies-marketplace-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4.5, '16 Atlantic Ave', 'Marblehead', '01945', 'MA', '+17816310149', '(781) 631-0149', 1,1,1);

COMMIT;