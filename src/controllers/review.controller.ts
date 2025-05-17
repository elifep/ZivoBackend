import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
};

export const getReview = async (req: Request, res: Response): Promise<void> => {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
    }
    res.json(review);
};
export const getReviewsByBusinessId = async (req: Request, res: Response): Promise<void> => {
    const businessId = req.params.businessId;
    const reviews = await reviewService.getReviewsByBusinessId(businessId);
    res.json(reviews);
};
export const getReviewsByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const reviews = await reviewService.getReviewsByUserId(userId);
    res.json(reviews);
};
export const getAverageRatingByBusinessId = async (req: Request, res: Response): Promise<void> => {
    const businessId = req.params.businessId;
    const result = await reviewService.getAverageRatingAndTotalByBusinessId(businessId);

    res.json({
        businessId,
        averageRating: result.average,
        totalReviews: result.total
    });
};
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
    const { businessId, rating, comment } = req.body;
    const userId = req.user?.userId;
    const alreadyReviewed = await reviewService.hasUserReviewedBusiness(userId, businessId);
    if (alreadyReviewed) {
        res.status(400).json({ message: 'This user has already submitted a review for this business.' });
        return;
    }
    try {
        const review = await reviewService.createReview(businessId, userId, rating, comment);
        res.status(201).json(review);
    } catch (err: any) {
        if (err.code === '23505') { // duplicate key
            res.status(400).json({ message: 'This user has already submitted a review for this business.' });
        } else {
            res.status(500).json({ message: 'An error occurred while submitting the review.' });
        }
    }

};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    // Yorumu bul
    const existing = await reviewService.getReviewById(reviewId);

    if (!existing) {
        res.status(404).json({ message: 'Review not found' });
        return;
    }
    if (!existing.userId) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    // Sadece yorum sahibi güncelleyebilir
    if (existing.userId !== req.user?.userId) {
        res.status(403).json({ message: 'You can only update your own review' });
        return;
    }

    // Güncelle
    const updated = await reviewService.updateReview(reviewId, rating, comment);
    res.json(updated);
}

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    const reviewId = req.params.id;

    const existing = await reviewService.getReviewById(reviewId);
    if (!existing) {
        res.status(404).json({ message: 'Review not found' });
        return;
    }
    // Sadece yorum sahibi veya admin silebilir
    const isOwner = existing.userId === req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    console.log('Token userId:', req.user?.userId);
    console.log('Review userId:', existing.userId);

    if (!isOwner && !isAdmin) {
        res.status(403).json({ message: 'You can only delete your own review' });
        return;
    }

    await reviewService.deleteReview(reviewId);
    res.status(204).send();
};