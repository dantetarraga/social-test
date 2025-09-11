import { Request, Response } from 'express'
import { ProfileService } from '@/service'
import SocialConnectionService from '@/service/social-connection.service'

const profileService = new ProfileService()
const socialConnectionService = new SocialConnectionService()

class ProfileController {
  static async createProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileData = req.body

    const response = await profileService.createProfile(user!.id, profileData)

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: response,
    })
  }

  static async listProfiles(req: Request, res: Response): Promise<Response> {
    const user = req.user

    const response = await profileService.listProfiles(user!.id)

    return res.status(200).json({
      success: true,
      message: 'Profiles retrieved successfully',
      data: response,
    })
  }

  static async deleteProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)

    await profileService.deleteProfile(user!.id, profileId)

    return res
      .status(200)
      .json({ success: true, message: 'Profile deleted successfully' })
  }

  static async editProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)
    const profileData = req.body

    const response = await profileService.editProfile(
      user!.id,
      profileId,
      profileData
    )

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: response,
    })
  }

  static async getProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)

    const response = await profileService.getProfileById(user!.id, profileId)

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: response,
    })
  }

  static async getProfileConnections(
    req: Request,
    res: Response
  ): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)

    const response = await profileService.getProfileConnections(
      user!.id,
      profileId
    )

    return res.status(200).json({
      success: true,
      message: 'Profile connections retrieved successfully',
      data: response,
    })
  }

  static async disconnect(req: Request, res: Response): Promise<Response> {
    const { profileId, connectionId } = req.params

    await profileService.disconnect(Number(profileId), Number(connectionId))

    return res.status(200).json({
      success: true,
      message: 'Connection removed successfully',
    })
  }

  static async getPostsByProfile(
    req: Request,
    res: Response
  ): Promise<Response> {
    const profileId = parseInt(req.params.id)

    const response = await profileService.getPostsByProfile(profileId)
    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: response,
    })
  }
}

export default ProfileController
