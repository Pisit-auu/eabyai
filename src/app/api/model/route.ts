import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
    symbol: true,
    timeframe: true,
    platform: true,
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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Check if the required 'platform' field exists before using it
    if (!body.platform) {
      return new Response("Missing required field: platform", { status: 400 })
    }

    // You can also add checks for other required fields here
    // if (!body.symbol || !body.timeframe) return new Response("...", { status: 400 })

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
            // Now this is safe because we know body.platform is a string
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