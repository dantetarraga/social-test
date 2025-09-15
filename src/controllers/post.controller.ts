import { PostService } from '@/services'
import { PostQueryParams } from '@/types/post.types'
import { Response, Request } from 'express'

const postService = new PostService()

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id
    const files = req.files as Express.Multer.File[]

    const postData = req.body

    const post = await postService.createPost(userId, postData, files)

    return res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully',
    })
  }

  static async getPostById(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id
    const postId = Number(req.params.postId)

    const post = await postService.getPostById(userId, postId)

    return res.status(200).json({
      success: true,
      data: post,
      message: 'Post retrieved successfully',
    })
  }

  static async updatePost(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id
    const postId = Number(req.params.postId)
    const files = req.files as Express.Multer.File[]

    const validatedData = req.body

    const updatedPost = await postService.updatePost(
      userId,
      postId,
      validatedData,
      files
    )

    return res.status(200).json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully',
    })
  }

  static async deletePost(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id
    const postId = Number(req.params.postId)

    await postService.deletePost(userId, postId)

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  }

  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id

    const queryParams: PostQueryParams = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      status: req.query.status as
        | 'SCHEDULED'
        | 'PUBLISHED'
        | 'FAILED'
        | undefined,
      sortBy: req.query.sortBy as 'createdAt' | 'scheduledAt' | undefined,
      sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
    }

    const { data, pagination } = await postService.getAllPosts(
      userId,
      queryParams
    )

    return res.status(200).json({
      success: true,
      data,
      pagination,
      message: 'Posts retrieved successfully',
    })
  }
}

export default PostController
