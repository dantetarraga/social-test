import { PostService, SocialPublisherService } from "@/service";
import { Request, Response } from "express";

const socialPublisherService = new SocialPublisherService()
const postService = new PostService()

class SocialPublisherController {
  static async publishPost(req: Request, res: Response): Promise<Response> {
    const { postId } = req.body

    const post = await postService.getPostById(postId)
    const response = await socialPublisherService.publishPost(post)

    return res
      .status(200)
      .json({ success: true , message: 'Post published successfully' })
  }
}

export default SocialPublisherController;