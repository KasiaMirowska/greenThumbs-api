DROP TABLE IF EXISTS review;
CREATE TABLE review (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    userId INTEGER REFERENCES users(id) ON DELETE SET NULL,
    review TEXT,
    date TIMESTAMP DEFAULT now() NOT NULL
);