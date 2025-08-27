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

// Tik tok
authRouter.get("/tiktok/login", (req: Request, res: Response) => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${csrfState}`; 
  // "state" para evitar CSRF
  res.redirect(authUrl);
});

authRouter.get("/tiktok/callback", (req: Request, res: Response) => {
  const { code } = req.query;
  // Aquí manejarías el intercambio del código por un token de acceso
  res.send("Callback de TikTok");
});

export default authRouter
