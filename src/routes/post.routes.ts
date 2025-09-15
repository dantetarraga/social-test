import { PostController } from '@/controllers'
// import SocialMediaPublisherController from '@/controllers/social-publisher.controller'
import { authenticateToken, uploadArray, validateSchema } from '@/middleware'
import { createPostSchema, updatePostSchema } from '@/schemas'
import { Router } from 'express'

const router = Router()

router.post(
  '',
  authenticateToken,
  uploadArray('media', 5),
  validateSchema(createPostSchema, 'body'),
  PostController.createPost
)

router.put(
  '/:postId',
  authenticateToken,
  uploadArray('media', 5),
  validateSchema(updatePostSchema, 'body'),
  PostController.updatePost
)

router.delete('/:postId', authenticateToken, PostController.deletePost)

router.get('/:postId', authenticateToken, PostController.getPostById)
router.get('', authenticateToken, PostController.getAllPosts)

// router.post(
//   '/publish',
//   authenticateToken,
//   SocialMediaPublisherController.publishPost
// )

export default router
