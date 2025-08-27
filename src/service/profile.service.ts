import { Repository } from "typeorm"

import { Profile, User } from "@/models"
import { AppDataSource } from "@/config/database"

import { CreateProfileDTO } from "@/schema"
import Boom from "@hapi/boom"

class ProfileService {
  private profileRepo: Repository<Profile>
  private userRepo: Repository<User>

  constructor() {
    this.profileRepo = AppDataSource.getRepository(Profile)
    this.userRepo = AppDataSource.getRepository(User)
  }

  async createProfile(userId: number, data: CreateProfileDTO): Promise<Profile> {
    const user = await this.userRepo.findOneBy({ id: userId })
    if (!user) throw Boom.notFound('Usuario no encontrado')
      
    const profile = this.profileRepo.create({...data, user })

    const { user: _, ...profileData } = profile
    return await this.profileRepo.save(profileData)
  }

  async editProfile(userId: number, profileId: number, data: Partial<CreateProfileDTO>): Promise<Profile> {
    const profile = await this.profileRepo.findOneBy({ id: profileId, user: { id: userId } })
    if (!profile) throw Boom.notFound('Profile not found')

    this.profileRepo.merge(profile, data)
    return await this.profileRepo.save(profile)
  }

  async deleteProfile(userId: number, profileId: number): Promise<void> {
    const profile = await this.profileRepo.findOneBy({ id: profileId, user: { id: userId } })
    if (!profile) throw Boom.notFound('Profile not found')

    await this.profileRepo.remove(profile)
  }

  async listProfiles(userId: number): Promise<Profile[]> {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['profiles'] })
    if (!user) throw Boom.notFound('User not found')

    return user.profiles
  }

  async getProfile(userId: number, profileId: number): Promise<Profile> {
    const profile = await this.profileRepo.findOneBy({ id: profileId, user: { id: userId } })
    if (!profile) throw Boom.notFound('Profile not found')

    return profile
  }
}

export default ProfileService
