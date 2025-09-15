import { Request, Response } from 'express'
import { ProfileService } from '@/services'
import {
  createProfileSchema,
  updateProfileSchema,
  profileIdSchema,
} from '@/schemas/profile.schemas'

const profileService = new ProfileService()

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
    const { profileId } = req.params

    await profileService.deleteProfile(user!.id, Number(profileId))

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    })
  }

  static async editProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user

    const { profileId } = req.params
    const profileData = req.body

    const response = await profileService.editProfile(
      user!.id,
      Number(profileId),
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
    const { profileId } = req.params

    const response = await profileService.getProfileById(user!.id, Number(profileId))

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: response,
    })
  }

  static async getConnectionsByProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const { profileId } = req.params

    const response = await profileService.getConnectionsByProfile(user!.id, Number(profileId))

    return res.status(200).json({
      success: true,
      message: 'Profile connections retrieved successfully',
      data: response,
    })
  }

  static async deleteConnection(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const { profileId, connectionId } = req.params

    await profileService.deleteConnection(
      user!.id,
      Number(profileId),
      Number(connectionId)
    )
    return res.status(200).json({
      success: true,
      message: 'Connection deleted successfully',
    })
  }

  static async getPostsByProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const { profileId } = req.params

    const response = await profileService.getPostsByProfile(user!.id, Number(profileId))

    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: response,
    })
  }
}

export default ProfileController
