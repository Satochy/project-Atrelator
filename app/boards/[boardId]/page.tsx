"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Calendar, Filter, ChevronLeft, MoreHorizontal, Trash2, Settings2, CheckCircle2, AlertCircle, Clock, Info, X, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, closestCorners, defaultDropAnimationSideEffects, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { useBoards } from "@/lib/hooks/useBoards";

const PRIORITIES = {
  completed: { color: "bg-green-500", label: "Concluída", icon: CheckCircle2 },
  low: { color: "bg-blue-500", label: "Não Urgente", icon: Info },
  medium: { color: "bg-yellow-500", label: "Meio Urgente", icon: Clock },
  high: { color: "bg-red-500", label: "Urgente", icon: AlertCircle },
};

const INITIAL_FILTERS = {
  title: "",
  priority: "all",
  creator: "",
  date: ""
};

function DroppableZone({ id, children }: { id: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="flex-1 min-h-40">{children}</div>;
}

function SortableTask({ task, onDelete, onUpdate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id,
    data: { type: "Task", task }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState({ 
    title: task.title, 
    description: task.description || "", 
    priority: task.priority || "low" 
  });

  useEffect(() => {
    setEditData({ title: task.title, description: task.description || "", priority: task.priority || "low" });
  }, [task]);

  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  const currentPriority = PRIORITIES[task.priority as keyof typeof PRIORITIES] || PRIORITIES.low;
  const formattedDate = task.createdAt ? new Date(task.createdAt).toLocaleDateString('pt-BR') : "15/01/2026";
  const displayUserName = task.creatorName ? `@${task.creatorName}` : "@usuario";

  const handleInternalSave = async () => {
    await onUpdate(task.id, {
      title: editData.title,
      description: editData.description,
      priority: editData.priority
    });
    setIsOpen(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3 outline-none group relative touch-none">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Card {...attributes} {...listeners} className="border border-gray-100 shadow-none bg-white rounded-xl cursor-grab active:cursor-grabbing select-none hover:border-gray-200 transition-all">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-[#1a1a1a] pr-12 line-clamp-1">{task.title}</h4>
              <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <DialogTrigger asChild>
                  <button onPointerDown={(e) => e.stopPropagation()} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                    <Settings2 className="h-3.5 w-3.5" />
                  </button>
                </DialogTrigger>
                <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(task.id)} className="p-1 hover:bg-red-50 rounded text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-3 text-gray-400/80">
                <div className="flex items-center space-x-1.5">
                  <User className="h-3 w-3" />
                  <span className="text-[11px] font-bold">{displayUserName}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[11px] font-bold">{formattedDate}</span>
                </div>
              </div>
              <div className={`h-2 w-2 rounded-full ${currentPriority.color}`} />
            </div>
          </CardContent>
        </Card>

        <DialogContent onPointerDown={(e) => e.stopPropagation()} className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-extrabold text-gray-800">Editar Tarefa</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">Título</label>
              <Input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="rounded-xl border-gray-100 font-bold h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">Prioridade</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PRIORITIES).map(([key, value]) => (
                  <button key={key} type="button" onClick={() => setEditData({...editData, priority: key})} className={`flex items-center space-x-2 p-3 rounded-xl border transition-all text-[12px] font-bold ${editData.priority === key ? `${value.color} text-white border-transparent` : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}>
                    <value.icon className="h-4 w-4" /><span>{value.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">Descrição</label>
              <span className="text-xs text-gray-400 ml-1 italic">(Opcional)</span>
              <Textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} className="rounded-xl border-gray-100 min-h-32 resize-none" placeholder="Detalhes da tarefa..." />
            </div>
          </div>
          <DialogFooter><Button onClick={handleInternalSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl">Salvar Alterações</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BoardPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const { board, columns: serverColumns, loading, moveTask, createRealTask, deleteTask, updateTask, createColumn, updateColumn, deleteColumn } = useBoards(params.boardId as string);
  
  const [columns, setColumns] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: "", description: "", priority: "low" });
  
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [listDialogMode, setListDialogMode] = useState<"create" | "edit">("create");
  const [listData, setListData] = useState({ id: "", title: "" });

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    if (serverColumns) setColumns(serverColumns);
  }, [serverColumns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks?.filter((task: any) => {
        const matchesTitle = task.title.toLowerCase().includes(filters.title.toLowerCase());
        const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
        const matchesCreator = task.creatorName?.toLowerCase().includes(filters.creator.toLowerCase());
        
        let matchesDate = true;
        if (filters.date) {
          const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
          matchesDate = taskDate === filters.date;
        }

        return matchesTitle && matchesPriority && matchesCreator && matchesDate;
      }) || []
    }));
  }, [columns, filters]);

  const hasActiveFilters = useMemo(() => {
    return filters.title !== "" || filters.priority !== "all" || filters.creator !== "" || filters.date !== "";
  }, [filters]);

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      await updateTask(taskId, updates);
      setColumns(prev => prev.map(col => ({
        ...col,
        tasks: col.tasks?.map((t: any) => t.id === taskId ? { ...t, ...updates } : t)
      })));
    } catch (err) {
      console.error("Erro na atualização:", err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") setActiveTask(event.active.data.current.task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const overCol = columns.find(col => col.id === overId || col.tasks?.some((t: any) => t.id === overId));
    const activeCol = columns.find(col => col.tasks?.some((t: any) => t.id === activeId));

    if (overCol && activeCol && activeCol.id !== overCol.id) {
      const newColumns = [...columns];
      const activeColIndex = newColumns.findIndex(c => c.id === activeCol.id);
      const overColIndex = newColumns.findIndex(c => c.id === overCol.id);
      const taskIndex = newColumns[activeColIndex].tasks.findIndex((t: any) => t.id === activeId);
      const [movedTask] = newColumns[activeColIndex].tasks.splice(taskIndex, 1);
      
      if (!newColumns[overColIndex].tasks) newColumns[overColIndex].tasks = [];
      newColumns[overColIndex].tasks.push(movedTask);
      
      setColumns(newColumns);
      moveTask(activeId, overCol.id, 0);
    }
  };

  if (loading && columns.length === 0) return <div className="p-10 text-gray-400 font-bold text-center">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col select-none bg-[#f9fafb]">
      <header className="w-full bg-white z-10 border-b border-gray-100">
        <div className="px-8 py-4 flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center space-x-4">
           <button 
            onClick={() => router.push("/dashboard")} 
            className="text-gray-500 hover:text-gray-800 transition-colors flex items-center group">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Voltar ao Dashboard</span>
           </button>
          <div className="h-6 w-px bg-gray-300 mx-3"/>
            <div className="flex items-center space-x-3">
               <img src="/logo.svg" alt="Logo" className="h-7 w-auto fill-current pl-2"/>
               <div className="flex items-center space-x-2">
                 <h1 className="text-xl font-extrabold text-[#111]">{board?.title}</h1>
                 <MoreHorizontal className="h-5 w-5 text-[#111] opacity-90" />
               </div>
            </div>
          </div>

          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className={`h-10 text-xs border-gray-100 font-bold rounded-xl px-4 ${hasActiveFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-500'}`}>
                <Filter className="h-4 w-4 mr-2" /> Filtros {hasActiveFilters && "•"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
              <DialogHeader><DialogTitle className="text-xl font-extrabold text-gray-800">Filtrar Tarefas</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Título</label>
                  <Input placeholder="Buscar por nome..." value={filters.title} onChange={(e) => setFilters({...filters, title: e.target.value})} className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Prioridade</label>
                    <Select value={filters.priority} onValueChange={(v) => setFilters({...filters, priority: v})}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Todas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="low">Não Urgente</SelectItem>
                        <SelectItem value="medium">Meio Urgente</SelectItem>
                        <SelectItem value="high">Urgente</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Criado em</label>
                    <Input type="date" value={filters.date} onChange={(e) => setFilters({...filters, date: e.target.value})} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Criador</label>
                  <Input placeholder="Nome do usuário..." value={filters.creator} onChange={(e) => setFilters({...filters, creator: e.target.value})} className="rounded-xl" />
                </div>
              </div>
              <DialogFooter className="flex sm:justify-between items-center gap-2">
                <Button 
                  variant="ghost" 
                  disabled={!hasActiveFilters}
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="text-red-500 hover:text-red-600 font-bold disabled:opacity-30"
                >
                  <X className="h-4 w-4 mr-1" /> Limpar
                </Button>
                <Button onClick={() => setIsFilterDialogOpen(false)} className="bg-blue-600 text-white font-bold rounded-xl px-8">Aplicar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 px-10 pt-8 w-full overflow-hidden">
        <div className="max-w-[1800px] mx-auto flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
             <span className="text-[12px] text-gray-400 font-extrabold uppercase tracking-widest">
               Tarefas Visíveis: {filteredColumns?.reduce((acc: number, col: any) => acc + (col.tasks?.length || 0), 0)}
             </span>
             <Button onClick={() => { setListData({id: "", title: ""}); setListDialogMode("create"); setIsListDialogOpen(true); }} className="bg-black hover:bg-gray-800 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-black/10 transition-all hover:scale-105">
               <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Lista
             </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide items-start h-full">
              {filteredColumns.map((column: any) => (
                <div key={column.id} className="w-80 shrink-0 border border-gray-200 rounded-3xl flex flex-col bg-white h-fit shadow-sm">
                  <div className="flex items-center justify-between p-5 pb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-extrabold text-base text-gray-800 tracking-tight">{column.title}</h3>
                      <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-lg font-bold border border-gray-100">{column.tasks?.length || 0}</span>
                    </div>
                    <button onClick={() => { setListData({id: column.id, title: column.title}); setListDialogMode("edit"); setIsListDialogOpen(true); }} className="p-1 hover:bg-gray-50 rounded-md">
                      <MoreHorizontal className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <DroppableZone id={column.id}>
                    <div className="px-4">
                      <SortableContext id={column.id} items={column.tasks?.map((t: any) => t.id) || []} strategy={verticalListSortingStrategy}>
                        {column.tasks?.map((task: any) => ( 
                          <SortableTask key={task.id} task={task} onDelete={deleteTask} onUpdate={handleUpdateTask} /> 
                        ))}
                      </SortableContext>
                    </div>
                  </DroppableZone>

                  <div className="p-4 pt-1">
                    <button onClick={() => { setActiveColumnId(column.id); setIsCreatingTask(true); }} className="w-full flex items-center justify-center py-3 text-sm font-bold text-gray-400 hover:text-gray-600 bg-[#f8f9fa] hover:bg-gray-100 rounded-2xl transition-all"><Plus className="h-4 w-4 mr-1.5" /> Add Task</button>
                  </div>
                </div>
              ))}
            </div>

            {typeof document !== 'undefined' && createPortal(
              <DragOverlay dropAnimation={{ duration: 200, sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                {activeTask ? (
                  <div className="w-72 opacity-90 scale-105 pointer-events-none">
                    <Card className="border border-gray-200 shadow-2xl bg-white rounded-xl">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="text-sm font-bold text-[#1a1a1a]">{activeTask.title}</h4>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </main>

      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        <DialogContent onPointerDown={(e) => e.stopPropagation()} className="sm:max-w-sm rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-extrabold text-gray-800">{listDialogMode === "create" ? "Nova Lista" : "Editar Lista"}</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input placeholder="Nome da lista" value={listData.title} onChange={(e) => setListData({...listData, title: e.target.value})} className="rounded-xl border-gray-100 font-bold h-12" />
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            {listDialogMode === "edit" && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  if(confirm("Deseja realmente excluir esta lista e todas as suas tarefas?")) {
                    deleteColumn(listData.id);
                    setIsListDialogOpen(false);
                  }
                }}
                className="rounded-xl font-bold h-12 px-6"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            )}
            <Button onClick={() => { 
              if(listDialogMode === "create") createColumn(listData.title); 
              else updateColumn(listData.id, listData.title); 
              setIsListDialogOpen(false); 
            }} className="bg-blue-600 text-white font-bold h-12 rounded-xl flex-1 px-6">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
        <DialogContent onPointerDown={(e) => e.stopPropagation()} className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-extrabold text-gray-800">Nova Tarefa</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <Input placeholder="Título da tarefa" value={newTaskData.title} onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})} className="rounded-xl border-gray-100 font-bold h-12" />
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <button key={key} type="button" onClick={() => setNewTaskData({...newTaskData, priority: key})} className={`flex items-center space-x-2 p-3 rounded-xl border transition-all text-[12px] font-bold ${newTaskData.priority === key ? `${value.color} text-white border-transparent` : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}>
                  <value.icon className="h-4 w-4" /><span>{value.label}</span>
                </button>
              ))}
            </div>
            <Textarea placeholder="Descrição (opcional)" value={newTaskData.description} onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})} className="rounded-xl border-gray-100 min-h-24 resize-none" />
          </div>
          <DialogFooter>
            <Button onClick={() => { 
              if(newTaskData.title && activeColumnId) { 
                const currentUserName = user?.username || user?.firstName || user?.fullName || "usuario";
                createRealTask(activeColumnId, { 
                  title: newTaskData.title,
                  description: newTaskData.description,
                  priority: newTaskData.priority,
                  creatorName: currentUserName 
                }); 
                setIsCreatingTask(false); 
                setNewTaskData({title: "", description: "", priority: "low"}); 
              } 
            }} className="w-full bg-blue-600 font-bold h-12 rounded-xl">Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .select-none [role="dialog"], .select-none input, .select-none textarea, .select-none button {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
      `}</style>
    </div>
  );
}