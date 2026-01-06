# Development Guide

## Getting Started

### 1. Prerequisites

Install the required tools:
- Node.js 18+ ([download](https://nodejs.org/))
- pnpm 8+ (`npm install -g pnpm`)
- Git

### 2. Clone and Setup

```bash
git clone <repository-url>
cd alia
pnpm install
```

### 3. Environment Configuration

Create `.env` files in each app directory:

**apps/web/.env:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Build Packages

Build shared packages first:
```bash
pnpm --filter @aide/shared build
pnpm --filter @aide/ai build
```

### 5. Run Development Server

```bash
# Run web app
pnpm --filter @aide/web dev

# Or run all apps
pnpm dev
```

## Project Rules

### Rule 1: UI - Invisible Interface

**Actions (edit/delete) appear ONLY on hover. Max whitespace.**

✅ DO:
```tsx
<HoverableItem actions={[
  { id: 'edit', label: 'Edit', onClick: handleEdit },
  { id: 'delete', label: 'Delete', onClick: handleDelete }
]}>
  <TaskContent />
</HoverableItem>
```

❌ DON'T:
```tsx
// Don't show buttons by default
<TaskContent>
  <button>Edit</button>
  <button>Delete</button>
</TaskContent>
```

### Rule 2: Architecture - Define Types in `packages/shared` FIRST

**Don't duplicate types. Define once, use everywhere.**

✅ DO:
```typescript
// packages/shared/src/types/task.ts
export interface Task {
  id: string;
  title: string;
}

// apps/web/src/components/TaskList.tsx
import type { Task } from '@aide/shared';
```

❌ DON'T:
```typescript
// Don't redefine types in each app
interface Task {
  id: string;
  title: string;
}
```

### Rule 3: AI - Use LangGraph.js with Human-in-the-Loop

**Must use "Human-in-the-loop" (pause for approval) before creating tasks/sending emails.**

✅ DO:
```typescript
import { LangGraphWorkflow } from '@aide/ai';

const workflow = new LangGraphWorkflow(userId);

// This PAUSES and waits for approval
const action = await workflow.requestAction({
  id: generateId(),
  type: 'create_task',
  description: 'Create task from email',
  payload: taskData,
  requiresApproval: true,
  approvalStatus: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
}, confidence);
```

❌ DON'T:
```typescript
// Don't create tasks without approval
await createTask(taskData); // NO APPROVAL!
```

### Rule 4: Safety - No Destructive Actions Without Confirm

**Always require confirmation for delete/archive/clear/reset.**

✅ DO:
```typescript
import { requiresConfirmation, getConfirmationMessage } from '@aide/shared';

const handleDelete = (id: string) => {
  if (requiresConfirmation('delete')) {
    showConfirmDialog({
      title: 'Delete Task',
      message: getConfirmationMessage('delete'),
      onConfirm: () => deleteTask(id),
    });
  }
};
```

❌ DON'T:
```typescript
// Don't delete without confirmation
const handleDelete = (id: string) => {
  deleteTask(id); // NO CONFIRMATION!
};
```

### Rule 5: Code - Strict TypeScript

**Use strict TypeScript. No `any` types.**

✅ DO:
```typescript
function processTask(task: Task): TaskResult {
  return {
    success: true,
    task,
  };
}
```

❌ DON'T:
```typescript
// Don't use any
function processTask(task: any): any {
  return task;
}
```

## Common Tasks

### Adding a New Type

1. Create type in `packages/shared/src/types/`
2. Export from `packages/shared/src/types/index.ts`
3. Rebuild shared package: `pnpm --filter @aide/shared build`
4. Use in apps: `import { MyType } from '@aide/shared'`

### Creating a Component with Hover Actions

```tsx
import { HoverableItem } from './HoverableItem';
import type { HoverAction } from '@aide/shared';

function MyComponent() {
  const actions: HoverAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      onClick: handleEdit,
      variant: 'primary',
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <HoverableItem actions={actions}>
      <div>Content here</div>
    </HoverableItem>
  );
}
```

### Implementing AI Actions with Approval

```typescript
import { LangGraphWorkflow } from '@aide/ai';
import type { AIAction } from '@aide/shared';

// 1. Create workflow
const workflow = new LangGraphWorkflow(userId);

// 2. Create action
const action: AIAction = {
  id: generateId(),
  type: 'create_task',
  description: 'AI wants to create a task',
  payload: taskData,
  requiresApproval: true,
  approvalStatus: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
};

// 3. Request with confidence score
const approvedAction = await workflow.requestAction(action, 0.7);

// 4. Check if approved
if (approvedAction.approvalStatus === 'approved') {
  // Execute the action
  await createTask(approvedAction.payload);
}
```

### Validating User Input

```typescript
import { validateTaskInput } from '@aide/shared';

function handleSubmit(input: TaskInput) {
  const validation = validateTaskInput(input);
  
  if (!validation.valid) {
    showErrors(validation.errors);
    return;
  }
  
  // Proceed with valid input
  createTask(input);
}
```

## Troubleshooting

### Type errors when importing from @aide/shared

Solution: Rebuild the shared package
```bash
pnpm --filter @aide/shared build
```

### Changes in shared types not reflected in apps

Solution: Rebuild shared package and restart dev server
```bash
pnpm --filter @aide/shared build
pnpm --filter @aide/web dev
```

### Import errors in TypeScript

Check that:
1. Package is built (`pnpm build`)
2. tsconfig.json has correct references
3. Package.json has correct workspace dependencies

## Testing

Currently no test infrastructure is set up. When adding tests:

1. Use same testing framework across packages
2. Test type validation functions
3. Test action guards
4. Test AI approval workflow
5. Test UI components

## Code Review Checklist

Before submitting code:

- [ ] Types defined in `packages/shared` (not duplicated)
- [ ] Strict TypeScript (no `any` types)
- [ ] Hover actions for edit/delete in UI
- [ ] Confirmation dialogs for destructive actions
- [ ] AI actions use human-in-the-loop
- [ ] Input validation used
- [ ] Maximum whitespace in layouts
- [ ] No secrets in code
