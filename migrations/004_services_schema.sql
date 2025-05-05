CREATE TABLE IF NOT EXISTS services (
  servicesId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  businessId UUID REFERENCES business(businessId) ON DELETE CASCADE,
  staffId UUID, -- opsiyonel ilişki
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  duration_min INTEGER
);