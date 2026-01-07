"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Componentes UI (Shadcn)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";

// Hooks e Ícones
import { useBoards } from "../../lib/hooks/useBoards";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Trello, 
  Rocket, 
  BarChart3 
} from "lucide-react";

export default function UnifiedDashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { createBoard, deleteBoard, boards, loading } = useBoards();

  // Estados do Segundo Código (Filtros e Visualização)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: { start: "", end: "" },
  });

  // Lógica de Filtragem
  const filteredBoards = boards.filter((board) => {
    const matchesSearch = board.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDate = (!filters.dateRange.start || new Date(board.created_at || Date.now()) >= new Date(filters.dateRange.start)) &&
                        (!filters.dateRange.end || new Date(board.created_at || Date.now()) <= new Date(filters.dateRange.end));
    return matchesSearch && matchesDate;
  });

  const handleCreateBoard = async () => {
    const title = window.prompt("Nome do novo quadro:");
    if (!title) return;
    try {
      await createBoard({
        title,
        image: {
          id: "img_" + Date.now(),
          thumbUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400",
          fullUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          username: "Unsplash",
          linkHtml: "https://unsplash.com" 
        }
      });
    } catch (err) {
      alert("Erro ao criar quadro.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-18">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bem vindo de volta, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">Gerencie aqui os seus projetos e quadros de trabalho.</p>
          </div>
          <Button onClick={handleCreateBoard} className="bg-black hover:bg-white hover:text-black">
            <Plus className="h-4 w-4 mr-2" /> Novo Quadro
          </Button>
        </div>

        {/* Card total quadros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total de Quadros</p>
                <p className="text-2xl font-bold">{boards.length}</p>
              </div>
               <div className="opacity-80">
                <Image src="/logo.svg" alt="Atrelator Logo" width={35} height={35} />
              </div>
            </CardContent>
          </Card>
          {/* Card projetos ativos */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Projetos Ativos</p>
                <p className="text-2xl font-bold">{boards.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Rocket size={24} />
              </div>
            </CardContent>
          </Card>
          {/* Card att recente */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Atividade Recente</p>
                <p className="text-2xl font-bold">Hoje</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <BarChart3 size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cabeçalho 2 */}
        <div className="mb-5">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            Seus Quadros:
          </h1>
          <p className="text-gray-600">Gerencie seus projetos e tarefas.</p>
        </div>

        {/* Barra de Busca e Filtros Estilo */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Pesquisar quadros..." 
              className="pl-10 bg-white"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="h-4 w-4 mr-2" /> Filtros
            </Button>
            <div className="flex border rounded-md bg-white p-1">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Listagem de Quadros */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBoards.map((board) => (
              <div 
                key={board.id} 
                className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md" 
                onClick={() => router.push(`/boards/${board.id}`)}
              >
                {/* Imagem de Fundo */}
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${board.imageThumbUrl || board.image?.thumbUrl})` }} 
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />
                
                <div className="relative p-4 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <p className="font-bold text-white text-lg drop-shadow-md truncate">
                      {board.title}
                    </p>
                    
                    {/* Botão de Excluir Invisível */}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if(confirm("Excluir quadro permanentemente?")) deleteBoard(board.id);
                      }} 
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Badge className="w-fit bg-white/20 text-white backdrop-blur-md border-none">
                    Novo
                  </Badge>
                </div>
              </div>
            ))}
            
            {/* Card de Novo Quadro */}
            <button 
              onClick={handleCreateBoard}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all bg-white/50"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span className="font-medium">Criar novo quadro</span>
            </button>
          </div>
        ) : (
          /* Modo Lista */
          <div className="space-y-3">
            {filteredBoards.map((board) => (
              <Card 
                key={board.id} 
                className="hover:border-blue-500 cursor-pointer group transition-all"
                onClick={() => router.push(`/boards/${board.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 rounded bg-cover bg-center" style={{ backgroundImage: `url(${board.imageThumbUrl})` }} />
                    <span className="font-semibold text-gray-800">{board.title}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Filtros */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar Quadros</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Data de Criação</Label>
              <Input 
                type="date" 
                onChange={(e) => setFilters(p => ({ ...p, dateRange: { ...p.dateRange, start: e.target.value }}))} 
              />
            </div>
            <Button className="w-full" onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}