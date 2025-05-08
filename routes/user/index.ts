
import express from 'express';
const router = express.Router();

import LinkRouter from './links'
import ProfileRouter from './profile'


router.use('/profile', ProfileRouter );
router.use('/links', LinkRouter );


export const UserRouter = router;

