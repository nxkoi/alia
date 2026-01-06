# Architecture Documentation

## Overview

AIDE is built as a monorepo using pnpm workspaces, with shared types defined centrally and consumed by multiple applications.

## Core Principles

### 1. Define Types in Shared Package FIRST

**Why**: Prevents type duplication and ensures consistency across all applications.

**Implementation**:
- All types live in `packages/shared/src/types/`
- Applications import types from `@aide/shared`
- Database types mirror Supabase schema

**Example**:
```typescript
// packages/shared/src/types/task.ts
export interface Task {
  id: string;
  title: string;
  // ... other fields
}

// apps/web/src/components/TaskList.tsx
import type { Task } from '@aide/shared';
```

### 2. Invisible Interface

**Why**: Reduces visual clutter and cognitive load for users with ADHD.

**Implementation**:
- Actions are hidden by default
- Actions appear on hover with smooth transitions
- Maximum whitespace in all layouts
- Minimal visual elements

**CSS Pattern**:
```css
.hover-actions {
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease;
}

.hoverable-item:hover .hover-actions {
  opacity: 1;
  visibility: visible;
}
```

### 3. Human-in-the-Loop AI

**Why**: Ensures users maintain control and prevents unwanted AI actions.

**Implementation**:
- All task creation requires approval
- All email sending requires approval
- Approval requests have timeouts
- Clear approval UI

**Workflow**:
```
AI suggests action → Create approval request → Show to user → 
User approves/rejects → Execute/cancel action
```

### 4. Safety by Default

**Why**: Prevents accidental data loss and user frustration.

**Implementation**:
- Action guards for destructive operations
- Confirmation dialogs with clear messaging
- No auto-confirm options
- Visual indicators for dangerous actions

**Action Guards**:
```typescript
const ACTION_GUARDS = {
  delete: {
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure? This cannot be undone.'
  }
}
```

### 5. Strict TypeScript

**Why**: Catches errors at compile time, improves code quality and maintainability.

**Configuration**:
- `strict: true` in all tsconfig files
- No `any` types allowed
- Explicit return types encouraged
- Full type coverage

## Package Structure

### `packages/shared`

Contains all shared types, utilities, and validation logic.

**Exports**:
- `types/` - Type definitions
- `utils/` - Shared utilities
  - `action-guards.ts` - Safety guards for destructive actions
  - `validators.ts` - Input validation functions

### `packages/ai`

LangGraph integration with human-in-the-loop implementation.

**Key Components**:
- `LangGraphWorkflow` - Main workflow class
- `requiresHumanApproval()` - Approval logic
- `createApprovalRequest()` - Request creation

### `apps/web`

React web application built with Vite.

**Key Features**:
- Supabase integration
- Invisible interface UI
- Task management
- Approval UI for AI actions

### `apps/desktop`

Electron desktop application (to be implemented).

### `apps/mobile`

React Native mobile application (to be implemented).

## Data Flow

### Task Creation (User)
```
User input → Validation → Supabase → Update UI
```

### Task Creation (AI)
```
AI suggestion → Create approval request → Show dialog →
User approves → Validation → Supabase → Update UI
```

### Destructive Action
```
User clicks delete → Show confirmation → User confirms →
Execute action → Update backend → Update UI
```

## Type System

### Database Types

Mirror Supabase schema exactly:
```typescript
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: { /* matches DB columns */ },
        Insert: { /* for INSERT operations */ },
        Update: { /* for UPDATE operations */ }
      }
    }
  }
}
```

### Application Types

Business logic types built on top of database types:
```typescript
export interface Task {
  // Matches database but uses camelCase and Date objects
  id: string;
  createdAt: Date; // vs created_at in DB
}
```

## Security Considerations

1. **No Secrets in Code**: Use environment variables
2. **Input Validation**: All user input is validated
3. **SQL Injection**: Prevented by Supabase client
4. **XSS**: React escapes by default
5. **CSRF**: Supabase handles tokens

## Performance Considerations

1. **Code Splitting**: Vite handles automatically
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Database Indexes**: Define in Supabase

## Future Enhancements

1. Real-time subscriptions for tasks
2. Offline support
3. Push notifications
4. Calendar integration
5. Email integration
6. Advanced AI features
