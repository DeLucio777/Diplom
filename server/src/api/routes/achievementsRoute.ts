import { Router } from 'express';
import AchievementsController from '../controllers/AchievementsController';

const router = Router();
const achievementsController = new AchievementsController();

// GET /api/achievements
router.get('/', (req, res) => achievementsController.getAll(req, res));

// GET /api/achievements/user/:userId
router.get('/user/:userId', (req, res) => achievementsController.getByUser(req, res));

// POST /api/achievements/award
router.post('/award', (req, res) => achievementsController.award(req, res));

export default router;