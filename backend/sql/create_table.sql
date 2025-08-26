CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  cuisine VARCHAR(255),
  title VARCHAR(500),
  rating REAL,
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  description TEXT,
  nutrients JSONB,
  serves VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes (rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_recipes_title_lower ON recipes ((lower(title)));
