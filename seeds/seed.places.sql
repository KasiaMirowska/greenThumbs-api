BEGIN;


INSERT INTO place (yelp_id, name, img_url, url, yelp_rating, location_str, location_city, location_zip, location_st, display_phone)
VALUES
('5dyqBEBuwDgZ23iLQJjl0w', 'Eat Well Kitchen', 'https://s3-media4.fl.yelpcdn.com/bphoto/iEFtHRMB-2Elr8tjeK0tZQ/o.jpg', 'https://www.yelp.com/biz/eat-well-kitchen-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4.5, '12 Atlantic Ave', 'Marblehead', '01945', 'MA', '(781) 639-0659'),
('xy3laeNm75Qa8N2JQs0Ygg', 'Soall Bistro', 'https://s3-media1.fl.yelpcdn.com/bphoto/FGdqTi3XOieNQY8Bv3EmXQ/o.jpg', 'https://www.yelp.com/biz/soall-bistro-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4, '10 Bessom St', 'Marblehead', '01945', 'MA', '(781) 990-1233'), 
('WE_QKZU28cA15zs_b_nI7A', 'Shubies Marketplace', 'https://s3-media4.fl.yelpcdn.com/bphoto/W0d0ccIqWqc0SEnsnZ4WIw/o.jpg', 'https://www.yelp.com/biz/shubies-marketplace-marblehead?adjust_creative=4zRCWCHOt-UGoQnBF19KTg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=4zRCWCHOt-UGoQnBF19KTg', 4.5, '16 Atlantic Ave', 'Marblehead', '01945', 'MA', '(781) 631-0149');

COMMIT;