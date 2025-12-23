import cron from "node-cron"
import { prisma } from "../config/db.js"

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

export const startInviteCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS)
      const expiredInvites = await prisma.teamInvite.findMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo
          },
          AND: {
            status: "PENDING"
          }

        }
      })
      if(expiredInvites.length === 0){
        console.log("No expired invites found")
        return
      }
      await prisma.teamInvite.updateMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo
            
          },
          AND: {
            status: "PENDING"
          }
        },
        data: {
          status: "REJECTED"
        }
      })

      console.log("✅ Expired team invites cleaned")
    } catch (error) {
      console.error("❌ Invite cleanup failed:", error)
    }
  })
}
