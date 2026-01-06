/**
 * Core user types for AIDE application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  focusMode: FocusModeSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  focusReminders: boolean;
}

export interface FocusModeSettings {
  defaultDuration: number; // in minutes
  breakDuration: number; // in minutes
  autoStartBreaks: boolean;
}
