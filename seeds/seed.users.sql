BEGIN;


INSERT INTO users (fullname, username, password, city, state)
VALUES
('demo', 'demo', '$2a$10$gJckvAdlrmonFm3RlRLxke20LX0C2kfilhUDfpLFTq1ucq3aWD9Pe', Marblehead, MA);

COMMIT;