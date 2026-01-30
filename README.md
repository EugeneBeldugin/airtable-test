# Airtable Clone

High-performance table with 50,000 rows and realtime synchronization.

## Quick Start
```bash
docker-compose up --build
```

Open http://localhost:5173

## Architecture
```
Frontend (React + TanStack Virtual + Socket.io)
    │
    ▼
Nginx (Load Balancer)
    │
    ├── Backend Node 1 ──┐
    │                    ├── Redis (pub/sub)
    └── Backend Node 2 ──┘
                              │
                              ▼
                         PostgreSQL
```

### Frontend Structure (Feature-Sliced Design)
```
src/
├── app/          # App entry, providers, global styles
├── entities/     # Business entities (Row)
├── features/     # User interactions (edit-cell, realtime-sync)
├── widgets/      # Composite UI blocks (DataTable)
└── shared/       # Reusable UI components, config, API client
```

## Tech Stack

- **Frontend:** React, TanStack Query, TanStack Virtual, Socket.io, CSS Modules
- **Backend:** Fastify, Socket.io + Redis Adapter
- **Database:** PostgreSQL

## Features

- ✅ Virtualized rendering of 50k rows
- ✅ Inline editing (text, number, select, boolean, date)
- ✅ Optimistic updates
- ✅ Realtime sync via WebSocket
- ✅ Multi-node support via Redis adapter

## Trade-offs

1. **Single fetch vs pagination** — loads all 50k rows at once (~25MB JSON). Simpler for realtime sync, but higher initial load time.

2. **No sorting/filtering** — focused on virtualization and realtime. Easy to add via TanStack Table API.

3. **Fixed column widths** — simplifies virtualization. Resizable columns would require additional complexity.