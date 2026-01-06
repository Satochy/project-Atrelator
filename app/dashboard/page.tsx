"use client";

import Image from "next/image"; 
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useBoards } from "../../lib/hooks/useBoards";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { createBoard, deleteBoard, boards, loading } = useBoards();

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
      alert("Erro ao criar quadro no banco de dados."); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-25">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.firstName}! 👋</h1>
            <p className="text-sm text-gray-500">Seus quadros de trabalho.</p>
          </div>
          <Button onClick={handleCreateBoard} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-" /> Novo Quadro
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Total de Quadros</p>
                <p className="text-xl font-bold">{boards?.length || 0}</p>
              </div>
              <div className="opacity-80">
                <Image src="/logo.svg" alt="Atrelator Logo" width={35} height={35} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer" 
              onClick={() => router.push(`/boards/${board.id}`)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${board.imageThumbUrl})` }} 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-300" />
              
              <div className="relative p-3 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between w-full">
                  <p className="font-bold text-white text-sm drop-shadow-lg truncate pr-2">
                    {board.title}
                  </p>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(confirm("Deseja excluir este quadro permanentemente?")) {
                        deleteBoard(board.id);
                      }
                    }} 
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white shadow-sm transition-opacity duration-300 z-50 shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}