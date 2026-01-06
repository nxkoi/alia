/**
 * Validation utilities for AIDE application
 */

import type { TaskInput, TaskUpdate } from '../types/task';
import type { AITaskCreationRequest, AIEmailRequest } from '../types/ai';

/**
 * Validate task input
 */
export function validateTaskInput(input: TaskInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (input.title && input.title.length > 500) {
    errors.push('Task title must be less than 500 characters');
  }

  if (input.estimatedDuration !== undefined && input.estimatedDuration < 0) {
    errors.push('Estimated duration must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate task update
 */
export function validateTaskUpdate(update: TaskUpdate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (update.title !== undefined && update.title.trim().length === 0) {
    errors.push('Task title cannot be empty');
  }

  if (update.title !== undefined && update.title.length > 500) {
    errors.push('Task title must be less than 500 characters');
  }

  if (update.estimatedDuration !== undefined && update.estimatedDuration < 0) {
    errors.push('Estimated duration must be a positive number');
  }

  if (update.actualDuration !== undefined && update.actualDuration < 0) {
    errors.push('Actual duration must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate AI task creation request
 */
export function validateAITaskCreationRequest(
  request: AITaskCreationRequest
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.taskInput.title || request.taskInput.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (request.confidence < 0 || request.confidence > 1) {
    errors.push('Confidence must be between 0 and 1');
  }

  if (!request.context || request.context.trim().length === 0) {
    errors.push('Context is required for AI task creation');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate AI email request
 */
export function validateAIEmailRequest(request: AIEmailRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.to || request.to.length === 0) {
    errors.push('At least one recipient is required');
  }

  if (!request.subject || request.subject.trim().length === 0) {
    errors.push('Email subject is required');
  }

  if (!request.body || request.body.trim().length === 0) {
    errors.push('Email body is required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allEmails = [...request.to, ...(request.cc || [])];
  const invalidEmails = allEmails.filter((email) => !emailRegex.test(email));

  if (invalidEmails.length > 0) {
    errors.push(`Invalid email addresses: ${invalidEmails.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
