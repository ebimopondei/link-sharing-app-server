import express from 'express';
import * as controller from '../../controllers/index';
const router = express.Router();

router.get('/users/:username', controller.handleGetUserPublicProfile);

export const publicRouter = router;