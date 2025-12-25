import {z} from "zod"

export const teamSchema = z.object({
    name : z.string().min(3).max(255)
})

export const changeRoleValidator = z.object({
  userId: z.uuid(),
  role: z.enum(["ADMIN", "MEMBER"])
})

export const kickMemberValidator = z.object({
  userId: z.uuid()
})