"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  CheckSquare,
  Users,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/navbar";

export default function HomePage() {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: CheckSquare,
      title: "Gestão de Tarefas",
      description: "Organize suas tarefas com quadros intuitivos de arrastar e soltar.",
    },
    {
      icon: Users,
      title: "Colaboração em Equipe",
      description: "Trabalhe em conjunto com sua equipe em tempo real.",
    },
    {
      icon: Zap,
      title: "Velocidade Extrema",
      description: "Construído com Next.js para uma performance otimizada.",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Segurança de nível empresarial com autenticação Clerk.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 py-35 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-atrelator">
            Organize o trabalho e a vida,{" "}
            <span className="text-blue-600 italic">facilmente.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O Atrelator ajuda equipes a avançar. Colabore, gerencie
            projetos e alcance novos picos de produtividade. De arranha-céus ao
            home office, a forma como sua equipe trabalha é única resolva tudo
            com o Atrelator.
          </p>

          {!isSignedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
                  Assinar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Button variant="outline" size="lg" className="text-lg px-5">
                Avaliação gratuita
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-0">
        <div className="text-center mb-18">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-atrelator">
            Tudo o que você precisa para se organizar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recursos poderosos para ajudar sua equipe a produzir mais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/50 backdrop-blur-sm"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center ">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-atrelator">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-atrelator">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Seja mais uma das milhares de equipes que já usam o Atrelator para facilitar e organizar seu trabalho.
          </p>

          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Iniciar free trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image 
                src="/logo.svg" 
                alt="Atrelator Logo" 
                width={40} 
                height={40} 
                className="brightness-0 invert" 
              />
              <span className="text-xl font-bold font-atrelator">Atrelator</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} Atrelator. Todos os direitos reservados.</span>
              <span>Styled with tailwind CSS . Builded with Next.js & Clerk</span>
              <span>Design e coding by Satochy Tanabe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}