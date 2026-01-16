// API service for interacting with the backend Todo API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

// Helper functions for token management
const TOKEN_KEY = 'todo_app_token';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string; // ISO string format
  user_id: string; // Include user_id to show which user owns the task
}

export interface CreateTodoData {
  title: string;
  description?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  profile_picture?: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Retry mechanism helper function
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);

      // If the response is successful, return it
      if (response.ok) {
        return response;
      }

      // If it's the last attempt, throw the error
      if (i === retries) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    } catch (error) {
      lastError = error as Error;

      // If it's the last attempt, throw the error
      if (i === retries) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  // This line should never be reached, but TypeScript requires it
  throw lastError || new Error('Unknown error occurred');
}

// Add authorization header with token
const getAuthHeaders = (contentType: string = 'application/json') => {
  const token = getToken();
  return {
    ...(contentType ? { 'Content-Type': contentType } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const todoApi = {
  // Authentication methods
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      // Store the token if registration is successful
      if (result.access_token) {
        setToken(result.access_token);
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to register: ${error}`);
    }
  },

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      // Use FormData-like approach for login (as expected by OAuth2PasswordRequestForm)
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const result = await response.json();

      // Store the token if login is successful
      if (result.access_token) {
        setToken(result.access_token);
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to login: ${error}`);
    }
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to get current user: ${error}`);
    }
  },

  // Todo methods with authentication
  async getAll(): Promise<Todo[]> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/todos`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error}`);
    }
  },

  async create(todoData: CreateTodoData): Promise<Todo> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(todoData),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to create todo: ${error}`);
    }
  },

  async update(id: string, todoData: UpdateTodoData): Promise<Todo> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(todoData),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to update todo: ${error}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await fetchWithRetry(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error}`);
    }
  },

  // Profile methods
  async getProfile(): Promise<User> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/profile/me`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to get profile: ${error}`);
    }
  },

  async updateProfilePicture(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetchWithRetry(`${API_BASE_URL}/profile/picture`, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header when using FormData, it will be set automatically
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      return response.json();
    } catch (error) {
      throw new Error(`Failed to upload profile picture: ${error}`);
    }
  },

  async updateProfile(userData: { email?: string; profile_picture?: string }): Promise<User> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/profile/update`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to update profile: ${error}`);
    }
  }
};