import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// GET /messages/:teamId
export const getTeamMessages = async (req, res) => {
  const { teamId } = req.params
  
  try {
    const messages = await prisma.message.findMany({
      where: { teamId: teamId },
      include: {
        sender: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'asc' } // Oldest first
    })
    
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" })
  }
}