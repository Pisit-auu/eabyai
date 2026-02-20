import cron from "node-cron";
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";

if (!globalThis.cronStarted) {
  globalThis.cronStarted = true;

  cron.schedule("* * * * *", async () => {
    // กัน job ซ้อนกัน
    console.log("time")
    if (globalThis.cronRunning) return;

    globalThis.cronRunning = true;

    try {
      console.log("CRON RUNNING:", new Date().toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                }));



    await prisma.licenseKey.updateMany({
      where: {
        expireDate: {
          lte: new Date(),
        },
          expire: false,
        },
        data: {
          expire: true,
        },
      });
    await prisma.bill.updateMany({
      where: {
        exirelicendate: {
          lte: new Date(),
        },
          expire: false,
        },
        data: {
          expire: true,
        },
      });




        
    } catch (error) {
      console.error("Cron error:", error);
    } finally {
      globalThis.cronRunning = false;
    }
  });
}
