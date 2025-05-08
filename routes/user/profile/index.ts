import express from 'express'
import { handleGetUserProfile, handleUpdateUserProfile } from '../../../controllers/user/profile.controller';
import { upload } from '../../../helpers';
const router = express.Router();

router.get('/',  handleGetUserProfile);
router.post('/', upload.single('avatar'), handleUpdateUserProfile);

export default router;