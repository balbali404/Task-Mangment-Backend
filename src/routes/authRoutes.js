import express from "express"
import { register , login , logout } from "../controllers/authController.js"
import { registerSchema , loginSchema } from "../validators/userValidator.js"
import { validate } from "../middleware/validateRequest.js"
import { verifyInviteToken } from "../middleware/invitesMiddleware.js"

const route = express.Router()

route.post("/register" , validate(registerSchema) , verifyInviteToken , register)

route.post("/login" , validate(loginSchema) , login)

route.post("/logout" , logout)

export default route
