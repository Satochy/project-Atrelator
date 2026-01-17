# Atrelator - Sistema de Gerenciamento Kanban Avançado

<div align="center"> 
  <img width="1280" height="720" alt="Banner" src="https://github.com/user-attachments/assets/c681e70a-858e-4585-8028-32cf5ecb0616" />
  <div>
    <img src="https://img.shields.io/badge/-Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/-Neon_Postgres-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon" />
    <img src="https://img.shields.io/badge/-Clerk-0072CE?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/-@dnd--kit-FAB005?style=for-the-badge&logo=react&logoColor=white" alt="dnd-kit" />
    <img src="https://img.shields.io/badge/-TailwindCSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  </div>
  <h3 align="center">App Kanban Profissional com Next.js 15, Neon, Clerk & dnd‑kit</h3>
  <br />
</div>

## 📋 Índice

1. [🚀 Introdução](#-introdução)
2. [⚙️ Tecnologias](#-tecnologias)
3. [⚡ Funcionalidades](#-funcionalidades)
4. [👌 Início Rápido](#-início-rápido)
5. [🗄️ Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
6. [🔗 Links Úteis](#-links-úteis)

---

## 🚀 Introdução

O **Atrelator** é um clone do Trello, ou seja, um sistema de gerenciamento de tarefas de alta performance, construído com **Next.js 15**, **Neon Postgres**, **Clerk**, **dnd-kit** e **TailwindCSS v4**. Este projeto implementa fluxos de trabalho profissionais, autenticação segura, persistência de dados serverless e uma interface otimizada com foco em experiência do usuário (UX) e velocidade.

---

## ⚙️ Tecnologias

* **Next.js 15** – Framework React com App Router e Server Components otimizados.
* **Neon Postgres** – Banco de dados PostgreSQL Serverless com escalabilidade instantânea.
* **Clerk** – Autenticação completa e gestão de usuários.
* **@dnd-kit** – Primitivas de arrastar e soltar leves e altamente customizáveis.
* **TailwindCSS v4** – Motor de estilização moderno utilizando variáveis OKLCH.
* **TypeScript** – Garantia de tipagem estática e segurança no código.

---

## ⚡ Funcionalidades

* 📋 **Quadros e Colunas** – Crie múltiplos quadros de projeto e defina colunas personalizadas.
* ➕ **Tarefas Dinâmicas** – Adicione, edite e remova tarefas com títulos, descrições e prioridades.
* 🔄 **Arrastar e Soltar** – Reordene tarefas dentro de colunas ou mova-as entre estados com animações fluidas.
* 🔍 **Filtragem Avançada** – Busca instantânea e filtros por prioridade (Urgente, Médio, Baixo), data e autor.
* 🎨 **Design de App Nativo** – Seleção de texto bloqueada globalmente para evitar distrações durante o uso do Kanban.
* 🔐 **Autenticação Segura** – Proteção completa de rotas e dados privados via Clerk.

---

## 👌 Início Rápido

### Pré-requisitos

* **[Node.js](https://nodejs.org/)** (Recomendado v18.17 ou superior)
* **[Conta no Neon](https://neon.tech/)** (Para obter a DATABASE_URL)
* **[Conta no Clerk](https://clerk.com/)** (Para as chaves de autenticação)

### Clonar e Rodar


#### Clone o repositório

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/atrelator.git](https://github.com/seu-usuario/atrelator.git)

# Entre no diretório
cd atrelator

# Instale as dependências
npm install
 ```

1. Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais:

```env
DATABASE_URL="postgresql://usuario:senha@ep-id-projeto.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_chave_publica
CLERK_SECRET_KEY=sua_chave_secreta
 ```
2. Sincronize o banco de dados:

```bash
npx prisma db push
 ```
3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
 ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
   
---

## 🗄️ Configuração do Banco de Dados

Para preparar seu banco de dados no __Neon Postgres__, você pode utilizar os seguintes comandos no Editor SQL:

```sql
-- Criar tabela de Quadros (Boards)
CREATE TABLE IF NOT EXISTS public.boards (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title       TEXT NOT NULL,
  user_id     TEXT NOT NULL
);

-- Criar tabela de Colunas
CREATE TABLE IF NOT EXISTS public.columns (
  id          SERIAL PRIMARY KEY,
  board_id    INT REFERENCES public.boards(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
);

-- Criar tabela de Tarefas (Tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT DEFAULT 'baixa',
  column_id   INT REFERENCES public.columns(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL
);

-- Índices para otimização de busca
CREATE INDEX idx_boards_user ON public.boards(user_id);
CREATE INDEX idx_tasks_column ON public.tasks(column_id);
 ```
---

## 🔗 Links Úteis

* [Next.js Docs](https://nextjs.org/docs)
* [Neon Docs](https://neon.com/docs/introduction)
* [Clerk Docs](https://clerk.com/docs)
* [dnd-kit Docs](https://docs.dndkit.com/)
* [Tailwind CSS Docs](https://tailwindcss.com/docs)
* [Vercel](https://vercel.com/)

---

<p align="center">Desenvolvido com ❤️ por <strong>Satochy</strong></p>
