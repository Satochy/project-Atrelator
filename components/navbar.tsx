"use client";

import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importação para navegação forçada
import { Button } from "./ui/button";

export default function Navbar() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter(); // Inicializa o roteador

  if (!isLoaded) {
    return (
      <nav className="fixed top-0 left-0 w-full h-14 border-b bg-white z-100" />
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full h-14 border-b bg-white/80 backdrop-blur-md flex items-center z-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-75 transition"
          >
            <Image 
              src="/logo.svg" 
              alt="Atrelator Logo" 
              width={40} 
              height={40} 
            />
            <span className="text-xl font-bold text-gray-900 font-atrelator">
              Atrelator
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-x-2 md:gap-x-4">
          {isSignedIn ? (
            <div className="flex items-center gap-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="font-atrelator cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Começar Grátis
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}