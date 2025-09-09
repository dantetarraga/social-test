import { AppDataSource } from '@/config'
import { CreatePostDTO, MediaItem, UpdatePostDTO } from '@/schema'
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

  async getPostById(postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['profiles', 'socialConnections', 'media'],
    })
    if (!post) throw Boom.notFound('Post no encontrado')
    return post
  }

  async createPost(data: CreatePostDTO, files: Express.Multer.File[]) {
    const { content, scheduledAt, profileId, socialIds } = data

    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['user'],
    })
    if (!profile) throw Boom.notFound('Perfil no encontrado')

    const media: MediaItem[] = files.map((file) => ({
      url: `/uploads/poststest/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      filename: file.filename,
    }))

    const socialConnections = await this.connectionRepo.findBy({
      id: In(socialIds),
    })

    const newPost = this.postRepo.create({
      content,
      scheduledAt,
      media,
      profiles: [profile],
      socialConnections,
    })

    return await this.postRepo.save(newPost)
  }

  async updatePost(
    postId: number,
    updateData: UpdatePostDTO,
    files: Express.Multer.File[]
  ) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['profiles', 'socialConnections'], 
    })

    if (!post) throw Boom.notFound('Post not found')

    if (updateData.content) post.content = updateData.content
    if (updateData.scheduledAt) post.scheduledAt = updateData.scheduledAt

    if (updateData.socialIds && updateData.socialIds.length > 0) {
      const socialConnections = await this.connectionRepo.findBy({
        id: In(updateData.socialIds),
      })
      post.socialConnections = socialConnections
    }

    if (files && files.length > 0) {
      const newMedia: MediaItem[] = files.map((file) => ({
        url: `/uploads/posts/${file.filename}`,
        type: file.mimetype.startsWith('image') ? 'image' : 'video',
        filename: file.filename,
      }))

      post.media = newMedia
    }

    return await this.postRepo.save(post)
  }

  async deletePost(postId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } })
    if (!post) throw Boom.notFound('Post not found')

    await this.postRepo.remove(post)
    return post
  }

  async getAllPosts(userId: number) {
    return await this.postRepo.find({
      where: {
        profiles: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['profiles', 'profiles.user', 'socialConnections'],
    })
  }
}

export default PostService
