CREATE TABLE IF NOT EXISTS reports (
    reportId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    businessId UUID REFERENCES business(businessId) ON DELETE CASCADE,
    userId UUID REFERENCES users(userId) ON DELETE SET NULL,
    staffId UUID REFERENCES staff(staffId) ON DELETE SET NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'resolved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
