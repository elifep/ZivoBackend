import { Request, Response } from 'express';
import * as reportService from '../services/reports.service';

export const getReports = async (_req: Request, res: Response): Promise<void> => {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getReportById = async (req: Request, res: Response): Promise<void> => {
    try {
        const report = await reportService.getReportById(req.params.id);
        if (!report) {
            res.status(404).json({ error: 'Report not found' });
            return;
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getReportsByBusinessId = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await reportService.getReportsByBusinessId(req.params.businessId);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const report = await reportService.createReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateReportStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const report = await reportService.updateReportStatus(req.params.id, req.body.status);
        if (!report) {
            res.status(404).json({ error: 'Report not found' });
            return;
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
        await reportService.deleteReport(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
