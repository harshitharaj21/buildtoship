import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to make authenticated HTTP requests to the Express backend
 */
async function request(endpoint, options = {}) {
  // Get active session token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data?.error?.details || [];
    throw error;
  }

  return data;
}

export const taskApi = {
  // GET /api/tasks
  async getTasks() {
    const data = await request('/tasks', { method: 'GET' });
    return data?.tasks || [];
  },

  // POST /api/tasks
  async createTask(title) {
    const data = await request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    return data?.task;
  },

  // PATCH /api/tasks/:id
  async updateTask(id, updatePayload) {
    const data = await request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePayload)
    });
    return data?.task;
  },

  // DELETE /api/tasks/:id
  async deleteTask(id) {
    return await request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};
