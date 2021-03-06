DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friends;

CREATE TABLE users (

  id SERIAL PRIMARY KEY,
  first VARCHAR(300) NOT NULL,
  last VARCHAR(300) NOT NULL,
  email VARCHAR(300) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  imgurl VARCHAR(300),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
