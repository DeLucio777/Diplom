import { Router } from 'express';
import ChildInfoController from '../controllers/ChildInfoController';

const router = Router();
const childInfoController = new ChildInfoController();

router.get('/', (req, res) => childInfoController.getAll(req, res));
router.get('/user/:userId', (req, res) => childInfoController.getByUser(req, res));
router.get('/:id', (req, res) => childInfoController.getById(req, res));
router.post('/', (req, res) => childInfoController.save(req, res));
router.post('/:userId', (req, res) => childInfoController.save(req, res));
router.put('/:userId', (req, res) => childInfoController.save(req, res));

export default router;
