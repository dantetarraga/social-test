import { Router } from 'express'

import { ProfileController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'
import {
  connectionParamsSchema,
  createProfileSchema,
  profileIdSchema,
} from '@/schemas'

const profileRouter = Router()

profileRouter.post(
  '',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.createProfile
)

profileRouter.get('', authenticateToken, ProfileController.listProfiles)

profileRouter.get(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.getProfile
)

profileRouter.get(
  '/:profileId/connections',
  authenticateToken,
  validateSchema(connectionParamsSchema, 'params'),
  ProfileController.getConnectionsByProfile
)

profileRouter.get(
  '/:profileId/posts',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.getPostsByProfile
)

profileRouter.delete(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.deleteProfile
)

profileRouter.put(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  validateSchema(createProfileSchema, 'body'),
  ProfileController.editProfile
)

export default profileRouter
