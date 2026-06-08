import { Router } from 'express';
import DiseasesController from '../controllers/DiseasesController';

const router = Router();
const diseasesController = new DiseasesController();

// GET /api/diseases
router.get('/', (req, res) => diseasesController.getAll(req, res));

export default router;