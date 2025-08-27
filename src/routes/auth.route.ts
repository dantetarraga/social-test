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

const CLIENT_KEY = process.env.TIKTOK_CLIENT_ID!;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/auth/tiktok/callback"; // cambia según tu dominio

// Tik tok
authRouter.get("/tiktok/login", (req: Request, res: Response) => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=xyz123`; // "state" para evitar CSRF
  res.redirect(authUrl);
});
export default authRouter
