BEGIN;

INSERT INTO thumbChecked (userId, placeId, reviewId, thumb)
VALUES
(1, 1, 1, 1),
(1, 1, 1, 3),
(1, 1, 1, 4),
(1, 1, 1, 14),
(1, 1, 1, 13),
(1, 1, 1, 12),
(1, 2, 1, 1),
(1, 2, 1, 3),
(1, 2, 1, 9),
(1, 2, 1, 7),
(1, 2, 1, 4),
(1, 2, 1, 13),
(1, 3, 1, 13),
(1, 3, 1, 12),
(1, 3, 1, 11),
(1, 3, 1, 4),
(1, 3, 1, 7);

COMMIT;