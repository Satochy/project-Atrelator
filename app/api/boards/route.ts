import { auth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const { orgId } = await auth();
    if (!orgId) return new NextResponse("Não autorizado", { status: 401 });

    const boards = await db.board.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(boards);
  } catch (error) {
    return new NextResponse("Erro ao buscar", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    const body = await req.json();
    const { title, image } = body;

    if (!userId || !orgId) return new NextResponse("Não autorizado", { status: 401 });
    
    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId: image.id,
        imageThumbUrl: image.thumbUrl,
        imageFullUrl: image.fullUrl,
        imageUserName: image.username,
        imageLinkHTML: image.linkHtml,
      }
});

    return NextResponse.json(board);
  } catch (error) {
    console.error("ERRO NO POST:", error);
    return new NextResponse("Erro ao criar", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { orgId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!orgId || !id) return new NextResponse("Faltando ID ou Org", { status: 400 });

    await db.board.delete({
      where: { id, orgId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO NO DELETE:", error);
    return new NextResponse("Erro ao deletar", { status: 500 });
  }
}