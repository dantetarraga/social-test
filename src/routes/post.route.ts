import { PostController, SocialPublisherController } from '@/controllers'
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
  uploadArray('media', 10),
  PostController.updatePost
)

postRouter.delete(
  '/:postId',
  authenticateToken,
  PostController.deletePost
)

postRouter.get(
  '/:postId',
  authenticateToken,
  PostController.getPostById
)

postRouter.get('', authenticateToken, PostController.getAllPosts)

postRouter.post(
  '/publish',
  authenticateToken,
  SocialPublisherController.publishPost
)

export default postRouter