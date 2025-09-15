// import { PostService, SocialMediaPublisherService,  } from "@/services";
// import { Request, Response } from "express";

// const socialMediaPublisherService = new SocialMediaPublisherService()
// const postService = new PostService()

// class SocialMediaPublisherController {
//   static async publishPost(req: Request, res: Response): Promise<Response> {
//     const { postId } = req.body

//     const post = await postService.getPostById(postId)
//     const response = await socialMediaPublisherService.publishPost(post)

//     return res
//       .status(200)
//       .json({ success: true , message: 'Post published successfully' })
//   }
// }

// export default SocialMediaPublisherController;