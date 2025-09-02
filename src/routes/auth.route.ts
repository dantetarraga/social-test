import { Router } from 'express'

import { AuthController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  recoveryEmailSchema,
  connectionSchema,
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
  '/notify',
  validateSchema(recoveryEmailSchema, 'body'),
  AuthController.notifyResetPassword
)

authRouter.post(
  '/reset-password',
  validateSchema(resetPasswordSchema, 'body'),
  AuthController.resetPassword
)

authRouter.post(
  '/',
  authenticateToken,
  validateSchema(connectionSchema, 'body'),
  AuthController.generateAuthUrl
)

// Callbacks
authRouter.get('/tiktok/callback', AuthController.tiktokCallback)
authRouter.get('/facebook/callback', AuthController.facebookCallback)
authRouter.get('/instagram/callback', AuthController.instagramCallback)
authRouter.get('/youtube/callback', AuthController.youtubeCallback)

export default authRouter
