import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/server";

export async function POST(req: Request) {
  try {
    const { db } = await createDbClient();
    const body = await req.json();
    const { title, description, columnId } = body;

    const task = await db.task.create({
      data: {
        title,
        description,
        columnId,
        order: 0,
        priority: "medium",
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Erro ao criar tarefa", { status: 500 });
  }
}