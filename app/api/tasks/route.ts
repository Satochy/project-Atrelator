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

export async function PATCH(req: Request) {
  try {
    const { db } = await createDbClient();
    const body = await req.json();
    const { id, title, columnId, order } = body;

    const task = await db.task.update({
      where: { id },
      data: { 
        title: title ?? undefined,
        columnId: columnId ?? undefined, // Aqui permite mudar de lista
        order: order ?? undefined
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Erro ao atualizar tarefa", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { db } = await createDbClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await db.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Erro ao excluir", { status: 500 });
  }
}