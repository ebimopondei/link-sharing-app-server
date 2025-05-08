import express from 'express'
import { auth } from './auth';
import { UserRouter } from './user';
import { verifyJwt } from '../middlewares';
const router = express.Router();

router.use('/auth', auth);
router.use('/user', verifyJwt, UserRouter)

export const Routing = router;