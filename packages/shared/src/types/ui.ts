/**
 * UI and interaction types for AIDE application
 * Implements "Invisible Interface" pattern
 */

export interface HoverAction {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void | Promise<void>;
  variant?: 'default' | 'danger' | 'primary';
}

export interface InvisibleUIConfig {
  hoverDelay: number; // milliseconds before showing actions
  fadeInDuration: number; // milliseconds for fade-in animation
  maxActions: number; // maximum number of actions to show
}

export interface ConfirmationDialog {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export type DestructiveAction = 'delete' | 'archive' | 'clear' | 'reset';

export interface ActionGuard {
  action: DestructiveAction;
  requiresConfirmation: boolean;
  confirmationMessage: string;
}
