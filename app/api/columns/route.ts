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
        order: 0, 
      },
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error("[COLUMNS_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { db, orgId } = await createDbClient();
    const body = await req.json();
    const { id, title } = body;

    const column = await db.column.update({
      where: { id, board: { orgId: orgId as string } }, // Segurança: garante que a coluna pertence à org
      data: { title }
    });

    return NextResponse.json(column);
  } catch (error) {
    return new NextResponse("Erro ao atualizar", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { db, orgId } = await createDbClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("ID faltando", { status: 400 });

    await db.column.delete({
      where: { id, board: { orgId: orgId as string } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Erro ao excluir", { status: 500 });
  }
}