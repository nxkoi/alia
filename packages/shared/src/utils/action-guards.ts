/**
 * Utility functions for AIDE application
 */

import type { DestructiveAction, ActionGuard } from '../types/ui';

/**
 * Action guards for destructive operations
 */
export const ACTION_GUARDS: Record<DestructiveAction, ActionGuard> = {
  delete: {
    action: 'delete',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
  },
  archive: {
    action: 'archive',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to archive this item?',
  },
  clear: {
    action: 'clear',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to clear all items? This action cannot be undone.',
  },
  reset: {
    action: 'reset',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to reset? All unsaved changes will be lost.',
  },
};

/**
 * Check if an action requires confirmation
 */
export function requiresConfirmation(action: DestructiveAction): boolean {
  return ACTION_GUARDS[action].requiresConfirmation;
}

/**
 * Get confirmation message for an action
 */
export function getConfirmationMessage(action: DestructiveAction): string {
  return ACTION_GUARDS[action].confirmationMessage;
}
