import { db } from "./db";

export const boardService = {
  async getBoards(orgId: string) {
    return await db.board.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" }
    });
  },

  async getBoard(id: string, orgId: string) {
    return await db.board.findFirst({
      where: { id, orgId }
    });
  }
};

export const boardDataService = {
  async createBoardWithDefaultColumns(data: {
    title: string;
    orgId: string;
    image: {
      id: string;
      thumbUrl: string;
      fullUrl: string;
      username: string;
      linkHtml: string;
    };
  }) {
    const board = await db.board.create({
      data: {
        title: data.title,
        orgId: data.orgId,
        imageId: data.image.id,
        imageThumbUrl: data.image.thumbUrl,
        imageFullUrl: data.image.fullUrl,
        imageUserName: data.image.username,
        imageLinkHTML: data.image.linkHtml,
      },
    });

    return board;
  },
};