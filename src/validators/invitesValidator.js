import { z } from "zod";

export const inviteSchema = z.object({
    email: z.string().email(),
    teamId: z.string().uuid(),
});
