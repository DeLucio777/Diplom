import { Router } from 'express';
import GroupsController from '../controllers/GroupsController';

const router = Router();
const groupsController = new GroupsController();

router.get('/', (req, res) => groupsController.getAllMembers(req, res));
router.post('/', (req, res) => groupsController.addMember(req, res));
router.delete('/:memberId', (req, res) => groupsController.removeMemberById(req, res));

export default router;
