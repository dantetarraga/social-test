import { Router } from 'express'
import { AuthController } from '@/controllers'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/forgot-password', AuthController.notifyResetPassword)
router.post('/reset-password', AuthController.resetPassword)

export default router