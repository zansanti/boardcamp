import express from 'express';
import rentalsController from '../controllers/rentalsController.js';

const router = express.Router();

router.post('/rentals', rentalsController.createRental);
router.get('/rentals', rentalsController.getRentals);
router.post('/rentals/:id/return', rentalsController.finishRental);
router.delete('/rentals/:id', rentalsController.deleteRental);

export default router;