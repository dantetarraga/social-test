import { SocialType } from '@/types'
import { Request, Response } from 'express'
import { AuthService, SocialConnectionService } from '@/service'

const authService = new AuthService()
const socialConnectionService = new SocialConnectionService()

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

  static async notifyResetPassword(
    req: Request,
    res: Response
  ): Promise<Response> {
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

  static async generateAuthUrl(req: Request, res: Response): Promise<Response> {
    const { profileId, platform } = req.body

    let csrfState = Math.random().toString(36).substring(2)
    csrfState += `-${profileId}`

    const redirectUrl = authService.generateAuthUrl(platform, csrfState)

    return res.status(200).json({
      success: true,
      data: {
        redirectUrl,
        platform
      },
      message: 'Redirect URL generated successfully',
    })
  }

  static async tiktokCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.tiktokCallback(code as string)

    const savedConnection = await socialConnectionService.saveConnectionToTikTok(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: savedConnection,
      message: 'TikTok login successful',
    })
  }

  static async facebookCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.facebookCallback(code as string)

    const savedConnection = await socialConnectionService.saveConnectionToFacebook(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: savedConnection,
      message: 'Facebook login successful',
    })
  }

  static async instagramCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.instagramCallback(code as string)

    const savedConnection = await socialConnectionService.saveConnectionToInstagram(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: savedConnection,
      message: 'Instagram login successful',
    })
  }

  static async youtubeCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.youtubeCallback(code as string)

    const savedConnection = await socialConnectionService.saveConnectionToYouTube(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: savedConnection,
      message: 'YouTube login successful',
    })
  }
}

export default AuthController
