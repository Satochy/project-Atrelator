"use client";

import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBoards } from "@/lib/hooks/useBoards"; // Importando seu hook corrigido

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority: "low" | "medium" | "high";
}

export interface ColumnWithTasks {
  id: string;
  title: string;
  tasks: Task[];
}

function DroppableColumn({
  column,
  children,
  onCreateTask,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (e: React.FormEvent<HTMLFormElement>, columnId: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <div ref={setNodeRef} className="w-full shrink-0 lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <Badge variant="secondary">{column.tasks?.length || 0}</Badge>
          </div>
          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
        <div className="p-2">
          {children}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full mt-2"><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
              <form onSubmit={(e) => onCreateTask(e, column.id)} className="space-y-4">
                <Input name="title" placeholder="Título da tarefa" required />
                <Textarea name="description" placeholder="Descrição" />
                <Button type="submit" className="w-full">Criar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="mb-2">
      <Card><CardContent className="p-3 text-sm font-medium">{task.title}</CardContent></Card>
    </div>
  );
}

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { 
    board, 
    columns, 
    loading, 
    createColumn, 
    createRealTask 
  } = useBoards(boardId);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>, columnId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    if (title) {
        createRealTask(columnId, { title, description });
        (e.target as HTMLFormElement).reset();
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando quadro...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar boardTitle={board?.title || "Quadro"} />

      <main className="pt-24 p-8">
        <DndContext sensors={sensors} collisionDetection={rectIntersection}>
          <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
            {columns.map((column) => (
              <DroppableColumn key={column.id} column={column} onCreateTask={handleCreateTask}>
                <SortableContext items={column.tasks?.map(t => t.id) || []} strategy={verticalListSortingStrategy}>
                  {column.tasks?.map(task => <SortableTask key={task.id} task={task} />)}
                </SortableContext>
              </DroppableColumn>
            ))}
            
            <Button 
                variant="outline" 
                className="lg:w-80 shrink-0 border-dashed h-12"
                onClick={() => createColumn("Nova Lista")}
            >
              <Plus className="mr-2" /> Nova Lista
            </Button>
          </div>
        </DndContext>
      </main>
    </div>
  );
}