import { Router } from 'express';
import UserAchievementsController from '../controllers/UserAchievementsController';

const router = Router();
const userAchievementsController = new UserAchievementsController();

router.get('/', (req, res) => userAchievementsController.getAll(req, res));
router.get('/user/:userId', (req, res) => userAchievementsController.getByUser(req, res));
router.post('/', (req, res) => userAchievementsController.award(req, res));
router.post('/award', (req, res) => userAchievementsController.award(req, res));

export default router;
