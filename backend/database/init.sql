DROP TABLE IF EXISTS showcases;
DROP TABLE IF EXISTS titles;
DROP TABLE IF EXISTS records;
DROP TABLE IF EXISTS maps;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  steam_id TEXT,
  username TEXT NOT NULL,
  avatar_link TEXT NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'XX',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (steam_id)
);

CREATE TABLE maps (
  id SMALLSERIAL,
  map_name TEXT NOT NULL,
  wr_score SMALLINT NOT NULL,
  is_coop BOOLEAN NOT NULL,
  is_disabled BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE records (
  id SERIAL,
  map_id SMALLINT,
  host_id TEXT NOT NULL,
  score_count SMALLINT NOT NULL,
  score_time INTEGER NOT NULL,
  is_coop BOOLEAN NOT NULL DEFAULT false,
  partner_id TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  FOREIGN KEY (map_id) REFERENCES maps(id),
  FOREIGN KEY (host_id) REFERENCES users(steam_id),
  FOREIGN KEY (partner_id) REFERENCES users(steam_id)
);

CREATE TABLE titles (
  user_id TEXT,
  title_name TEXT NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(steam_id)
);

CREATE TABLE showcases (
  record_id INT,
  video_id TEXT NOT NULL,
  PRIMARY KEY (record_id),
  FOREIGN KEY (record_id) REFERENCES records(id)
);