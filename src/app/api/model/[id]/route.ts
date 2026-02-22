import prisma from "@/lib/prisma"
/**
 * @swagger
 * /api/model/{id}:
 *   get:
 *     summary: ดึงข้อมูล Model ตาม nameEA
 *     description: |
 *       ค้นหา model จาก nameEA
 *       พร้อม include:
 *       - symbol
 *       - timeframe
 *       - platform
 *     tags:
 *       - Model
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameEA ของ model
 *         example: EA Gold Pro
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       404:
 *         description: Model not found
 *
 *       500:
 *         description: Error fetching model
 */
export async function GET(request: Request,
  context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const model = await prisma.model.findUnique({
      where: { nameEA: id },
      include: {
        symbol: true,
        timeframe: true,
        platform:true
      },
    })

    if (!model) {
      return new Response("Model not found", { status: 404 })
    }

    return Response.json(model)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching model", { status: 500 })
  }
}

/**
 * @swagger
 * /api/model/{id}:
 *   put:
 *     summary: อัปเดตข้อมูล Model
 *     description: |
 *       อัปเดต model ตาม nameEA
 *       สามารถอัปเดตได้:
 *       - nameEA
 *       - filePath
 *       - commission
 *       - active
 *       - symbol
 *       - timeframe
 *       - platform
 *       - downloadCount (increment)
 *     tags:
 *       - Model
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameEA เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameEA:
 *                 type: string
 *                 example: EA Gold Pro V2
 *               filePath:
 *                 type: string
 *                 example: /models/ea_gold_pro_v2.ex5
 *               commission:
 *                 type: number
 *                 example: 10
 *               active:
 *                 type: boolean
 *                 example: true
 *               symbol:
 *                 type: string
 *                 example: XAUUSD
 *               timeframe:
 *                 type: string
 *                 example: H1
 *               platform:
 *                 type: string
 *                 example: MT5
 *               downloadCount:
 *                 type: number
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       500:
 *         description: Update failed
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    const updated = await prisma.model.update({
      where: { nameEA: id },
      data: {
        ...(body.nameEA && { nameEA: body.nameEA }),
        ...(body.filePath && { filePath: body.filePath }),
        ...(body.commission && { commission: Number(body.commission) }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.symbol && {
          symbol: {
            connect: { nameSymbol: body.symbol.trim() },
          },
        }),
        ...(body.downloadCount !== undefined && {
          downloadCount: {
            increment: Number(body.downloadCount),
          },
        }),
        ...(body.timeframe && {
          timeframe: {
            connect: { nametimeframe: body.timeframe.trim() },
          },
        }),
        ...(body.platform && {
          platform: {
            // เพิ่ม toUpperCase() ให้ตรงกับมาตรฐานของ POST
            connect: { nameplatform: body.platform.trim().toUpperCase() }, 
          },
        }),
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return new Response("Update failed", { status: 500 });
  }
}
/**
 * @swagger
 * /api/model/{id}:
 *   delete:
 *     summary: ลบ Model ตาม nameEA
 *     tags:
 *       - Model
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameEA ที่ต้องการลบ
 *
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       500:
 *         description: Delete failed
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await prisma.model.delete({
      where: { nameEA: id },
    })

    return new Response("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response("Delete failed", { status: 500 })
  }
}