# AIDE - ADHD Focus Application

A monorepo project designed to help individuals with ADHD focus and manage tasks effectively using AI assistance with human oversight.

## Stack

- **Frontend**: React (Web), Electron (Desktop), React Native (Mobile)
- **Backend**: Supabase
- **AI**: LangGraph.js with human-in-the-loop
- **Language**: Strict TypeScript
- **Package Manager**: pnpm

## Architecture Principles

### 1. Invisible Interface
Actions (edit/delete) appear **ONLY** on hover to maximize whitespace and minimize distractions. This design philosophy helps reduce cognitive load for users with ADHD.

### 2. Shared Types First
All types are defined in `packages/shared` **FIRST** to avoid duplication and ensure consistency across all applications.

### 3. Human-in-the-Loop AI
All AI actions that create tasks or send emails **MUST** pause for human approval before execution. This is enforced by the LangGraph workflow implementation.

### 4. Safety by Default
No destructive actions (delete, archive, clear, reset) can be performed without explicit user confirmation.

### 5. Strict TypeScript
All code uses strict TypeScript with no implicit any, ensuring type safety throughout the application.

## Project Structure

```
alia/
├── apps/
│   ├── web/          # React web application (Vite)
│   ├── desktop/      # Electron desktop application
│   └── mobile/       # React Native mobile application
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── ai/           # LangGraph AI integration
├── package.json      # Root package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter @aide/web dev
pnpm --filter @aide/desktop dev
pnpm --filter @aide/mobile dev

# Type check all packages
pnpm type-check
```

### Environment Setup

1. Copy `.env.example` to `.env` in each app directory
2. Configure Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Key Features

### Invisible Interface Pattern

The UI implements an "invisible interface" where actions only appear on hover:

```tsx
<HoverableItem
  actions={[
    { id: 'edit', label: 'Edit', onClick: handleEdit },
    { id: 'delete', label: 'Delete', onClick: handleDelete, variant: 'danger' }
  ]}
>
  <TaskContent />
</HoverableItem>
```

### Type-Safe Database Access

All database types are defined in `packages/shared/src/types/database.ts`:

```typescript
import type { Database } from '@aide/shared';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(url, key);
```

### Human-in-the-Loop AI

AI actions require explicit approval:

```typescript
import { LangGraphWorkflow } from '@aide/ai';

const workflow = new LangGraphWorkflow(userId);

// This will pause and wait for human approval
const action = await workflow.requestAction({
  type: 'create_task',
  description: 'Create a new task based on email',
  payload: taskData,
  // ... other fields
});
```

### Safety Guards

Destructive actions require confirmation:

```typescript
import { requiresConfirmation, getConfirmationMessage } from '@aide/shared';

if (requiresConfirmation('delete')) {
  showDialog(getConfirmationMessage('delete'));
}
```

## Development Guidelines

### Adding New Types

1. Define types in `packages/shared/src/types/`
2. Export from `packages/shared/src/types/index.ts`
3. Use in applications via `import { Type } from '@aide/shared'`

### Creating Components

1. Follow the invisible interface pattern
2. Use hover actions for edit/delete operations
3. Implement confirmation dialogs for destructive actions
4. Maximize whitespace in layouts

### AI Integration

1. All AI actions that create or modify data MUST use human-in-the-loop
2. Define action types in `packages/shared/src/types/ai.ts`
3. Implement approval UI in each application
4. Never auto-approve task creation or email sending

## Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Run all apps in development mode
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build artifacts
- `pnpm lint` - Lint all packages (when configured)

## Contributing

When contributing to this project:

1. Define types in `packages/shared` first
2. Follow the invisible interface pattern for UI
3. Ensure all AI actions use human-in-the-loop
4. Add confirmation dialogs for destructive actions
5. Use strict TypeScript (no `any` types)
6. Write meaningful commit messages

## License

Private project - All rights reserved