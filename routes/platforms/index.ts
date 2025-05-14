
import express from 'express';
const router = express.Router();

import PlatformRouter from './links';

router.use('/platforms', PlatformRouter );

export const adminRouter = router;

