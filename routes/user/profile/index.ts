import express from 'express'
import * as controller from '../../../controllers';
import { upload } from '../../../helpers';
const router = express.Router();

router.get('/',  controller.handleGetUserProfile);
router.post('/', upload.single('avatar'), controller.handleUpdateUserProfile);

export default router;