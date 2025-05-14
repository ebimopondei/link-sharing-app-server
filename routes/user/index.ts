
import express from 'express';
const router = express.Router();

import LinkRouter from './links'
import ProfileRouter from './profile'
import PlatformRouter from './platforms'


router.use('/profile', ProfileRouter );
router.use('/links', LinkRouter );
router.use('/platforms', PlatformRouter );


export const UserRouter = router;

