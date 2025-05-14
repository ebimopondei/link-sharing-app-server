import express from 'express'
import { auth } from './auth';
import { UserRouter } from './user';
import { publicRouter } from './public';
import { verifyJwt } from '../middlewares';
// import { adminRouter } from './platforms'
const router = express.Router();

router.use('/auth', auth);
router.use('/public', publicRouter);
router.use('/user', verifyJwt, UserRouter)
// router.use('/admin', verifyJwt, adminRouter)

export const Routing = router;