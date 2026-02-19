import prisma from "@/lib/prisma"

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


export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    const updated = await prisma.model.update({
      where: { nameEA: id }, // ตรวจสอบให้แน่ใจว่า nameEA เป็น @unique ใน schema.prisma
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