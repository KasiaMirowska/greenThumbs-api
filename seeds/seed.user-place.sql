BEGIN;


INSERT INTO userPlace (userid, reviewed_place_id)
VALUES
(1, 1),
(1, 2),
(1, 3);

COMMIT;

 