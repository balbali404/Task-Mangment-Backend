import { prisma } from "../config/db.js";
import { generateInviteToken } from "../utils/generateInviteToken.js";
const generateTeamInvite = async (req, res) => {
  const { teamId, email } = req.body;
  const owner = await prisma.user.findUnique({
    where: {
      id: req.user.id,
      role : "OWNER",
      teamId
    },
  });
  if(!owner){
    return res.status(401).json({ message: "You are not the owner of this team"})
  }
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const user = email
    ? await prisma.user.findUnique({ where: { email : email } })
    : null;

  const token = generateInviteToken(teamId);
  const data = {
    token,
    status: "PENDING",
    email: email ?? user?.email,
    team: {
      connect: { id: teamId },
    },
  };

  if (user?.id) {
    data.user = {
      connect: { id: user.id },
    };
  }
  const alreadyHaveInvite = await prisma.teamInvite.findFirst({
    where: {
      teamId,
      status : "PENDING",
      email,
      userId : user?.id
    },
  })
  const sevenDaysAgo = new Date(alreadyHaveInvite?.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
  if (alreadyHaveInvite && alreadyHaveInvite.createdAt < sevenDaysAgo) {
    return res.status(400).json({ 
        message: "User already invited" ,
        alreadyHaveInvite
      }
    )
  }
  const teamInvite = await prisma.teamInvite.create({ data });

  const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

  return res.status(200).json({
    message: "Invite link generated successfully",
    data: { teamInvite },
    inviteLink,
    token
  });
};
const verifyInvite = (req, res) => {
  if (!req.invite || !req.inviteToken) {
    return res.status(400).json({ message: "Invalid or missing invite token" })
  }

  res.cookie("TEAM_INVITE_TOKEN", req.inviteToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return res.json({
    userExists: Boolean(req.invite.userId)
  })
}
const respondToTeamInvite = async (req, res) => {
  const { status } = req.query
  const {id} = req.params
  const token = req.inviteToken
  const userId = req.user.id
  if (!token && !id) {
    return res.status(401).json({ message: "No invite token" })
  }

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" })
  }


  const invite = await prisma.teamInvite.findFirst({
    where: { OR : [{token} , {id}] }
  })

  if (!invite || invite.status !== "PENDING") {
    return res.status(400).json({ message: "Invite invalid" })
  }

  if (invite.userId && invite.userId !== userId) {
    return res.status(403).json({ message: "Not your invite" })
  }

  await prisma.teamInvite.update({
    where: { id: invite.id },
    data: { status }
  })

  if (status === "REJECTED") {
    return res.json({ message: "Invite rejected" })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { 
      teamId: invite.teamId,
      role : "MEMBER",
      accountType: "TEAM"
    }
  })
  if(invite.userId === null){
    await prisma.teamInvite.update({
      where: { id: invite.id },
      data: {
        userId : userId
      }
    })
    
  }
  await prisma.team.update({
    where: { id: invite.teamId },
    data: {
      members: { connect: { id: userId } }
    }
  })

  res.clearCookie("TEAM_INVITE_TOKEN")

  return res.json({ message: "Invite accepted" })
}
const getPendingInviteByUserId = async (req, res) => {
  const userId = req.user.id
  const invite = await prisma.teamInvite.findFirst({
    where: {status : "PENDING" , OR : [{userId} , {email : req.user.email}] }
  })
  if(!invite){
    return res.status(404).json({ message: "Invite not found" })
  }
  return res.json(invite)
}
// const getInviteByTeamId = async (req, res) => {
//   const token = req.cookies.TEAM_INVITE_TOKEN
//   const teamId = req.params.id
//   const invite = await prisma.teamInvite.findUnique({
//     where: { teamId },
//     AND : {status : "PENDING"}
//   })
//   if(!invite){
//     return res.status(404).json({ message: "Invite not found" })
//   }
//   return res.json(invite)
// }
export { generateTeamInvite, respondToTeamInvite , verifyInvite ,  getPendingInviteByUserId };
