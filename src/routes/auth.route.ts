import { Router } from 'express'

import { AuthController } from '@/controllers'
import { validateSchema } from '@/middleware'

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

authRouter.get('/tiktok/:id', AuthController.tiktokLogin)

authRouter.get('/tiktok/callback', AuthController.tiktokCallback)

export default authRouter
