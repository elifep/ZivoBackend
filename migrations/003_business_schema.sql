CREATE TABLE IF NOT EXISTS business (
  businessId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  image_url TEXT
);