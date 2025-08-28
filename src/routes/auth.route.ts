import { Router } from 'express'

import { AuthController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'

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

// TikTok routes
authRouter.get('/tiktok/callback', authenticateToken, AuthController.tiktokCallback)
authRouter.post('/tiktok', AuthController.tiktokLogin)
authRouter.post('/tiktok/generate-url', AuthController.generateUrlToTikTok)

export default authRouter
