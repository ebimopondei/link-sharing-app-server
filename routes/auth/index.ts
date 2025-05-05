import express, { Request, Response } from 'express'
import { loginController, signupController } from '../../controllers/auth.controller';
const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);

export const auth = router;