CREATE TABLE IF NOT EXISTS staff (
  staffId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  businessId UUID NOT NULL REFERENCES business(businessId) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT
);