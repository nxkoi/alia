# AIDE Quick Reference

## Five Rules

1. **UI: Invisible Interface** - Actions appear ONLY on hover. Max whitespace.
2. **Arch: Types in `packages/shared` FIRST** - Don't duplicate.
3. **AI: Human-in-the-loop** - Pause for approval before creating tasks/sending emails.
4. **Safety: No destructive actions without confirm** - Always confirm delete/archive/clear/reset.
5. **Code: Strict TypeScript** - No `any` types.

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm --filter @aide/shared build

# Run web app
pnpm --filter @aide/web dev

# Type check
pnpm type-check

# Clean build artifacts
pnpm clean
```

## Package Structure

```
packages/shared/
  ├── types/          # All type definitions
  │   ├── user.ts
  │   ├── task.ts
  │   ├── ai.ts
  │   ├── ui.ts
  │   └── database.ts
  └── utils/          # Shared utilities
      ├── action-guards.ts
      └── validators.ts

packages/ai/
  └── langgraph.ts    # AI workflow with human-in-the-loop

apps/web/
  ├── components/     # React components
  ├── lib/           # Client libraries (Supabase)
  └── styles/        # CSS (Invisible Interface)
```

## Quick Examples

### Import Types
```typescript
import type { Task, User, AIAction } from '@aide/shared';
```

### Hover Actions Component
```tsx
<HoverableItem
  actions={[
    { id: 'edit', label: 'Edit', onClick: handleEdit, variant: 'primary' },
    { id: 'delete', label: 'Delete', onClick: handleDelete, variant: 'danger' }
  ]}
>
  <Content />
</HoverableItem>
```

### Confirmation Dialog
```tsx
<ConfirmationDialog
  title="Delete Task"
  message="Are you sure? This cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

### AI with Approval
```typescript
import { LangGraphWorkflow } from '@aide/ai';

const workflow = new LangGraphWorkflow(userId);
const action = await workflow.requestAction(aiAction, confidence);

if (action.approvalStatus === 'approved') {
  executeAction(action);
}
```

### Validation
```typescript
import { validateTaskInput } from '@aide/shared';

const result = validateTaskInput(input);
if (!result.valid) {
  showErrors(result.errors);
}
```

### Action Guards
```typescript
import { requiresConfirmation, getConfirmationMessage } from '@aide/shared';

if (requiresConfirmation('delete')) {
  const message = getConfirmationMessage('delete');
  showDialog(message);
}
```

## Environment Variables

**apps/web/.env:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create Supabase project
2. Run `docs/supabase-schema.sql` in SQL editor
3. Get URL and anon key from Settings → API
4. Add to `.env` files

## TypeScript Config

All configs extend `tsconfig.base.json` with:
- `strict: true` ✅
- `noImplicitAny: true` ✅
- `strictNullChecks: true` ✅
- All strict options enabled ✅

## CSS Variables

```css
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 2rem;
--spacing-lg: 4rem;
--spacing-xl: 6rem;

--color-danger: #dc2626;
--color-primary: #2563eb;
```

## Need Help?

1. Check `docs/DEVELOPMENT.md` for detailed guides
2. Check `docs/ARCHITECTURE.md` for design decisions
3. Check `README.md` for overview
