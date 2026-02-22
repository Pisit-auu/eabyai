import prisma from "@/lib/prisma"; 
/**
 * @swagger
 * /api/model:
 *   get:
 *     summary: ดึงรายการ Model ทั้งหมด
 *     description: |
 *       ดึงข้อมูล model ทั้งหมด พร้อม include:
 *       - symbol
 *       - timeframe
 *       - platform
 *       - licenses
 *     tags:
 *       - Model
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 *       500:
 *         description: Error fetching models
 */
export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
    symbol: true,
    timeframe: true,
    platform: true,
    licenses: true
    },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(models)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching models", { status: 500 })
  }
}
/**
 * @swagger
 * /api/model:
 *   post:
 *     summary: สร้าง Model (EA) ใหม่
 *     description: |
 *       สร้าง model ใหม่และเชื่อมกับ:
 *       - symbol
 *       - timeframe
 *       - platform
 *     tags:
 *       - Model
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameEA
 *               - filePath
 *               - commission
 *               - symbol
 *               - timeframe
 *               - platform
 *             properties:
 *               nameEA:
 *                 type: string
 *                 example: EA Gold Pro
 *               filePath:
 *                 type: string
 *                 example: /models/ea_gold_pro.ex5
 *               commission:
 *                 type: number
 *                 example: 10
 *               symbol:
 *                 type: string
 *                 example: XAUUSD
 *               timeframe:
 *                 type: string
 *                 example: H1
 *               platform:
 *                 type: string
 *                 example: MT5
 *
 *     responses:
 *       200:
 *         description: สร้าง Model สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       400:
 *         description: Missing required field
 *
 *       500:
 *         description: Error creating model
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()


    if (!body.platform) {
      return new Response("Missing required field: platform", { status: 400 })
    }


    const newModel = await prisma.model.create({
        data: {
          nameEA: body.nameEA,
          filePath: body.filePath,
          commission: Number(body.commission),

          symbol: {
            connect: { nameSymbol: body.symbol },
          },

          timeframe: {
            connect: { nametimeframe: body.timeframe },
          },

          platform: {
            connect: { nameplatform: body.platform.toUpperCase() },
          },
        },
      });

    return Response.json(newModel)
  } catch (error) {
    console.error(error)
    return new Response("Error creating model", { status: 500 })
  }
}