# Mr. AI

A modern, AI-powered productivity assistant that brings practical AI tools into one clean workspace. Mr. AI helps users write professional emails, plan tasks, and have focused conversations with an intelligent assistant.

This project was built with [Lovable](https://lovable.dev).

## Project Overview

Mr. AI is designed to help users move from an idea or request to a useful result with minimal effort. The application combines communication, planning, and conversation in a single accessible interface. Users provide structured inputs and preferences, and a secure server-side endpoint forwards the request to an AI service. The generated response is returned to the interface where it can be reviewed, edited, copied, or saved.

The app features a professional light/dark theme with a sky-blue dashboard background, clean indigo/purple brand accents, a collapsible sidebar, and a bold Mr. AI background logo positioned on the right-hand side of the hero section.

## Features

- **Smart Email Generator** — Compose professional emails from prompts with tone and context controls. Editable drafts let you refine the output before using it.
- **AI Task Planner** — Turn goals into structured task plans. Preview and edit generated plans to fit your workflow.
- **AI Chat Bot** — Have focused conversations with an AI assistant. Messages are editable for iterative refinement.
- **Sidebar Navigation** — Collapsible, responsive sidebar with quick access to Email, Tasks, Chat, and Dashboard.
- **Light / Dark Mode** — Persistent theme toggle that keeps the sky-blue and purple/indigo branding consistent across both modes.
- **Professional Dashboard** — Clean hero section with feature cards, stats, and a branded background logo.
- **Responsible AI Disclaimer** — Visible reminder that AI outputs should be reviewed and verified before use.
- **Responsive Design** — Works across desktop, tablet, and mobile viewports.

## Tools Used

- **Framework:** [TanStack Start](https://tanstack.com/start) with React 19 and file-based routing
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 with custom OKLCH color tokens
- **UI Components:** Radix UI primitives + shadcn/ui component patterns
- **State & Data:** TanStack Query, React Hook Form, Zod validation
- **AI Backend:** Lovable AI Gateway (server-side `createServerFn` calls)
- **Icons:** Lucide React
- **Language:** TypeScript
- **Linting & Formatting:** ESLint, Prettier

## Setup Instructions

### Prerequisites

- Node.js (LTS recommended) — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun

### Local Development

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The dev server will start on `http://localhost:8080` by default.

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Lint & Format

```sh
npm run lint
npm run format
```

## How It Works

1. The user selects the Email Generator, Task Planner, or AI Chat from the sidebar.
2. The application collects the user's prompt and relevant preferences.
3. A secure server-side endpoint sends the request to the AI service.
4. The generated response is returned to the interface.
5. The user can review, edit, copy, or save the result.

## Project Goal

Mr. AI provides a focused AI productivity experience by combining communication, planning, and conversation in one accessible web application. Its goal is to help users move from an idea or request to a useful result with minimal effort.

## URL: https://think-compose-assist.lovable.app




