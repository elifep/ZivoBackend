CREATE TABLE IF NOT EXISTS social_media (
  socialMediaId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  businessId UUID REFERENCES business(businessId) ON DELETE CASCADE,
  username TEXT NOT NULL
);
