import { PostService } from '@/service'
import { Response, Request } from 'express'

const postService = new PostService()

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
    const postData = req.body
    const post = await postService.createPost(postData)

    return res.status(201).json({
      success: true,
      data: post,
      message: 'Post creado exitosamente',
    })
  }
}

export default PostController
