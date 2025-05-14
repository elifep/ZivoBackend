import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';
import servicesRoutes from './routes/services.routes';
import socialMediaRoutes from './routes/socialMedia.routes';
import reportRoutes from './routes/reports.routes';
import reviewRoutes from './routes/review.routes';
import favouriteRoutes from './routes/favourite.routes';
import staffRoutes from './routes/staff.routes';
import workingHourRoutes from './routes/workingHour.routes';
import appointmentRoutes from './routes/appointment.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',            // Web development
      'https://zivoapp.com',              // Production web
      'https://admin.zivoapp.com',        // (Varsa admin panel)
    ];

    if (!origin) {
      // Mobil APK'lerden, Postman'den veya bazı cihazlardan gelen isteklerde origin yoktur → izin ver
      console.log('⚠️ Origin undefined (mobil uygulama olabilir), izin verildi.');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ Reddedilen origin:', origin);
    return callback(new Error('CORS hatası: Bu origin yetkili değil.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON middleware
app.use(express.json());

// Tüm router'ları bağla
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/businesses', businessRoutes);
app.use('/services', servicesRoutes);
app.use('/social_media', socialMediaRoutes);
app.use('/reports', reportRoutes);
app.use('/reviews', reviewRoutes);
app.use('/favourites', favouriteRoutes);
app.use('/staff', staffRoutes);
app.use('/working_hours', workingHourRoutes);
app.use('/appointments', appointmentRoutes);

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
