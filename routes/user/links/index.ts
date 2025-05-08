import express from 'express'
import { handleAddNewLinks, handleGetUserLinks } from '../../../controllers/user/user.links.controller';
const router = express.Router();

router.post('/', handleAddNewLinks);
router.get('/', handleGetUserLinks);

export default router;