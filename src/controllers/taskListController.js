import {prisma} from "../config/db.js"

export const createTaskList = async (req , res) =>{
    const {title , description , completed, assignees} = req.body
    const {dueDate} = req.body
    const assigneeConnect = assignees && assignees.length > 0 
    ? assignees.map(id => ({ id })) 
    : [];
    if(req.team && req.user.role === "MEMBER" ){
        return res.status(400).json({message:"Unauthorized"})
    }
    const taskList = await prisma.task.create({
        data:{
            title,
            description,
            completed,
            userId: req.user.id,
            teamId: req.team??null,
            dueDate: dueDate ? new Date(dueDate) : null,
            assignees: {
                connect: assigneeConnect??null
            }
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
    const {title , description , completed , dueDate , assignees} = req.body
     const {id} = req.params
     if(req.team && req.user.role === "MEMBER" ){
        return res.status(400).json({message:"Unauthorized"})
    }
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
    if(dueDate){
        updatedData.dueDate = dueDate
    }
    if(assignees != null){
        updatedData.assignees = {
            connect: assignees.map(id => ({ id }))
        }
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
    if(req.team && req.user.role != "OWNER" ){
        return res.status(400).json({message:"Unauthorized"})
    }
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