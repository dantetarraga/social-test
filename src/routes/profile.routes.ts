import { Router } from 'express'

import { createProfileSchema } from '@/schemas'
import { ProfileController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'

const profileRouter = Router()

profileRouter.post(
  '',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.createProfile
)

profileRouter.get(
  '',
  authenticateToken,
  ProfileController.listProfiles
)

profileRouter.get(
  '/:id',
  authenticateToken,
  ProfileController.getProfile
)

profileRouter.delete(
  '/:id',
  authenticateToken,
  ProfileController.deleteProfile
)

profileRouter.put(
  '/:id',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.editProfile
)

profileRouter.get(
  '/:id/connections',
  authenticateToken,
  ProfileController.getConnectionsByProfile
)

profileRouter.get(
  '/:id/posts',
  authenticateToken,
  ProfileController.getPostsByProfile
  
)

export default profileRouter
