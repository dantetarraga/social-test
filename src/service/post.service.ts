import { AppDataSource } from '@/config/database'
import { Post, Profile } from '@/models'
import { CreatePostDTO } from '@/schema/post.schema'
import Boom from '@hapi/boom'
import { Repository } from 'typeorm'

class PostService {
  private postRepo: Repository<Post>
  private profileRepo: Repository<Profile>

  constructor() {
    this.postRepo = AppDataSource.getRepository(Post)
    this.profileRepo = AppDataSource.getRepository(Profile)
  }

  async createPost(data: CreatePostDTO) {
    const profiles = await this.profileRepo.findByIds(data.profiles)
    
    if (!profiles || profiles.length === 0) {
      throw Boom.notFound('Perfiles no encontrados')
    }

    const post = this.postRepo.create({
      ...data,
      profiles
    })

    const savedPost = await this.postRepo.save(post)
    if (!savedPost) throw Boom.badImplementation('Ocurrio un error al crear el post')
      
    return savedPost
  }
}

export default PostService
