import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js"

export const verifyInviteToken = async (req, res, next) => {
    console.log("invite middleware")
    let token
    if(req.body?.token){
        token = req.body.token
    }else if(req.cookies?.TEAM_INVITE_TOKEN){
        token = req.cookies.TEAM_INVITE_TOKEN
    }
    if (!token) {
        return next()
    }
    try {
        jwt.verify(token, process.env.JWT_INVITE_SECRET)

        const invite = await prisma.teamInvite.findUnique({
        where: { token }
        })

        if (!invite || invite.status !== "PENDING") {
        return res.status(400).json({ message: "Invalid invite" })
        }

        req.invite = invite??null 
        req.inviteToken = token??null

        next()
    } catch {
        return res.status(400).json({ message: "Invite expired" })
    }
}
