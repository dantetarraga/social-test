import { AppDataSource } from '@/config/database'
import { CreatePostSchema, UpdatePostSchema, PostMedia } from '@/schemas/post.schemas'
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

  async createPost(userId: number, data: CreatePostSchema, files?: Express.Multer.File[]): Promise<Post> {
    const { content, scheduledDate, scheduledTime, profileIds, socialIds } = data

    // Verificar que todos los perfiles pertenecen al usuario
    const profiles = await this.profileRepo.find({
      where: { 
        id: In(profileIds), 
        user: { id: userId } 
      },
      relations: ['user'],
    })
    
    if (profiles.length !== profileIds.length) {
      throw Boom.badRequest('Some profiles not found or do not belong to the user')
    }

    // Verificar que las conexiones sociales existen y pertenecen a alguno de los perfiles
    const socialConnections = await this.connectionRepo.find({
      where: { 
        id: In(socialIds),
        profile: { id: In(profileIds) }
      },
    })

    if (socialConnections.length !== socialIds.length) {
      throw Boom.badRequest('Some social connections not found or do not belong to the selected profiles')
    }

    // Procesar archivos multimedia
    const media: PostMedia[] = files ? files.map((file) => ({
      url: `/uploads/posts/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      filename: file.filename,
    })) : []

    const newPost = this.postRepo.create({
      content,
      scheduledDate,
      scheduledTime,
      media: media.length > 0 ? media : undefined,
      profiles, 
      socialConnections,
    })

    return await this.postRepo.save(newPost)
  }

  async getPostById(userId: number, postId: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { 
        id: postId,
        profiles: { user: { id: userId } } 
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
    
    if (updateData.scheduledDate !== undefined) {
      post.scheduledDate = updateData.scheduledDate
    }

    if (updateData.scheduledTime !== undefined) {
      post.scheduledTime = updateData.scheduledTime
    }

    if (updateData.profileIds && updateData.profileIds.length > 0) {
      const profiles = await this.profileRepo.find({
        where: { 
          id: In(updateData.profileIds),
          user: { id: userId }
        },
      })

      if (profiles.length !== updateData.profileIds.length) {
        throw Boom.badRequest('Some profiles not found or do not belong to the user')
      }

      post.profiles = profiles
    }

    if (updateData.socialIds && updateData.socialIds.length > 0) {
      const currentProfileIds = post.profiles.map(p => p.id)
      
      const socialConnections = await this.connectionRepo.find({
        where: { 
          id: In(updateData.socialIds),
          profile: { id: In(currentProfileIds) }
        },
      })

      if (socialConnections.length !== updateData.socialIds.length) {
        throw Boom.badRequest('Some social connections not found or do not belong to the selected profiles')
      }

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
        profiles: { user: { id: userId } }
      }
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
      relations: ['profiles', 'socialConnections'],
      order: { createdAt: 'DESC' }
    })
  }
}

export default PostService
