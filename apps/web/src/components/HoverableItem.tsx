import React from 'react';
import type { HoverAction } from '@aide/shared';

interface HoverableItemProps {
  children: React.ReactNode;
  actions: HoverAction[];
}

export function HoverableItem({ children, actions }: HoverableItemProps) {
  return (
    <div className="hoverable-item">
      {children}
      <div className="hover-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-button ${action.variant || 'default'}`}
            onClick={action.onClick}
          >
            {action.icon && <span>{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
