CREATE TABLE IF NOT EXISTS working_hours (
  workhourId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  businessId UUID NOT NULL REFERENCES business(businessId) ON DELETE CASCADE,
  weekday TEXT NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  UNIQUE (businessId, weekday) -- her gün için 1 kayıt olsun
);