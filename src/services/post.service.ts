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

  async createPost(userId: number, data: CreatePostSchema, files?: Express.Multer.File[]): Promise<Omit<Post, 'profile'>> {
    const { content, scheduledDate, scheduledTime, profileId, socialIds } = data

    const profile = await this.profileRepo.findOne({
      where: { id: profileId, user: { id: userId } },
      relations: ['user'],
    })
    
    if (!profile) throw Boom.notFound('Profile not found')
    
    const socialConnections = await this.connectionRepo.find({
      where: { 
        id: In(socialIds),
        profile: { id: profileId }
      },
    })

    if (socialConnections.length !== socialIds.length) {
      throw Boom.badRequest('Some social connections not found')
    }

    const media: PostMedia[] = files ? files.map((file) => ({
      url: `/uploads/posts/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      filename: file.filename,
    })) : []

    const newPost = this.postRepo.create({
      content,
      scheduledDate, 
      scheduledTime,
      media: media.length > 0 ? media : [],
      profile,
      socialConnections,
    })

    const savedPost = await this.postRepo.save(newPost)

    const { profile: _, ...postData } = await this.postRepo.save(newPost)

    return postData
  }

  async getPostByProfile(userId: number, postId: number): Promise<Omit<Post, 'profile'>> {
    const post = await this.postRepo.findOne({
      where: { 
        id: postId,
        profile: { user: { id: userId } }
      },
      relations: ['profile', 'socialConnections'],
    })
    
    if (!post) throw Boom.notFound('Post not found')
    
    return post
  }

  async updatePost(userId: number, postId: number, updateData: UpdatePostSchema, files?: Express.Multer.File[]): Promise<Post> {
    // Buscar el post y verificar ownership
    const post = await this.postRepo.findOne({
      where: { 
        id: postId,
        profile: { user: { id: userId } }
      },
      relations: ['profile', 'socialConnections'], 
    })

    if (!post) {
      throw Boom.notFound('Post not found')
    }

    // Actualizar campos básicos
    if (updateData.content !== undefined) {
      post.content = updateData.content
    }
    
    if (updateData.scheduledDate !== undefined) {
      post.scheduledDate = updateData.scheduledDate
    }

    if (updateData.scheduledTime !== undefined) {
      post.scheduledTime = updateData.scheduledTime
    }

    // Actualizar conexiones sociales si se proporcionan
    if (updateData.socialIds && updateData.socialIds.length > 0) {
      const socialConnections = await this.connectionRepo.find({
        where: { 
          id: In(updateData.socialIds),
          profile: { id: post.profile.id }
        },
      })

      if (socialConnections.length !== updateData.socialIds.length) {
        throw Boom.badRequest('Some social connections not found')
      }

      post.socialConnections = socialConnections
    }

    // Actualizar media si se proporcionan nuevos archivos
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
        profile: { user: { id: userId } }
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
        profile: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['profile', 'socialConnections'],
      order: { createdAt: 'DESC' }
    })
  }
}

export default PostService
