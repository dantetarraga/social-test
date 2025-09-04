import { AppDataSource } from '@/config'
import { CreatePostDTO, MediaItem } from '@/schema'
import { In, Repository } from 'typeorm'
import { Post, Profile, SocialConnection } from '@/models'
import { processFiles } from '@/helpers'
import { json } from 'zod'

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
    data: CreatePostDTO,
    files: Express.Multer.File[]
  ) {
    let { content, scheduledAt, profileId, socialIds } = data

    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['user'],
    })
    if (!profile) throw new Error('Perfil no encontrado')

    const media: MediaItem[] = processFiles(files, userId)

    const socialConnections = await this.connectionRepo.findBy({ id: In(socialIds) })

    const newPost = this.postRepo.create({
      content,
      scheduledAt,
      media,
      profiles: [profile],
      socialConnections,
    })

    return await this.postRepo.save(newPost)
  }

  async getPostsByProfile(profileId: number) {
    return await this.postRepo.find({
      where: { profiles: { id: profileId } },
      relations: ['profiles', 'socialConnections'],
    })
  }

  async updatePost(postId: number, updateData: Partial<Post>) {
    await this.postRepo.update(postId, updateData)
    return await this.postRepo.findOne({
      where: { id: postId },
      relations: ['profiles', 'socialConnections'],
    })
  }

  async deletePost(postId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } })
    if (!post) throw new Error('Post no encontrado')

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
