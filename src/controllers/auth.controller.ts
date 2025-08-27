import { AuthService } from '@/service'
import { Request, Response } from 'express'

const authService = new AuthService()

class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    const credentials = req.body
    const result = await authService.login(credentials)

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Inicio de sesión exitoso',
    })
  }

  static async register(req: Request, res: Response): Promise<Response> {
    const userData = req.body
    const result = await authService.register(userData)

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Usuario registrado exitosamente',
    })
  }

  static async notifyResetPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    await authService.notifyResetPassword(email)

    return res.status(200).json({
      success: true,
      message: 'Correo de recuperación enviado',
    })
  }

  static async resetPassword(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body
    
    await authService.resetPassword({ token, password })

    return res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
    })
  }
}

export default AuthController
