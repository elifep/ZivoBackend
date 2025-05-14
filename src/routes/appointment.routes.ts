import { Router, RequestHandler } from 'express';
import * as controller from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/user', authenticate(['user']), controller.getUserAppointments as RequestHandler);// Kullanıcı sadece kendi randevularını görebilir
router.get('/business/:businessId', authenticate(['business']), controller.getBusinessAppointments as RequestHandler);// İşletme kendi işletmesine ait randevuları görebilir
router.post('/', authenticate(['user']), controller.createAppointment as RequestHandler);// Sadece kullanıcı randevu oluşturabilir
router.put('/:id/status', authenticate(['user', 'business']), controller.updateStatus as RequestHandler);// Hem user hem business, ancak valid kontrolle güncelleme yapabilsin
router.delete('/:id', authenticate(['user']), controller.deleteAppointment as RequestHandler);// Sadece kullanıcı kendi randevusunu silebilir

export default router;