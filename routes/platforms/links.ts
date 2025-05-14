import express from 'express'
import * as controller from '../../controllers';
const router = express.Router();

router.post('/', controller.handleAddNewPlatform);
router.get('/', controller.handleGetAllPlatforms);

export default router;