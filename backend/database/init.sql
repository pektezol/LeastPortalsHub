CREATE TABLE users (
  steam_id TEXT,
  username TEXT NOT NULL,
  avatar_link TEXT NOT NULL,
  country_code CHAR(2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (steam_id)
);

CREATE TABLE games (
  id SMALLSERIAL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE chapters (
  id SMALLSERIAL,
  game_id SMALLINT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE categories (
  id SMALLSERIAL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE maps (
  id SMALLSERIAL,
  game_id SMALLINT NOT NULL,
  chapter_id SMALLINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  showcase TEXT NOT NULL,
  is_disabled BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id),
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

CREATE TABLE map_history (
  id SMALLSERIAL,
  map_id SMALLINT NOT NULL,
  user_id TEXT,
  user_name TEXT NOT NULL,
  score_count SMALLINT NOT NULL,
  record_date TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (map_id) REFERENCES maps(id),
  FOREIGN KEY (user_id) REFERENCES users(steam_id)
);

CREATE TABLE map_rating (
  id SERIAL,
  map_id SMALLINT NOT NULL,
  user_id TEXT NOT NULL,
  rating SMALLINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (map_id) REFERENCES maps(id),
  FOREIGN KEY (user_id) REFERENCES users(steam_id)
);

CREATE TABLE demos (
  id UUID,
  location_id TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE records_sp (
  id SERIAL,
  map_id SMALLINT NOT NULL,
  user_id TEXT NOT NULL,
  score_count SMALLINT NOT NULL,
  score_time INTEGER NOT NULL,
  demo_id UUID NOT NULL,
  record_date TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (map_id) REFERENCES maps(id),
  FOREIGN KEY (user_id) REFERENCES users(steam_id),
  FOREIGN KEY (demo_id) REFERENCES demos(id)
);

CREATE TABLE records_mp (
  id SERIAL,
  map_id SMALLINT NOT NULL,
  host_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  score_count SMALLINT NOT NULL,
  score_time INTEGER NOT NULL,
  host_demo_id UUID NOT NULL,
  partner_demo_id UUID NOT NULL,
  record_date TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (map_id) REFERENCES maps(id),
  FOREIGN KEY (host_id) REFERENCES users(steam_id),
  FOREIGN KEY (partner_id) REFERENCES users(steam_id),
  FOREIGN KEY (host_demo_id) REFERENCES demos(id),
  FOREIGN KEY (partner_demo_id) REFERENCES demos(id)
);

CREATE TABLE titles (
  user_id TEXT,
  title_name TEXT NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(steam_id)
);

CREATE TABLE countries (
  country_code CHAR(2),
  country_name TEXT NOT NULL,
  PRIMARY KEY (country_code)
);
