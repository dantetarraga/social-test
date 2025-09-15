import { AppDataSource } from '@/config/database'
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostMedia,
} from '@/schemas/post.schemas'
import { In, Repository } from 'typeorm'
import { Post, Profile, SocialConnection } from '@/models'
import Boom from '@hapi/boom'

class PostService {
  private postRepo: Repository<Post>
  private profileRepo: Repository<Profile>
  private connectionRepo: Repository<SocialConnection>

  constructor() {
    this.postRepo = AppDataSource.getRepository(Post)
    this.profileRepo = AppDataSource.getRepository(Profile)
    this.connectionRepo = AppDataSource.getRepository(SocialConnection)
  }

  async createPost(
    userId: number,
    data: CreatePostSchema,
    files: Express.Multer.File[]
  ): Promise<Post> {
    const { content, scheduledAt, publishNow, platforms } = data

    const profileIds = [...new Set(platforms.map((p: { profileId: number }) => p.profileId))]
    const connectionIds = [...new Set(platforms.map((p: { connectionId: number }) => p.connectionId))]

    const profiles = await this.profileRepo.find({
      where: {
        id: In(profileIds),
        user: { id: userId },
      },
      relations: ['user'],
    })

    if (profiles.length !== profileIds.length) {
      throw Boom.badRequest(
        'Some profiles not found or do not belong to the user'
      )
    }

    const socialConnections = await this.connectionRepo.find({
      where: {
        id: In(connectionIds),
      },
      relations: ['profile'],
    })

    if (socialConnections.length !== connectionIds.length) {
      throw Boom.badRequest('Some social connections not found')
    }

    for (const platform of platforms) {
      const connection = socialConnections.find(
        (c) => c.id === platform.connectionId
      )

      if (!connection) {
        throw Boom.badRequest(`Connection ${platform.connectionId} not found`)
      }

      if (connection.profile.id !== platform.profileId) {
        throw Boom.badRequest(
          `Connection ${platform.connectionId} does not belong to profile ${platform.profileId}`
        )
      }
    }

    const media: PostMedia[] = files.map((file) => ({
      url: `/uploads/posts/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      filename: file.filename,
    }))

    console.log(media)

    const newPost = this.postRepo.create({
      content,
      scheduledAt,
      publishNow,
      media: media.length > 0 ? media : [],
      profiles,
      socialConnections,
    })

    return await this.postRepo.save(newPost)
  }

  async getPostById(userId: number, postId: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
        profiles: { user: { id: userId } },
      },
      relations: ['profiles', 'socialConnections'],
    })

    if (!post) throw Boom.notFound('Post not found')

    return post
  }

  async updatePost(userId: number, postId: number, updateData: UpdatePostSchema, files?: Express.Multer.File[]): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { 
        id: postId,
        profiles: { user: { id: userId } }
      },
      relations: ['profiles', 'socialConnections'], 
    })

    if (!post) {
      throw Boom.notFound('Post not found')
    }

    if (updateData.content !== undefined) {
      post.content = updateData.content
    }
    
    if (updateData.scheduledAt !== undefined) {
      post.scheduledAt = updateData.scheduledAt
    }

    if (updateData.publishNow !== undefined) {
      post.publishNow = updateData.publishNow
    }

    if (updateData.platforms && updateData.platforms.length > 0) {
      const profileIds = [...new Set(updateData.platforms.map(p => p.profileId))]
      const connectionIds = [...new Set(updateData.platforms.map(p => p.connectionId))]

      const profiles = await this.profileRepo.find({
        where: { 
          id: In(profileIds),
          user: { id: userId }
        },
      })

      if (profiles.length !== profileIds.length) {
        throw Boom.badRequest('Some profiles not found or do not belong to the user')
      }

      const socialConnections = await this.connectionRepo.find({
        where: { 
          id: In(connectionIds)
        },
        relations: ['profile'],
      })

      if (socialConnections.length !== connectionIds.length) {
        throw Boom.badRequest('Some social connections not found')
      }

      for (const platform of updateData.platforms) {
        const connection = socialConnections.find(c => c.id === platform.connectionId)
        
        if (connection && connection.profile.id !== platform.profileId) {
          throw Boom.badRequest(
            `Connection ${platform.connectionId} does not belong to profile ${platform.profileId}`
          )
        }
      }

      post.profiles = profiles
      post.socialConnections = socialConnections
    }

    if (files && files.length > 0) {
      const newMedia: PostMedia[] = files.map((file) => ({
        url: `/uploads/posts/${file.filename}`,
        type: file.mimetype.startsWith('image') ? 'image' : 'video',
        filename: file.filename,
      }))

      post.media = newMedia
    }

    return await this.postRepo.save(post)
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
        profiles: { user: { id: userId } },
      },
    })

    if (!post) {
      throw Boom.notFound('Post not found')
    }

    await this.postRepo.remove(post)
  }

  async getAllPosts(userId: number): Promise<Post[]> {
    return await this.postRepo.find({
      where: {
        profiles: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['socialConnections'],
      order: { createdAt: 'DESC' },
    })
  }
}

export default PostService
