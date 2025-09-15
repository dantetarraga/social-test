import Boom from "@hapi/boom"

import { Repository } from "typeorm"
import { AppDataSource } from "@/config"
import { SocialConnectionData } from "@/types"
import { Profile, SocialConnection } from "@/models"

export abstract class SocialPlatformService {
  protected abstract clientId: string
  protected abstract clientSecret: string
  protected abstract redirectUri: string
  protected abstract authUrl: string
  protected abstract responseType: string
  protected abstract scope: string

  protected connectionRepo: Repository<SocialConnection>
  protected profileRepo: Repository<Profile>

  constructor() {
    this.connectionRepo = AppDataSource.getRepository(SocialConnection)
    this.profileRepo = AppDataSource.getRepository(Profile)
  }

  generateAuthUrl(state: string): string {
    const params = this.buildAuthParams(state)
    return `${this.authUrl}?${params.toString()}`
  }

  protected buildAuthParams(state: string): URLSearchParams {
    return new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
      state,
    })
  }

  async saveConnection(profileId: number, data: SocialConnectionData): Promise<SocialConnection> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['user'],
    })

    if (!profile) {
      throw Boom.notFound('Profile not found')
    }

    const connection = this.connectionRepo.create({
      ...data,
      profile,
    })

    const savedConnection = await this.connectionRepo.save(connection)
    if (!savedConnection) throw Boom.internal('Error saving connection')

    return savedConnection
  }
  
  abstract callback(code: string): Promise<SocialConnectionData>
  abstract uploadVideo(videoPath: string): Promise<any>
  abstract uploadImage(imagePath: string): Promise<any>
}
