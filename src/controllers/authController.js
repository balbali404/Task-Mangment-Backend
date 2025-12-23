import {prisma} from '../config/db.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js'


const register = async (req, res) => {
  const { email, name, password, TeamName } = req.body
  let {accountType} = req.body

  const userExist = await prisma.user.findUnique({ where: { email } })
  if (userExist) {
    return res.status(400).json({ message: "User Already existed" })
  }
  let teamInvite = req.invite??null
  console.log("invite",teamInvite)
  if(req.inviteToken){
    accountType = "TEAM"
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: accountType === "TEAM" ? (teamInvite ? "MEMBER" : "OWNER") : "NONE",
      accountType : teamInvite ? "TEAM" : accountType === "TEAM" ? "TEAM" : "INDIVIDUAL"
    }
  })

  let team

  if (!teamInvite && accountType === "TEAM") {
    team = await prisma.team.create({
      data: {
        name: TeamName,
        owner: user.id,
        members: { connect: [{ id: user.id }] }
      }
    })
  }

  if (teamInvite && teamInvite.email === email) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        teamId: teamInvite?.teamId ?? null
      }
    })
   
    await prisma.teamInvite.update({
      where: { id: teamInvite.id },
      data: {
        userId: user.id,
        status: "ACCEPTED"
      }
    })
    team = await prisma.team.findUnique({ where: { id: teamInvite.teamId } })
  }
   
  const token = generateToken(user.id, res)

  return res.status(200).clearCookie("TEAM_INVITE_TOKEN").json({
    message: "User registered successfully",
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      TeamName: TeamName ? team.name : (teamInvite && team) ? "you have joined " + team.name : null
    },
    token
  })
}
const login = async (req ,res) => {
    const {email , password} = req.body
    const user = await prisma.user.findUnique({where : {email}})
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }
    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }
    const token = generateToken(user.id , res)
    return res.status(200).json({
        message:"User logged in successfully",
        data:{
            id: user.id,
            email: user.email,
            name: user.name  
        },
        token
    })
}

const logout = (req, res) => {
  // Clear the cookie set for JWT
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  res.status(200).json({ status: "success", message: "Logged out" })
}

export { register , login , logout }