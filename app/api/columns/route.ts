import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/server";

export async function POST(req: Request) {
  try {
    const { db } = await createDbClient(); // Usa sua conexão validada
    const body = await req.json();
    const { title, boardId } = body;

    if (!title || !boardId) {
      return new NextResponse("Título e BoardId são obrigatórios", { status: 400 });
    }

    const column = await db.column.create({
      data: {
        title,
        boardId,
        order: 0, // Por enquanto fixo, depois você pode evoluir a ordenação
      },
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error("[COLUMNS_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}