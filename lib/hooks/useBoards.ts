"use client";
import { useState, useEffect, useCallback } from "react";
import { useOrganization } from "@clerk/nextjs";

export const useBoards = (boardId?: string) => {
  const { organization } = useOrganization();
  const [boards, setBoards] = useState<any[]>([]);
  const [board, setBoard] = useState<any>(null); 
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = useCallback(async () => {
    if (boardId) {
      try {
        setLoading(true);
        const response = await fetch(`/api/boards?id=${boardId}`);
        if (!response.ok) throw new Error("Falha ao buscar quadro");
        const data = await response.json();
        setBoard(data);
        setColumns(data.columns || []);
      } catch (err) {
        console.error("Erro no fetch do quadro:", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!organization?.id) return;
    try {
      setLoading(true);
      const response = await fetch("/api/boards");
      if (!response.ok) throw new Error("Falha ao buscar quadros");
      const data = await response.json();
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro no fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [organization?.id, boardId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async ({ title, image }: any) => {
    const response = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image }),
    });
    if (!response.ok) throw new Error("Falha ao salvar no banco");
    const newBoard = await response.json();
    setBoards((prev) => [newBoard, ...prev]);
    return newBoard;
  };

  const deleteBoard = async (id: string) => {
    const response = await fetch(`/api/boards?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar");
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  const createColumn = async (title: string) => {
    if (!boardId) return;
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, boardId }),
      });
      if (!response.ok) throw new Error("Erro ao criar coluna");
      await fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const createRealTask = async (columnId: string, taskData: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: taskData.title,
          description: taskData.description,
          columnId 
        }),
      });
      if (!response.ok) throw new Error("Erro ao criar tarefa");
      await fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const updateBoard = async (data: any) => { console.log("Update board:", data); };
  const moveTask = async (taskId: string, targetId: string, idx: number) => { console.log("Move Task no Banco..."); };
  const updateColumn = async (id: string, title: string) => { console.log("Update col"); };

  return { 
    boards, 
    board, 
    columns, 
    loading, 
    createBoard, 
    deleteBoard, 
    refresh: fetchBoards,
    createColumn, 
    updateBoard, 
    createRealTask, 
    setColumns, 
    moveTask,
    updateColumn 
  };
};