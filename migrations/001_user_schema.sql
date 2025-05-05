CREATE TABLE IF NOT EXISTS users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'business', 'admin')) DEFAULT 'user'
);