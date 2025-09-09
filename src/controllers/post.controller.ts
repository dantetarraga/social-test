import { CreatePostDTO } from '@/schema'
import { PostService } from '@/service'
import { Response, Request } from 'express'

const postService = new PostService()

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id
    let data = req.body
    const files = req.files as Express.Multer.File[]

    data.socialIds = JSON.parse(data.socialIds).map((id: string | number) => Number(id))

    const post = await postService.createPost(
      data as CreatePostDTO,
      files
    )

    return res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully',
    })
  }

  static async getPostById(req: Request, res: Response): Promise<Response> {
    const postId = req.params.postId
    const post = await postService.getPostById(Number(postId))

    return res.status(200).json({
      success: true,
      data: post,
      message: 'Post retrieved successfully',
    })
  }

  static async updatePost(req: Request, res: Response): Promise<Response> {
    const postId = req.params.postId
    let updateData = req.body
    const files = req.files as Express.Multer.File[]

    updateData.socialIds = JSON.parse(updateData.socialIds).map((id: string | number) => Number(id))

    const updatedPost = await postService.updatePost(Number(postId), updateData, files)

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

  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id

    const posts = await postService.getAllPosts(userId)
    return res.status(200).json({
      success: true,
      data: posts,
      message: 'Posts retrieved successfully',
    })
  }
}

export default PostController
