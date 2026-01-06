"use client";
import { useState, useEffect, useCallback } from "react";
import { useOrganization } from "@clerk/nextjs";

export const useBoards = () => {
  const { organization } = useOrganization();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = useCallback(async () => {
    if (!organization?.id) return;
    try {
      setLoading(true);
      const response = await fetch("/api/boards");
      
      if (!response.ok) throw new Error("Falha ao buscar");
      
      const data = await response.json();
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro no fetch:", err);
    } finally {
      setLoading(false);
    }
    
    const response = await fetch("/api/boards");
    
    if (!response.ok) {
      setBoards([]);
      return;
}

const data = await response.json();
setBoards(Array.isArray(data) ? data : []);
  }, [organization?.id]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

const createBoard = async ({ title, image }: any) => {
  const response = await fetch("/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, image }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Erro da API:", errorData);
    throw new Error("Falha ao salvar no banco");
  }

  const newBoard = await response.json();
  setBoards((prev) => [newBoard, ...prev]);
  return newBoard;
};

  const deleteBoard = async (id: string) => {
    const response = await fetch(`/api/boards?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar");
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  return { boards, loading, createBoard, deleteBoard, refresh: fetchBoards };
};