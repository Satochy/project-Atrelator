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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Trash2, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBoards } from "@/lib/hooks/useBoards";

export interface Task {
  id: string;
  title: string;
  description?: string;
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
  onUpdateColumn,
  onDeleteColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (e: React.FormEvent<HTMLFormElement>, columnId: string) => void;
  onUpdateColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                const newTitle = prompt("Novo título da lista:", column.title);
                if (newTitle) onUpdateColumn(column.id, newTitle);
              }}>
                <Pencil className="mr-2 h-4 w-4" /> Renomear
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => { if(confirm("Excluir lista?")) onDeleteColumn(column.id) }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-2 min-h-150px">
          {children}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full mt-2 "><Plus className="mr-2 h-4 w-4" /> Nova Tarefa</Button>
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

function SortableTask({ 
  task, 
  onDelete, 
  onUpdate 
}: { 
  task: Task; 
  onDelete: (id: string) => void; 
  onUpdate: (id: string, updates: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="mb-2 group relative">
      <Card>
        <CardContent className="p-3 text-sm font-medium flex justify-between items-center">
          <span>{task.title}</span>
          <div className="hidden group-hover:flex space-x-1">
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
               e.stopPropagation();
               const newTitle = prompt("Novo título:", task.title);
               if (newTitle) onUpdate(task.id, { title: newTitle });
             }}>
               <Pencil className="h-3 w-3" />
             </Button>
             <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={(e) => {
               e.stopPropagation();
               onDelete(task.id);
             }}>
               <Trash2 className="h-3 w-3" />
             </Button>
          </div>
        </CardContent>
      </Card>
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
    updateColumn,
    deleteColumn,
    createRealTask,
    updateTask,
    deleteTask,
    moveTask
  } = useBoards(boardId);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    let targetColumnId = overId;
    const isOverTask = columns.some(col => col.tasks?.some(t => t.id === overId));
    
    if (isOverTask) {
      const col = columns.find(col => col.tasks?.some(t => t.id === overId));
      if (col) targetColumnId = col.id;
    }

    await moveTask(taskId, targetColumnId, 0);
  };

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

  if (loading) return <div className="p-8 text-center pt-24">Carregando quadro...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar boardTitle={board?.title || "Quadro"} />

      <main className="pt-24 p-8">
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
          <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <DroppableColumn 
                key={column.id} 
                column={column} 
                onCreateTask={handleCreateTask}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
              >
                <SortableContext items={column.tasks?.map(t => t.id) || []} strategy={verticalListSortingStrategy}>
                  {column.tasks?.map(task => (
                    <SortableTask 
                      key={task.id} 
                      task={task} 
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                    />
                  ))}
                </SortableContext>
              </DroppableColumn>
            ))}
            
            <Button 
                className="lg:w-80 shrink-0 border-dashed h-12 bg-black hover:bg-white hover:text-black"
                onClick={() => {
                  const title = prompt("Nome da lista:");
                  if (title) createColumn(title);
                }}
            >
              <Plus className="mr-2" /> Nova Lista
            </Button>
          </div>
        </DndContext>
      </main>
    </div>
  );
}