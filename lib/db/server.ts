import { db } from "@/lib/db"; 
import { auth } from "@clerk/nextjs/server";

export async function createDbClient() {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  return {
    db,  
    userId,
    orgId,
  };
}