/**
 * Supabase database types for AIDE application
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
          preferences: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          preferences?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          preferences?: Record<string, unknown>;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          due_date: string | null;
          estimated_duration: number | null;
          actual_duration: number | null;
          tags: string[];
          parent_task_id: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          due_date?: string | null;
          estimated_duration?: number | null;
          actual_duration?: number | null;
          tags?: string[];
          parent_task_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          due_date?: string | null;
          estimated_duration?: number | null;
          actual_duration?: number | null;
          tags?: string[];
          parent_task_id?: string | null;
          metadata?: Record<string, unknown>;
        };
      };
      ai_actions: {
        Row: {
          id: string;
          type: string;
          description: string;
          payload: Record<string, unknown>;
          requires_approval: boolean;
          approval_status: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          type: string;
          description: string;
          payload: Record<string, unknown>;
          requires_approval?: boolean;
          approval_status?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          type?: string;
          description?: string;
          payload?: Record<string, unknown>;
          requires_approval?: boolean;
          approval_status?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];
