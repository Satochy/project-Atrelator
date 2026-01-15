"use client";
import { useState, useEffect, useCallback } from "react";
import { useOrganization } from "@clerk/nextjs";

export const useBoards = (boardId?: string) => {
  const { organization } = useOrganization();
  const [boards, setBoards] = useState<any[]>([]);
  const [board, setBoard] = useState<any>(null); 
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = useCallback(async (isSilent = false) => {
    if (boardId) {
      try {
        if (!isSilent) setLoading(true);
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
      if (!isSilent) setLoading(true);
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
    if (boardId === id) await fetchBoards();
  };

  const createColumn = async (title: string) => {
    if (!boardId) return;
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, boardId }),
      });
      if (response.ok) await fetchBoards(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateColumn = async (id: string, title: string) => {
    try {
      const response = await fetch("/api/columns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });
      if (response.ok) await fetchBoards(true);
    } catch (error) {
      console.error("Erro ao atualizar coluna:", error);
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      // Atualização otimista: remove da tela antes mesmo da API responder
      setColumns((prev) => prev.filter((col) => col.id !== id));
      
      const response = await fetch(`/api/columns?id=${id}`, { method: "DELETE" });
      if (!response.ok) await fetchBoards(true); // Se falhar, recarrega do banco
    } catch (error) {
      console.error("Erro ao excluir coluna:", error);
      await fetchBoards(true);
    }
  };

  const createRealTask = async (columnId: string, taskData: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskData, columnId }),
      });
      if (response.ok) await fetchBoards(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id: string, updates: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (response.ok) await fetchBoards(true); 
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (response.ok) await fetchBoards(true);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const moveTask = async (taskId: string, targetColumnId: string, newOrder: number) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, columnId: targetColumnId, order: newOrder }),
      });
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
      fetchBoards(true);
    }
  };

  return { boards, board, columns, loading, createBoard, deleteBoard, refresh: fetchBoards, createColumn, updateColumn, deleteColumn, createRealTask, updateTask, deleteTask, moveTask, setColumns };
};