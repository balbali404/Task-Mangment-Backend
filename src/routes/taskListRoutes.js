import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {createTaskList , getTaskList , getTaskListById , updateTaskList , deleteTaskList} from "../controllers/taskListController.js"
import {taskListValidator} from "../validators/tasklistValidator.js"
import { validate } from "../middleware/validateRequest.js"
const route = express.Router()
route.use(authMiddleware)
route.post("/" , validate(taskListValidator) , createTaskList)

route.get("/"  , getTaskList)

route.get("/:id" , getTaskListById)

route.put("/:id" , validate(taskListValidator) , updateTaskList)

route.delete("/:id" , deleteTaskList)
export default route
