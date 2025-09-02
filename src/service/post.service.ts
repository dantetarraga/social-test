import path from "path"
import crypto from "crypto"
import fs from "fs"
import { AppDataSource } from "@/config"
import { MediaItem } from "@/schema"
import { Repository } from "typeorm"
import { Post, Profile, SocialConnection } from "@/models"

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
    profileId: number,
    content: string,
    scheduledAt: Date,
    files: Express.Multer.File[],
    socialIds: number[]
  ) {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ["user"],
    })
    if (!profile) throw new Error("Perfil no encontrado")

    const media: MediaItem[] = files.map((file) => {
      const randomId = crypto.randomBytes(4).toString("hex")
      const ext = path.extname(file.originalname)
      const filename = `${userId}_${randomId}${ext}`

      const destPath = path.join("uploads/posts", filename)
      fs.renameSync(file.path, destPath)

      return {
        url: `/uploads/posts/${filename}`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
        filename,
      }
    })

    const socialConnections = await this.connectionRepo.findByIds(socialIds)

    const newPost = this.postRepo.create({
      content,
      scheduledAt,
      media,
      profiles: [profile],
      socialConnections,
    })

    return await this.postRepo.save(newPost)
  }
}

export default PostService