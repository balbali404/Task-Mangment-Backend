import { prisma } from "../config/db.js";

const getTeam = async (req, res) => {
  const user = req.user;
  const team = await prisma.team.findFirst({
    where: {
      OR: [
        {
          owner: user.id,
        },
        {
          members: {
            some: {
              id: user.id,
            },
          },
        },
      ],
    },
    include: {
      members: true,
    },
  });
  if (!team) {
    return res.status(400).json({
      message: "Team not found",
    });
  }
  return res.status(200).json({
    message: "Team fetched successfully",
    data: team,
  });
};

const createTeam = async (req, res) => {
  const { name } = req.body;
  const user = req.user;
  const userAlready = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (userAlready.teamId) {
    return res.status(400).json({
      message: "User already in a team",
    });
  }
  const team = await prisma.team.create({
    data: {
      name,
      owner: user.id,
    },
  });
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      teamId: team.id,
      role: "OWNER",
      accountType: "TEAM",
    },
  });
  return res.status(200).json({
    message: "Team created successfully",
    data: team,
  });
};

const updateTeam = async (req, res) => {
    const user = req.user
    const {name} = req.body
    if(user.role !== "OWNER" && user.role !== "ADMIN"){
        return res.status(400).json({
            message : "You Don t have the permission to chnage anything"
        })
    }
    const team = await prisma.team.update({
        where : {
            id : user.teamId
        },
        data : {
            name
        }
    })
    if(!team){
        return res.status(400).json({
            message : "Team not found"
        })
    }
    return res.status(200).json({
        message : "Team updated successfully",
        data : team
    })
};
const changeMemeberRole = async (req ,res) =>{
    const user = req.user
    if(user.role !== "OWNER"){
        return res.status(400).json({
            message : "You Don t have the permission to chnage anything"
        })
    }
    const {userId , role} = req.body
    const userInTeam = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })
    if(!userInTeam){
        return res.status(400).json({
            message : "User not found"
        })
    }
    if(userInTeam.teamId !== user.teamId){
        return res.status(400).json({
            message : "User not found"
        })
    }
    const changeMemeberRole = await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            role
        }
    })
    
    return res.status(200).json({
        message : "User role updated successfully",
        data : changeMemeberRole
    })
}
const kickMemeber = async (req , res) =>{
    const user = req.user
    if(user.role !== "OWNER"){
        return res.status(400).json({
            message : "You Don t have the permission to chnage anything"
        })
    }
    const {userId} = req.body
    const kickMemeber = await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            teamId : null,
            role : "NONE",
            accountType:"INDIVIDUAL"
        }
    })
    if(!kickMemeber){
        return res.status(400).json({
            message : "User not found"
        })
    }
    return res.status(200).json({
        message : "User kicked successfully",
        data : kickMemeber
    })
}
const leaveTeam = async (req , res) =>{
    const user = req.user
    const leaveTeam = await prisma.user.update({
        where : {
            id : user.id
        },
        data : {
            teamId : null,
            role : "NONE",
            accountType:"INDIVIDUAL"
        }
    })
    if(!leaveTeam){
        return res.status(400).json({
            message : "User not found"
        })
    }
    return res.status(200).json({
        message : "User left the team successfully",
        data : leaveTeam
    })
}
export { getTeam, createTeam, updateTeam , changeMemeberRole , kickMemeber , leaveTeam };
