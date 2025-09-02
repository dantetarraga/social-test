import { PostService } from '@/service'
import { Response, Request } from 'express'

const postService = new PostService()

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
  const userId = req.user!.id;

  const { profileId, content, scheduledAt, socialIds } = req.body;

  const files = req.files as Express.Multer.File[];

  let parsedSocialIds: number[] = [];
  if (typeof socialIds === "string") {
    parsedSocialIds = JSON.parse(socialIds);
  } else if (Array.isArray(socialIds)) {
    parsedSocialIds = socialIds.map((id: any) => Number(id));
  }

  const post = await postService.createPost(
    Number(userId),
    Number(profileId),
    content,
    scheduledAt,
    files,              
    parsedSocialIds
  );

  return res.status(201).json({
    success: true,
    data: post,
    message: "Post creado exitosamente",
  });
}
}

export default PostController
