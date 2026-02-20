import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await prisma.user.findMany({
    where: { email: id },
    include: {
      tradeAccounts: {
        include: {
          licenses: {
            include: {
              bills: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(user);
}