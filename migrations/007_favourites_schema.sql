CREATE TABLE IF NOT EXISTS favourites (
  favouriteId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  businessId UUID NOT NULL REFERENCES business(businessId) ON DELETE CASCADE,
  UNIQUE (userId, businessId) -- aynı kullanıcı aynı işletmeyi iki kez favorileyemesin
);
