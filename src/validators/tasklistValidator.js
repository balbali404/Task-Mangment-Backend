import {z} from "zod"

export const taskListValidator = z.object({
    title: z.string().min(3 , "Title must be at least 3 characters long"),
    description: z.string().min(24 , "Description must be at least 24 characters long").optional(),
    completed: z.boolean().optional()
})