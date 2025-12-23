import express from "express"
import { generateTeamInvite , respondToTeamInvite, verifyInvite , getPendingInviteByUserId } from "../controllers/inviteController.js"
import { verifyInviteToken } from "../middleware/invitesMiddleware.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { validate } from "../middleware/validateRequest.js"
import { inviteSchema } from "../validators/invitesValidator.js"

const route = express.Router()
route.use(authMiddleware)
route.post("/invite" , validate(inviteSchema) , generateTeamInvite)
route.post("/invite/verify" , verifyInviteToken, verifyInvite)
route.get("/invite/pending" , getPendingInviteByUserId)
// route.get("/invite" , getInviteByUserId)
route.put("/invite/:id" , verifyInviteToken, respondToTeamInvite)


export default route