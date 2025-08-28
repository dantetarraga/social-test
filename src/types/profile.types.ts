import z from "zod";
import { createProfileSchema, updateProfileSchema } from "@/schema";

export type CreateProfileDTO = z.infer<typeof createProfileSchema>
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>