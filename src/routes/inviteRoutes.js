import express from "express"
import { generateTeamInvite , respondToTeamInvite, verifyInvite , getPendingInviteByUserId } from "../controllers/inviteController.js"
import { verifyInviteToken } from "../middleware/invitesMiddleware.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { validate } from "../middleware/validateRequest.js"
import { inviteSchema } from "../validators/invitesValidator.js"

const route = express.Router()
route.use(authMiddleware)
route.post("/" , validate(inviteSchema) , generateTeamInvite)
route.post("/verify" , verifyInviteToken, verifyInvite)
route.get("/pending" , getPendingInviteByUserId)
// route.get("/invite" , getInviteByUserId)
route.put("/:id" , verifyInviteToken, respondToTeamInvite)


export default route