import {prisma} from "../config/db.js"

export const createTaskList = async (req , res) =>{
    const {title , description , completed} = req.body
    const taskList = await prisma.task.create({
        data:{
            title,
            description,
            completed,
            userId: req.user.id,
            teamId: req.team
        }
    })
    return res.status(201).json({
        message:"Task List created successfully",
        data: taskList
    })

}

export const getTaskList = async (req , res) =>{
    const tasklist = await prisma.task.findMany({
        where: {
        OR: [
            {
                userId: req.user.id,
                teamId: req.team
            },
            {
                teamId: req.team
            },
            {
                userId: req.user.id
            }
            ]
        }
    })
    return res.status(200).json({
        message:"Task List fetched successfully",
        data: tasklist
    })
}
export const getTaskListById = async(req , res) =>{
    const {id} = req.params
    const tasklist = await prisma.task.findUnique({
        where:{
            id
        }
    })
    return res.status(200).json({
        message:"Task List fetched successfully",
        data: tasklist
    })
}
export const updateTaskList = async (req ,res) =>{
    const {title , description , completed} = req.body
     const {id} = req.params
     const tasklist = await prisma.task.findUnique({
        where:{
            id
        }
    })

    if(!tasklist){
        return res.status(404).json({
            message:"Task List not found"
        })
    }
    if(tasklist.createdBy !== req.user.id){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const updatedData = {}
    if(title){
        updatedData.title = title
    }
    if(description){
        updatedData.description = description
    }
    if(completed){
        updatedData.completed = completed
    }
    const updateTaskList = await prisma.task.update({
        where:{
            id
        },
        data: updatedData
    })
    return res.status(200).json({
        message:"Task List updated successfully",
        data: updateTaskList
    })
}

export const deleteTaskList = async(req , res) =>{
    const {id} = req.params
    const taskList = await prisma.task.findUnique({
        where :{
            id
        }
    })
    if(!taskList){
        return res.status(404).json({
            message:"Task List not found"
        })
    }
    if(taskList.createdBy !== req.user.id){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const deleteTaskList = await prisma.task.delete({
        where :{
            id
        }
    })
    return res.status(200).json({
        message:"Task List deleted successfully",
        data: deleteTaskList
    })
}