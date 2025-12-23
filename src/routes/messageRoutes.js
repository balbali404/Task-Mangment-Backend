import express from "express"
import { getTeamMessages } from "../controllers/messageController.js"

const router = express.Router()

router.get("/:teamId", getTeamMessages)

export default router