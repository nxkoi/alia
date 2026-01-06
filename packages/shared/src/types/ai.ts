/**
 * AI and LangGraph types for AIDE application
 * Includes human-in-the-loop workflow types
 */

export type AIActionType = 'create_task' | 'send_email' | 'schedule_event' | 'update_task' | 'delete_task';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AIAction {
  id: string;
  type: AIActionType;
  description: string;
  payload: unknown;
  requiresApproval: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AITaskCreationRequest {
  taskInput: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: Date;
    estimatedDuration?: number;
  };
  context: string;
  confidence: number; // 0-1
}

export interface AIEmailRequest {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  attachments?: string[];
  context: string;
}

export interface HumanApprovalRequest {
  id: string;
  actionType: AIActionType;
  description: string;
  details: unknown;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface HumanApprovalResponse {
  requestId: string;
  approved: boolean;
  feedback?: string;
  timestamp: Date;
}

export interface LangGraphState {
  userId: string;
  currentStep: string;
  pendingApprovals: HumanApprovalRequest[];
  history: AIAction[];
  context: Record<string, unknown>;
}

export interface LangGraphConfig {
  enableHumanInTheLoop: boolean;
  autoApproveThreshold: number; // confidence threshold for auto-approval (0-1)
  approvalTimeout: number; // in milliseconds
}
