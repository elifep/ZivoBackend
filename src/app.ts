// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
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
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:8081', // sadece frontend'e izin ver
  credentials: true, // eğer cookie de taşıyorsan
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes); // Örn: GET http://localhost:5000/users
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});