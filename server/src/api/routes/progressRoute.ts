import { Router } from 'express';
import ProgressController from '../controllers/ProgressController';

const router = Router();
const progressController = new ProgressController();

router.get('/', (req, res) => progressController.getAll(req, res));

export default router;
