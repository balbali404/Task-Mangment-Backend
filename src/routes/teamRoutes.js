import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {createTeam , getTeam , updateTeam , changeMemeberRole , kickMemeber , leaveTeam} from "../controllers/teamController.js"
import { teamSchema , kickMemberValidator , changeRoleValidator } from "../validators/teamValidator.js"
import { validate } from "../middleware/validateRequest.js"

const route = express.Router()

route.use(authMiddleware)

route.get("/" , getTeam)
route.post("/" , validate(teamSchema) , createTeam)
route.put("/" , validate(teamSchema) , updateTeam)
route.put("/changeRole" , validate(changeRoleValidator) , changeMemeberRole)
route.put("/kickMemeber" , validate(kickMemberValidator) , kickMemeber)
route.put("/leaveTeam" , leaveTeam)
export default route
