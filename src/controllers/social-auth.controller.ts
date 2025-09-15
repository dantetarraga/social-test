import { Request, Response } from 'express'
import { SocialServiceFactory } from '@/factories'
import { SocialType } from '@/types'

class SocialAuthController {
  static async generateAuthUrl(req: Request, res: Response): Promise<Response> {
    const { profileId, platform } = req.body

    const socialAuthService = SocialServiceFactory.createService(platform as SocialType)
    
    const state = `${Math.random().toString(36).substring(2)}-${profileId}`
    const authUrl = socialAuthService.generateAuthUrl(state)

    return res.status(200).json({
      success: true,
      data: { authUrl, platform },
      message: `${platform} auth URL generated successfully`,
    })
  }

  static async handleCallback(req: Request, res: Response): Promise<Response> {
    const { platform } = req.params
    const { code, state } = req.query
    const profileId = Number((state as string).split('-')[1])

    const socialAuthService = SocialServiceFactory.createService(platform as SocialType)
    const connectionData = await socialAuthService.callback(code as string)

    const savedConnection = await socialAuthService.saveConnection(profileId, connectionData)

    return res.status(200).json({
      success: true,
      data: savedConnection,
      message: `${platform} connected successfully`,
    })
  }

  static async uploadMedia(req: Request, res: Response): Promise<Response> {
    const { platform } = req.params
    const { mediaPath, mediaType } = req.body

    const socialService = SocialServiceFactory.createService(platform as SocialType)
    
    let result
    if (mediaType === 'video') {
      result = await socialService.uploadVideo?.(mediaPath)
    } else {
      result = await socialService.uploadImage?.(mediaPath)
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: `Media uploaded to ${platform} successfully`,
    })
  }
}

export default SocialAuthController