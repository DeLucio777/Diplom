import { Router } from 'express';
import GroupsController from '../controllers/GroupsController';

const router = Router();
const groupsController = new GroupsController();

// GET /api/groups
router.get('/', (req, res) => groupsController.getAll(req, res));

// GET /api/groups/educator/:educatorId
router.get('/educator/:educatorId', (req, res) => groupsController.getByEducator(req, res));

// GET /api/groups/:groupId/members
router.get('/:groupId/members', (req, res) => groupsController.getMembers(req, res));

// POST /api/groups
router.post('/', (req, res) => groupsController.create(req, res));
router.put('/:id', (req, res) => groupsController.update(req, res));


// DELETE /api/groups/:id
router.delete('/:id', (req, res) => groupsController.delete(req, res));

// POST /api/groups/:groupId/members
router.post('/:groupId/members', (req, res) => groupsController.addMember(req, res));

// DELETE /api/groups/:groupId/members/:userId
router.delete('/:groupId/members/:userId', (req, res) => groupsController.removeMember(req, res));

export default router;