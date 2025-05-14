import express from 'express'
import * as controller from '../../../controllers/';
const router = express.Router();

router.post('/', controller.handleAddNewLinks);
router.get('/', controller.handleGetUserLinks);

export default router;