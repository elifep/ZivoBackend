CREATE TABLE IF NOT EXISTS appointments (
  appointmentId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId) ON DELETE CASCADE,
  businessId UUID REFERENCES business(businessId) ON DELETE CASCADE,
  servicesId UUID REFERENCES services(servicesId) ON DELETE SET NULL,
  staffId UUID REFERENCES staff(staffId) ON DELETE SET NULL,
  appointment_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending'
);