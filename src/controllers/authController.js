import {prisma} from '../config/db.js'
import bcrypt from 'bcryptjs'
import { generateAccessToken , generateRefreshToken } from '../utils/generateToken.js'
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { email, name, password} = req.body
  let {accountType ,TeamName} = req.body
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
    res.clearCookie("TEAM_INVITE_TOKEN")
  }
   
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id, res);
  
  return res.status(200).json({
    message: "User registered successfully",
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      TeamName: TeamName ? team.name : (teamInvite && team) ? "you have joined " + team.name : null
    },
    accessToken
  })
}
const login = async (req ,res) => {
    const {email , password} = req.body
    const user = await prisma.user.findUnique({where : {email}})
    if(user.verifed === false){
      return res.status(400).json({
            message:"Please Verify Your Account"
      })
    }
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
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, res);
    return res.status(200).json({
        message:"User logged in successfully",
        data:{
            id: user.id,
            email: user.email,
            name: user.name  
        },
        accessToken
    })
}
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    console.log("refresh token",token)
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(401).json({ message: "User not found" });

      const accessToken = generateAccessToken(user.id);

      return res.json({ accessToken });
    } catch (err) {
      console.log("JWT verify error:", err.message);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  };
const logout = (req, res) => {
  // Clear the cookie set for JWT
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })

  res.status(200).json({ status: "success", message: "Logged out" })
}

export { register , login , logout ,refreshToken }