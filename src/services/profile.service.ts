import { Repository } from "typeorm"
import Boom from "@hapi/boom"

import { Profile, SocialConnection, User, Post } from "@/models"
import { AppDataSource } from "@/config/database"
import { CreateProfileSchema, UpdateProfileSchema } from "@/schemas/profile.schemas"

class ProfileService {
  private profileRepo: Repository<Profile>
  private userRepo: Repository<User>
  private socialConnectionRepo: Repository<SocialConnection>
  private postRepo: Repository<Post>

  constructor() {
    this.userRepo             = AppDataSource.getRepository(User)
    this.postRepo             = AppDataSource.getRepository(Post)
    this.profileRepo          = AppDataSource.getRepository(Profile)
    this.socialConnectionRepo = AppDataSource.getRepository(SocialConnection)
  }

  async createProfile(userId: number, data: CreateProfileSchema): Promise<Omit<Profile, 'user'>> {
    const user = await this.userRepo.findOneBy({ id: userId })
    if (!user) throw Boom.notFound('User not found')
    
    const profile = this.profileRepo.create({ ...data, user })
    const savedProfile = await this.profileRepo.save(profile)

    const { user: _, ...profileData } = savedProfile
    return profileData
  }

  async editProfile(userId: number, profileId: number, data: UpdateProfileSchema): Promise<Omit<Profile, 'user'>> {
    const profile = await this.profileRepo.findOne({ 
      where: { id: profileId, user: { id: userId } }
    })
    
    if (!profile) {
      throw Boom.notFound('Profile not found')
    }

    this.profileRepo.merge(profile, data)
    const updatedProfile = await this.profileRepo.save(profile)

    const { user: _, ...profileData } = updatedProfile
    return profileData
  }

  async deleteProfile(userId: number, profileId: number): Promise<void> {
    const profile = await this.profileRepo.findOne({ 
      where: { id: profileId, user: { id: userId } }
    })

    if (!profile) throw Boom.notFound('Profile not found')

    await this.profileRepo.remove(profile)
  }

  async listProfiles(userId: number): Promise<Profile[]> {
    const profiles = await this.profileRepo.find({ 
      where: { user: { id: userId } },
      relations: ['connections'],
      order: { createdAt: 'DESC' }
    })

    return profiles
  }

  async getProfileById(userId: number, profileId: number): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId, user: { id: userId } },
      relations: ['connections']
    })

    if (!profile) throw Boom.notFound('Profile not found')

    return profile
  }

  async getConnectionsByProfile(userId: number, profileId: number): Promise<SocialConnection[]> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId, user: { id: userId } }
    })

    if (!profile) throw Boom.notFound('Profile not found')

    const connections = await this.socialConnectionRepo.find({
      where: { profile: { id: profileId } },
      relations: ['profile'],
      order: { createdAt: 'DESC' }
    })
    
    return connections
  }

  async getPostsByProfile(userId: number, profileId: number): Promise<Post[]> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId, user: { id: userId } }
    })

    if (!profile) throw Boom.notFound('Profile not found')

    const posts = await this.postRepo.find({
      where: {
        profiles: {
          id: profileId, 
        },
      },
      relations: ['socialConnections'], 
      order: { createdAt: 'DESC' },
    })

    return posts
  }
}

export default ProfileService
