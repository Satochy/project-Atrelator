import { NextResponse } from "next/server";
import { createDbClient } from "@/lib/db/server";

export async function GET(req: Request) {
  try {
    const { db, orgId } = await createDbClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const board = await db.board.findUnique({
        where: { 
          id, 
          orgId: orgId as string 
        },
        include: {
          columns: {
            include: {
              tasks: { orderBy: { order: "asc" } }
            },
            orderBy: { order: "asc" }
          }
        }
      });

      if (!board) return new NextResponse("Não encontrado", { status: 404 });
      return NextResponse.json(board);
    }

    const boards = await db.board.findMany({
      where: { orgId: orgId as string },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error("[BOARDS_GET]", error);
    return new NextResponse("Erro ao buscar", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { db, orgId } = await createDbClient();
    const body = await req.json();
    const { title, image } = body;

    const board = await db.board.create({
      data: {
        title,
        orgId: orgId as string,
        imageId: image.id,
        imageThumbUrl: image.thumbUrl,
        imageFullUrl: image.fullUrl,
        imageUserName: image.username,
        imageLinkHTML: image.linkHtml,
      }
    });

    return NextResponse.json(board);
  } catch (error) {
    console.error("[BOARDS_POST]", error);
    return new NextResponse("Erro ao criar", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { db, orgId } = await createDbClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("ID faltando", { status: 400 });

    await db.board.delete({
      where: { id, orgId: orgId as string }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BOARDS_DELETE]", error);
    return new NextResponse("Erro ao deletar", { status: 500 });
  }
}