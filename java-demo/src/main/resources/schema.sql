DROP TABLE IF EXISTS fruit CASCADE;

CREATE TABLE fruit (
     id INT NOT NULL,
     description VARCHAR(255),
     name VARCHAR(255),
     score CHAR(1) NOT NULL,
     version INT,
     PRIMARY KEY (id)
);