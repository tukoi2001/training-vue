# Project Management Dashboard

A modern project management dashboard built with Vue 3, TypeScript, Pinia, and Vue Router.

## Features

- 🎯 Kanban board with drag and drop
- 📱 Responsive design
- 🎨 Modern UI with smooth animations
- 🔄 Real-time project status updates
- 📊 Multiple views (Dashboard, Projects, Tasks, Calendar, etc.)

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Pinia (State Management)
- Vue Router
- Vite

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Header.vue
│   ├── Sidebar.vue
│   ├── ProjectCard.vue
│   └── ProjectColumn.vue
├── stores/           # Pinia stores
│   └── projectStore.ts
├── types/            # TypeScript types
│   └── index.ts
├── views/            # Route views
│   ├── ProjectsView.vue
│   ├── DashboardView.vue
│   └── ...
├── router/           # Vue Router config
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
```
