DROP TABLE IF EXISTS folder; 
CREATE TABLE folder (
   id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
   name TEXT NOT NULL
);


ALTER TABLE place ADD COLUMN folderId INTEGER REFERENCES folder(id) ON DELETE SET NULL;