import express, { Request, Response } from 'express';
import * as controller from '../../controllers/index';
const router = express.Router();

router.post('/login', controller.loginController);
router.post('/signup', controller.signupController);

export const auth = router;