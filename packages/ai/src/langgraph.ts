/**
 * LangGraph workflow implementation with human-in-the-loop
 * This ensures AI actions require approval before execution
 */

import type {
  LangGraphState,
  LangGraphConfig,
  AIAction,
  HumanApprovalRequest,
  HumanApprovalResponse,
  AIActionType,
} from '@aide/shared';

/**
 * Default configuration for LangGraph
 * Human-in-the-loop is ALWAYS enabled for safety
 */
export const DEFAULT_LANGGRAPH_CONFIG: LangGraphConfig = {
  enableHumanInTheLoop: true,
  autoApproveThreshold: 0, // Never auto-approve by default
  approvalTimeout: 300000, // 5 minutes
};

/**
 * Actions that MUST require human approval
 * These are destructive or have external effects
 */
const REQUIRED_APPROVAL_ACTIONS: AIActionType[] = [
  'create_task',
  'send_email',
  'delete_task',
  'schedule_event',
];

/**
 * Check if an action requires human approval
 */
export function requiresHumanApproval(
  actionType: AIActionType,
  confidence: number,
  config: LangGraphConfig = DEFAULT_LANGGRAPH_CONFIG
): boolean {
  // Always require approval for specific actions
  if (REQUIRED_APPROVAL_ACTIONS.includes(actionType)) {
    return true;
  }

  // Check confidence threshold
  if (confidence < config.autoApproveThreshold) {
    return true;
  }

  // If human-in-the-loop is enabled, require approval
  return config.enableHumanInTheLoop;
}

/**
 * Create a human approval request
 */
export function createApprovalRequest(
  action: AIAction,
  expiresIn: number = DEFAULT_LANGGRAPH_CONFIG.approvalTimeout
): HumanApprovalRequest {
  return {
    id: action.id,
    actionType: action.type,
    description: action.description,
    details: action.payload,
    createdAt: action.createdAt,
    expiresAt: new Date(Date.now() + expiresIn),
  };
}

/**
 * LangGraph workflow state management
 */
export class LangGraphWorkflow {
  private state: LangGraphState;
  private config: LangGraphConfig;
  private approvalCallbacks: Map<string, (response: HumanApprovalResponse) => void> = new Map();

  constructor(userId: string, config: LangGraphConfig = DEFAULT_LANGGRAPH_CONFIG) {
    this.state = {
      userId,
      currentStep: 'idle',
      pendingApprovals: [],
      history: [],
      context: {},
    };
    this.config = config;
  }

  /**
   * Request an AI action with human-in-the-loop
   */
  async requestAction(action: AIAction, confidence: number = 0): Promise<AIAction> {
    const needsApproval = requiresHumanApproval(action.type, confidence, this.config);

    if (needsApproval) {
      action.requiresApproval = true;
      action.approvalStatus = 'pending';

      const approvalRequest = createApprovalRequest(action, this.config.approvalTimeout);
      this.state.pendingApprovals.push(approvalRequest);

      // Wait for human approval
      const response = await this.waitForApproval(approvalRequest.id);

      if (response.approved) {
        action.approvalStatus = 'approved';
      } else {
        action.approvalStatus = 'rejected';
      }
    } else {
      action.requiresApproval = false;
      action.approvalStatus = 'approved';
    }

    this.state.history.push(action);
    return action;
  }

  /**
   * Wait for human approval
   */
  private waitForApproval(requestId: string): Promise<HumanApprovalResponse> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.approvalCallbacks.delete(requestId);
        reject(new Error('Approval request timed out'));
      }, this.config.approvalTimeout);

      this.approvalCallbacks.set(requestId, (response: HumanApprovalResponse) => {
        clearTimeout(timeout);
        this.approvalCallbacks.delete(requestId);
        resolve(response);
      });
    });
  }

  /**
   * Submit approval response
   */
  submitApproval(response: HumanApprovalResponse): void {
    const callback = this.approvalCallbacks.get(response.requestId);
    if (callback) {
      callback(response);
      // Remove from pending approvals
      this.state.pendingApprovals = this.state.pendingApprovals.filter(
        (req) => req.id !== response.requestId
      );
    }
  }

  /**
   * Get current state
   */
  getState(): LangGraphState {
    return { ...this.state };
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals(): HumanApprovalRequest[] {
    return [...this.state.pendingApprovals];
  }
}
