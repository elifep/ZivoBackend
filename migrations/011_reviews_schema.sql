CREATE TABLE IF NOT EXISTS reviews (
  reviewsId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  businessId UUID REFERENCES business(businessId) ON DELETE CASCADE,
  userId UUID REFERENCES users(userId) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT
  created_at TIMESTAMP DEFAULT NOW()
  UNIQUE (userId, businessId)
);