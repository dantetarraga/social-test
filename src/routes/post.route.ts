import { PostController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'
import { createPostSchema } from '@/schema'
import { Router } from 'express'

const postRouter = Router()
const upload = multer({ dest: "uploads/posts" })

import multer from "multer"

postRouter.post(
  '',
  authenticateToken,
  upload.array("media"),
  // validateSchema(createPostSchema, 'body'),
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

export default postRouter