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

// Callback to TIKTOK, FACEBOOK, INSTAGRAM, YOUTUBE
authRouter.get('/:platform/callback', AuthController.socialCallback)

export default authRouter
