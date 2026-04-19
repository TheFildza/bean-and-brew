CREATE TABLE IF NOT EXISTS events (
  id         SERIAL PRIMARY KEY,
  name       TEXT    NOT NULL,
  properties JSONB,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_name_created_at ON events (name, created_at);
