import { Router } from 'express'

import { AuthController } from '@/controllers'
import { validateSchema } from '@/middleware'

import { Request, Response } from 'express'
import 'dotenv/config'

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  recoveryEmailSchema,
} from '@/schema'

const authRouter = Router()

authRouter.post(
  '/login',
  validateSchema(loginSchema, 'body'),
  AuthController.login
)

authRouter.post(
  '/register',
  validateSchema(registerSchema, 'body'),
  AuthController.register
)

authRouter.post(
  '/notify-reset-password',
  validateSchema(recoveryEmailSchema, 'body'),
  AuthController.notifyResetPassword
)

authRouter.post(
  '/reset-password',
  validateSchema(resetPasswordSchema, 'body'),
  AuthController.resetPassword
)

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY!;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET!;
const REDIRECT_URI = "https://social-test-eqq4.onrender.com/api/auth/tiktok/callback"; // cambia según tu dominio
const csrfState = Math.random().toString(36).substring(2);

console.log("Client Key:", CLIENT_KEY)
// Tik tok
// TikTok login
authRouter.get('/tiktok/login', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/v2/auth/authorize/';

    console.log("CLIENT KEY:", CLIENT_KEY);

    // the following params need to be in `application/x-www-form-urlencoded` format.
    url += `?client_key=${CLIENT_KEY}`;
    url += `&scope=user.info.basic`;
    url += `&response_type=code`;
    url += `&redirect_uri=${REDIRECT_URI}`;
    url += `&state=${csrfState}`;

    console.log("Authorization URL:", url);

    res.redirect(url);

    
})


authRouter.get("/tiktok/callback", (req: Request, res: Response) => {
  const { code } = req.query;
  // Aquí manejarías el intercambio del código por un token de acceso
  res.send("Callback de TikTok");
});

export default authRouter
