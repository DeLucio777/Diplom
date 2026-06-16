import { Router } from 'express';
import AchievementsController from '../controllers/AchievementsController';

const router = Router();
const achievementsController = new AchievementsController();

// GET/POST /api/achievements
router.get('/', (req, res) => achievementsController.getAll(req, res));
router.post('/', (req, res) => achievementsController.create(req, res));

// PUT /api/achievements/:id
router.put('/:id', (req, res) => achievementsController.update(req, res));

// GET /api/achievements/user/:userId
router.get('/user/:userId', (req, res) => achievementsController.getByUser(req, res));

// POST /api/achievements/award
router.post('/award', (req, res) => achievementsController.award(req, res));

export default router;