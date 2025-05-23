import express from 'express';
import gamesController from '../controllers/gamesController.js';

const router = express.Router();

router.get('/games', gamesController.getGames);
router.get('/games/:id', gamesController.getGameById);
router.post('/games', gamesController.createGame);

export default router;