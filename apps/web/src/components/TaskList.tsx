import React, { useState } from 'react';
import type { Task } from '@aide/shared';
import { HoverableItem } from './HoverableItem';
import { ConfirmationDialog } from './ConfirmationDialog';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive docs for the new API',
      status: 'in_progress',
      priority: 'high',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      estimatedDuration: 120,
      actualDuration: null,
      tags: ['documentation', 'api'],
      parentTaskId: null,
      metadata: {
        aiGenerated: false,
        source: 'user',
      },
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: null,
      status: 'todo',
      priority: 'medium',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      estimatedDuration: 30,
      actualDuration: null,
      tags: ['review'],
      parentTaskId: null,
      metadata: {
        aiGenerated: true,
        source: 'ai',
        requiresApproval: true,
      },
    },
  ]);

  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; taskId: string | null }>({
    show: false,
    taskId: null,
  });

  const handleEdit = (taskId: string) => {
    console.log('Edit task:', taskId);
    // Implementation would open an edit modal
  };

  const handleDelete = (taskId: string) => {
    setDeleteDialog({ show: true, taskId });
  };

  const confirmDelete = () => {
    if (deleteDialog.taskId) {
      setTasks(tasks.filter((task) => task.id !== deleteDialog.taskId));
    }
    setDeleteDialog({ show: false, taskId: null });
  };

  const cancelDelete = () => {
    setDeleteDialog({ show: false, taskId: null });
  };

  return (
    <div className="task-list">
      <h2 style={{ marginBottom: '2rem', fontWeight: 300 }}>Tasks</h2>
      {tasks.map((task) => (
        <HoverableItem
          key={task.id}
          actions={[
            {
              id: 'edit',
              label: 'Edit',
              onClick: () => handleEdit(task.id),
              variant: 'primary',
            },
            {
              id: 'delete',
              label: 'Delete',
              onClick: () => handleDelete(task.id),
              variant: 'danger',
            },
          ]}
        >
          <div>
            <h3 style={{ fontWeight: 400, marginBottom: '0.5rem' }}>{task.title}</h3>
            {task.description && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {task.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
              <span>Priority: {task.priority}</span>
              <span>Status: {task.status}</span>
              {task.metadata.aiGenerated && <span style={{ color: 'var(--color-primary)' }}>🤖 AI</span>}
            </div>
          </div>
        </HoverableItem>
      ))}

      {deleteDialog.show && (
        <ConfirmationDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
