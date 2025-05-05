CREATE TABLE IF NOT EXISTS profile (
  profileId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId) ON DELETE CASCADE,
  phone TEXT,
  birthday DATE,
  gender TEXT,
  address TEXT,
  full_name TEXT,
  image_url TEXT
);