import z from 'zod'

export const createProfileSchema = z.object({
  name: z.string('The name field is required').min(2).max(100),
  description: z.string('The description field is required').min(2).max(100),
  color: z.string().optional()
})

export const updateProfileSchema = createProfileSchema.partial()