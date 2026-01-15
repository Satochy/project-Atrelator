import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/server";

export async function POST(req: Request) {
  try {
    const { db } = await createDbClient();
    const body = await req.json();
    const { title, description, columnId, priority, creatorName } = body;

    const task = await db.task.create({
      data: {
        title,
        description: description || "",
        columnId,
        order: 0,
        priority: priority || "low",
        creatorName: creatorName || "usuario", 
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return new NextResponse("Erro ao criar tarefa", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { db } = await createDbClient();
    const body = await req.json();
    const { id, title, description, priority, columnId, order } = body;

    if (!id) return new NextResponse("ID não fornecido", { status: 400 });

    const task = await db.task.update({
      where: { id },
      data: { 
        title: title ?? undefined,
        description: description ?? undefined, 
        priority: priority ?? undefined,       
        columnId: columnId ?? undefined,
        order: order ?? undefined
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS_PATCH]", error);
    return new NextResponse("Erro ao atualizar tarefa", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { db } = await createDbClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("ID não fornecido", { status: 400 });

    await db.task.delete({ where: { id: id as string } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TASKS_DELETE]", error);
    return new NextResponse("Erro ao excluir", { status: 500 });
  }
}