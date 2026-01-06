/**
 * Task types for AIDE application
 */

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  estimatedDuration: number | null; // in minutes
  actualDuration: number | null; // in minutes
  tags: string[];
  parentTaskId: string | null;
  metadata: TaskMetadata;
}

export interface TaskMetadata {
  aiGenerated: boolean;
  source: 'user' | 'ai' | 'email' | 'integration';
  requiresApproval?: boolean;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedDuration?: number;
  tags?: string[];
  parentTaskId?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  tags?: string[];
}
