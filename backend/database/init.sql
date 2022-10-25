DROP TABLE IF EXISTS users;
CREATE TABLE users (
  steam_id BIGINT,
  username VARCHAR(128) NOT NULL,
  avatar_link VARCHAR(128) NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'X',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  user_type SMALLINT NOT NULL,
  PRIMARY KEY (steam_id)
);