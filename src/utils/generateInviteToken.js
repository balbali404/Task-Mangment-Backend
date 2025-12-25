import jwt from "jsonwebtoken"

export const generateInviteToken = (teamId) => {
  const payload = {
    teamId,
    type: "TEAM_INVITE"
  }

  return jwt.sign(
    payload,
    process.env.JWT_INVITE_SECRET,
    { expiresIn: process.env.INVITE_EXPIRES_IN || "7d" }
  )
}