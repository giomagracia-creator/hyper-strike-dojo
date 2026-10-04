CREATE TABLE IF NOT EXISTS parent_leads (
  id BIGSERIAL PRIMARY KEY,
  parent_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  kid_first_name TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
