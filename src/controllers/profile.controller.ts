import { Request, Response } from 'express'
import { ProfileService } from '@/service'

const profileService = new ProfileService()

class ProfileController {
  static async createProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileData = req.body
        
    const response = await profileService.createProfile(user!.id, profileData)

    return res
      .status(201)
      .json({ success: true , message: 'Profile created successfully', data: response })
  }

  static async listProfiles(req: Request, res: Response): Promise<Response> {
    const user = req.user

    const response = await profileService.listProfiles(user!.id)

    return res
      .status(200)
      .json({ success: true , message: 'Profiles retrieved successfully', data: response })
  }

  static async deleteProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)

    await profileService.deleteProfile(user!.id, profileId)

    return res
      .status(200)
      .json({ success: true , message: 'Profile deleted successfully' })
  }

  static async editProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)
    const profileData = req.body

    const response = await profileService.editProfile(user!.id, profileId, profileData)

    return res
      .status(200)
      .json({ success: true , message: 'Profile updated successfully', data: response })
  }

  static async getProfile(req: Request, res: Response): Promise<Response> {
    const user = req.user
    const profileId = parseInt(req.params.id)

    const response = await profileService.getProfile(user!.id, profileId)

    return res
      .status(200)
      .json({ success: true , message: 'Profile retrieved successfully', data: response })
  }
}

export default ProfileController
