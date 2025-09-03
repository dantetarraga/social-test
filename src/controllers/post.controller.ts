import { PostService } from '@/service'
import { Response, Request } from 'express'

const postService = new PostService()

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id

    const { profileId, content, scheduledAt, socialIds } = req.body

    const files = req.files as Express.Multer.File[]

    let parsedSocialIds: number[] = []
    if (typeof socialIds === 'string') {
      parsedSocialIds = JSON.parse(socialIds)
    } else if (Array.isArray(socialIds)) {
      parsedSocialIds = socialIds.map((id: any) => Number(id))
    }

    const post = await postService.createPost(
      Number(userId),
      Number(profileId),
      content,
      scheduledAt,
      files,
      parsedSocialIds
    )

    return res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully',
    })
  }

  static async getPostsByProfile(req: Request, res: Response): Promise<Response> {
    const profileId = req.params.profileId

    const posts = await postService.getPostsByProfile(Number(profileId))

    return res.status(200).json({
      success: true,
      data: posts,
      message: 'Posts retrieved successfully',
    })
  }

  static async updatePost(req: Request, res: Response): Promise<Response> {
    const postId = req.params.postId
    const updateData = req.body

    const updatedPost = await postService.updatePost(Number(postId), updateData)

    return res.status(200).json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully',
    })
  }

  static async deletePost(req: Request, res: Response): Promise<Response> {
    const postId = req.params.postId

    await postService.deletePost(Number(postId))

    return res.status(204).json({
      success: true,
      message: 'Post deleted successfully',
    })
  }
}

export default PostController
