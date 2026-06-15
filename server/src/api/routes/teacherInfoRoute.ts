import { Router } from 'express';
import TeacherInfoController from '../controllers/TeacherInfoController';

const router = Router();
const teacherInfoController = new TeacherInfoController();

router.get('/', (req, res) => teacherInfoController.getAll(req, res));
router.get('/user/:userId', (req, res) => teacherInfoController.getByUser(req, res));
router.post('/', (req, res) => teacherInfoController.save(req, res));
router.post('/:userId', (req, res) => teacherInfoController.save(req, res));
router.put('/:userId', (req, res) => teacherInfoController.save(req, res));

export default router;
