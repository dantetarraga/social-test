import { SocialServiceFactory } from '@/factories/social.factory'
import { SocialType } from '@/types'
import { Request, Response } from 'express'

class SocialController {
  static async generateAuthUrl(req: Request, res: Response): Promise<Response> {
    const { platform } = req.params 
    const { profileId } = req.body

    const socialService = SocialServiceFactory.createService(platform as SocialType)
    
    const state = `${Math.random().toString(36).substring(2)}-${profileId}`
    const authUrl = socialService.generateAuthUrl(state)

    return res.status(200).json({
      success: true,
      data: { authUrl, platform },
      message: `${platform} auth URL generated successfully`,
    })
  }

  static async handleCallback(req: Request, res: Response): Promise<Response> {
    const { platform } = req.params
    const { code } = req.query

    const socialService = SocialServiceFactory.createService(platform as SocialType)
    const connectionData = await socialService.callback(code as string)

    return res.status(200).json({
      success: true,
      data: connectionData,
      message: `${platform} authentication successful`,
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

export default SocialController