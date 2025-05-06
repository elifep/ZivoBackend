-- İLK HALİ

-- CREATE TABLE IF NOT EXISTS business (
--   businessId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   userId UUID REFERENCES users(userId) ON DELETE CASCADE,
--   name TEXT NOT NULL,
--   description TEXT,
--   address TEXT,
--   city TEXT,
--   image_url TEXT
-- );

CREATE TABLE IF NOT EXISTS business (
  businessId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId) ON DELETE CASCADE,
  businessName TEXT NOT NULL,
  name TEXT NOT NULL,
  businessPhone TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  town TEXT,
  adressLine1 TEXT,
  adressLine2 TEXT,
  image_url TEXT
);