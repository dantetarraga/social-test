import { Repository } from 'typeorm'
import Boom from '@hapi/boom'

import { Profile, SocialConnection } from '@/models'
import { AppDataSource } from '@/config/database'
import { SocialConnectionData } from '@/types/social.types'

class SocialConnectionService {
  private connectionRepo: Repository<SocialConnection>
  private profileRepo: Repository<Profile>

  constructor() {
    this.connectionRepo = AppDataSource.getRepository(SocialConnection)
    this.profileRepo = AppDataSource.getRepository(Profile)
  }

  async saveConnection(profileId: number, data: SocialConnectionData): Promise<SocialConnection> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['user'],
    })

    if (!profile) throw Boom.notFound('Profile not found')
    const connection = this.connectionRepo.create({
      ...data,
      profile,
    })

    const savedConnection = await this.connectionRepo.save(connection)
    if (!savedConnection) throw Boom.internal('Error saving connection')

    return savedConnection
  }
}

export default SocialConnectionService
