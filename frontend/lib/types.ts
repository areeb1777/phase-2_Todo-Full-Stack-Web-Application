// Task type definition for the Todo application
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export type TasksCollection = Task[];

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

// Chat-related types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string; // ISO string format
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls: Array<{
    id: string;
    function: {
      name: string;
      arguments: string;
    };
    type: string;
  }>;
  success: boolean;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}