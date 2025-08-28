import { AuthService } from '@/service'
import SocialConnectionService from '@/service/social-connection.service'
import { Request, Response } from 'express'
import { success } from 'zod'

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

  static async generateUrlToTikTok(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { profileId } = req.body

    let csrfState = Math.random().toString(36).substring(2)
    csrfState += `-${profileId}`

    const redirectUrl = authService.getTikTokAuthUrl(csrfState)

    return res.status(200).json({
      success: true,
      data: redirectUrl,
      message: 'Redirect URL generated successfully',
    })
  }

  static async tiktokLogin(req: Request, res: Response): Promise<void> {
    const { profileId } = req.body
    const { id } = req.user!

    let csrfState = Math.random().toString(36).substring(2)
    csrfState += `-${profileId}`
    csrfState += `-${id}`

    res.cookie('csrfState', csrfState, { maxAge: 60000 })

    const redirectUrl = authService.getTikTokAuthUrl(csrfState)
    return res.redirect(redirectUrl)
  }

  static async tiktokCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.tiktokCallback(code as string)

    await socialConnectionService.saveConnectionToTikTok(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: response,
      message: 'TikTok login successful',
    })
  }

  static async generateUrlToFacebook(req: Request, res: Response): Promise<Response> {
    const { profileId } = req.body

    let csrfState = Math.random().toString(36).substring(2)
    csrfState += `-${profileId}`

    const redirectUrl = authService.getFacebookAuthUrl(csrfState)

    console.log(redirectUrl)

    return res.status(200).json({
      success: true,
      data: redirectUrl,
      message: 'Redirect URL generated successfully',
    })
  }

  static async facebookCallback(req: Request, res: Response): Promise<Response> {
    const { code, state } = req.query as { code: string; state: string }
    const profileId = state.split('-')[1]

    const response = await authService.facebookCallback(code as string)

    await socialConnectionService.saveConnectionToFacebook(
      Number(profileId),
      response
    )

    return res.status(200).json({
      success: true,
      data: response,
      message: 'Facebook login successful',
    })
  }
}

export default AuthController
