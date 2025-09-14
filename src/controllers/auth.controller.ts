import { Request, Response } from 'express'
import { AuthService } from '@/services'

const authService = new AuthService()

class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    const credentials = req.body
    const result = await authService.login(credentials)

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    })
  }

  static async register(req: Request, res: Response): Promise<Response> {
    const userData = req.body
    const result = await authService.register(userData)

    return res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    })
  }

  static async notifyResetPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    await authService.notifyResetPassword(email)

    return res.status(200).json({
      success: true,
      message: 'Recovery email sent',
    })
  }

  static async resetPassword(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body
    await authService.resetPassword({ password, token })

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  }
}

export default AuthController
