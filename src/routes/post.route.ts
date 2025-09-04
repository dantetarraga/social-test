import { PostController } from '@/controllers'
import { authenticateToken, uploadArray, validateSchema } from '@/middleware'
import { createPostSchema } from '@/schema'
import { Router } from 'express'

const postRouter = Router()

postRouter.post(
  '',
  authenticateToken,
  uploadArray('media', 10),
  PostController.createPost
)

postRouter.put(
  '/:postId',
  authenticateToken,
  PostController.updatePost
)

postRouter.delete(
  '/:postId',
  authenticateToken,
  PostController.deletePost
)

postRouter.get(
  '/:profileId',
  authenticateToken,
  PostController.getPostsByProfile
)

postRouter.get('', authenticateToken, PostController.getAllPosts)

export default postRouter