import express from 'express';
import * as reportController from '../controllers/reports.controller';

const router = express.Router();

router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.get('/business/:businessId', reportController.getReportsByBusinessId);
router.post('/', reportController.createReport);
router.put('/:id/status', reportController.updateReportStatus);
router.delete('/:id', reportController.deleteReport);

export default router;
